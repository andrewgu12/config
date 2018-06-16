Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _workerHelper = require('./workerHelper');

var _workerHelper2 = _interopRequireDefault(_workerHelper);

'use babel';

var grammarScopes = ['source.ts', 'source.tsx'];
var editorClass = 'linter-tslint-compatible-editor';
var idleCallbacks = new Set();
var config = {
  rulesDirectory: null,
  useLocalTslint: false,
  useGlobalTslint: false,
  globalNodePath: null
};

// Worker still hasn't initialized, since the queued idle callbacks are
// done in order, waiting on a newly queued idle callback will ensure that
// the worker has been initialized
var waitOnIdle = _asyncToGenerator(function* () {
  return new Promise(function (resolve) {
    var callbackID = window.requestIdleCallback(function () {
      idleCallbacks['delete'](callbackID);
      resolve();
    });
    idleCallbacks.add(callbackID);
  });
});

exports['default'] = {
  activate: function activate() {
    var _this = this;

    var depsCallbackID = undefined;
    var lintertslintDeps = function lintertslintDeps() {
      idleCallbacks['delete'](depsCallbackID);
      // Install package dependencies
      require('atom-package-deps').install('linter-tslint');
    };
    depsCallbackID = window.requestIdleCallback(lintertslintDeps);
    idleCallbacks.add(depsCallbackID);

    this.subscriptions = new _atom.CompositeDisposable();
    this.workerHelper = new _workerHelper2['default']();

    // Config subscriptions
    this.subscriptions.add(atom.config.observe('linter-tslint.rulesDirectory', function (dir) {
      if (dir && _path2['default'].isAbsolute(dir)) {
        _fs2['default'].stat(dir, function (err, stats) {
          if (stats && stats.isDirectory()) {
            config.rulesDirectory = dir;
            _this.workerHelper.changeConfig('rulesDirectory', dir);
          }
        });
      }
    }), atom.config.observe('linter-tslint.useLocalTslint', function (use) {
      config.useLocalTslint = use;
      _this.workerHelper.changeConfig('useLocalTslint', use);
    }), atom.config.observe('linter-tslint.enableSemanticRules', function (enableSemanticRules) {
      config.enableSemanticRules = enableSemanticRules;
      _this.workerHelper.changeConfig('enableSemanticRules', enableSemanticRules);
    }), atom.config.observe('linter-tslint.useGlobalTslint', function (use) {
      config.useGlobalTslint = use;
      _this.workerHelper.changeConfig('useGlobalTslint', use);
    }), atom.config.observe('linter-tslint.globalNodePath', function (globalNodePath) {
      config.globalNodePath = globalNodePath;
      _this.workerHelper.changeConfig('globalNodePath', globalNodePath);
    }), atom.config.observe('linter-tslint.ignoreTypings', function (ignoreTypings) {
      _this.ignoreTypings = ignoreTypings;
    }), atom.workspace.observeTextEditors(function (textEditor) {
      // Marks each TypeScript editor with a CSS class so that
      // we can enable commands only for TypeScript editors.
      var rootScopes = textEditor.getRootScopeDescriptor().getScopesArray();
      if (rootScopes.some(function (scope) {
        return grammarScopes.includes(scope);
      })) {
        atom.views.getView(textEditor).classList.add(editorClass);
        textEditor.onDidSave(_asyncToGenerator(function* () {
          if (atom.config.get('linter-tslint.fixOnSave')) {
            if (!_this.workerHelper.isRunning()) {
              // Wait for worker to initialize
              yield waitOnIdle();
            }

            yield _this.workerHelper.requestJob('fix', textEditor);
          }
        }));
      }
    }), atom.commands.add('atom-text-editor.' + editorClass, {
      // Command subscriptions
      'linter-tslint:fix-file': _asyncToGenerator(function* () {
        var textEditor = atom.workspace.getActiveTextEditor();

        if (!textEditor || textEditor.isModified()) {
          // Abort for invalid or unsaved text editors
          atom.notifications.addError('Linter-TSLint: Please save before fixing');
          return;
        }

        // The fix replaces the file content and the cursor can jump automatically
        // to the beginning of the file, so save current cursor position
        var cursorPosition = textEditor.getCursorBufferPosition();

        try {
          var results = yield _this.workerHelper.requestJob('fix', textEditor);

          var notificationText = results && results.length === 0 ? 'Linter-TSLint: Fix complete.' : 'Linter-TSLint: Fix attempt complete, but linting errors remain.';

          atom.notifications.addSuccess(notificationText);
        } catch (err) {
          atom.notifications.addWarning(err.message);
        } finally {
          // Restore cursor to the position before fix job
          textEditor.setCursorBufferPosition(cursorPosition);
        }
      })
    }));

    var createWorkerCallback = window.requestIdleCallback(function () {
      _this.workerHelper.startWorker(config);
      idleCallbacks['delete'](createWorkerCallback);
    });
    idleCallbacks.add(createWorkerCallback);
  },

  deactivate: function deactivate() {
    idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    idleCallbacks.clear();
    this.subscriptions.dispose();

    this.workerHelper.terminateWorker();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'TSLint',
      grammarScopes: grammarScopes,
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (textEditor) {
        if (_this2.ignoreTypings && textEditor.getPath().toLowerCase().endsWith('.d.ts')) {
          return [];
        }

        if (!_this2.workerHelper.isRunning()) {
          // Wait for worker to initialize
          yield waitOnIdle();
        }

        var text = textEditor.getText();
        var results = yield _this2.workerHelper.requestJob('lint', textEditor);

        if (textEditor.getText() !== text) {
          // Text has been modified since the lint was triggered, tell linter not to update
          return null;
        }

        return results;
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vLmF0b20vcGFja2FnZXMvbGludGVyLXRzbGludC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUdvQyxNQUFNOztvQkFDekIsTUFBTTs7OztrQkFDUixJQUFJOzs7OzRCQUNNLGdCQUFnQjs7OztBQU56QyxXQUFXLENBQUM7O0FBUVosSUFBTSxhQUFhLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDbEQsSUFBTSxXQUFXLEdBQUcsaUNBQWlDLENBQUM7QUFDdEQsSUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQyxJQUFNLE1BQU0sR0FBRztBQUNiLGdCQUFjLEVBQUUsSUFBSTtBQUNwQixnQkFBYyxFQUFFLEtBQUs7QUFDckIsaUJBQWUsRUFBRSxLQUFLO0FBQ3RCLGdCQUFjLEVBQUUsSUFBSTtDQUNyQixDQUFDOzs7OztBQUtGLElBQU0sVUFBVSxxQkFBRztTQUNqQixJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUN2QixRQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsWUFBTTtBQUNsRCxtQkFBYSxVQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakMsYUFBTyxFQUFFLENBQUM7S0FDWCxDQUFDLENBQUM7QUFDSCxpQkFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUMvQixDQUFDO0NBQUEsQ0FBQSxDQUFDOztxQkFFVTtBQUNiLFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxjQUFjLFlBQUEsQ0FBQztBQUNuQixRQUFNLGdCQUFnQixHQUFHLFNBQW5CLGdCQUFnQixHQUFTO0FBQzdCLG1CQUFhLFVBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFckMsYUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3ZELENBQUM7QUFDRixrQkFBYyxHQUFH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O0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL21pbmdiby8uYXRvbS9wYWNrYWdlcy9saW50ZXItdHNsaW50L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvZXh0ZW5zaW9ucywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgV29ya2VySGVscGVyIGZyb20gJy4vd29ya2VySGVscGVyJztcblxuY29uc3QgZ3JhbW1hclNjb3BlcyA9IFsnc291cmNlLnRzJywgJ3NvdXJjZS50c3gnXTtcbmNvbnN0IGVkaXRvckNsYXNzID0gJ2xpbnRlci10c2xpbnQtY29tcGF0aWJsZS1lZGl0b3InO1xuY29uc3QgaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmNvbnN0IGNvbmZpZyA9IHtcbiAgcnVsZXNEaXJlY3Rvcnk6IG51bGwsXG4gIHVzZUxvY2FsVHNsaW50OiBmYWxzZSxcbiAgdXNlR2xvYmFsVHNsaW50OiBmYWxzZSxcbiAgZ2xvYmFsTm9kZVBhdGg6IG51bGwsXG59O1xuXG4vLyBXb3JrZXIgc3RpbGwgaGFzbid0IGluaXRpYWxpemVkLCBzaW5jZSB0aGUgcXVldWVkIGlkbGUgY2FsbGJhY2tzIGFyZVxuLy8gZG9uZSBpbiBvcmRlciwgd2FpdGluZyBvbiBhIG5ld2x5IHF1ZXVlZCBpZGxlIGNhbGxiYWNrIHdpbGwgZW5zdXJlIHRoYXRcbi8vIHRoZSB3b3JrZXIgaGFzIGJlZW4gaW5pdGlhbGl6ZWRcbmNvbnN0IHdhaXRPbklkbGUgPSBhc3luYyAoKSA9PlxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNvbnN0IGNhbGxiYWNrSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjaygoKSA9PiB7XG4gICAgICBpZGxlQ2FsbGJhY2tzLmRlbGV0ZShjYWxsYmFja0lEKTtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9KTtcbiAgICBpZGxlQ2FsbGJhY2tzLmFkZChjYWxsYmFja0lEKTtcbiAgfSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgbGV0IGRlcHNDYWxsYmFja0lEO1xuICAgIGNvbnN0IGxpbnRlcnRzbGludERlcHMgPSAoKSA9PiB7XG4gICAgICBpZGxlQ2FsbGJhY2tzLmRlbGV0ZShkZXBzQ2FsbGJhY2tJRCk7XG4gICAgICAvLyBJbnN0YWxsIHBhY2thZ2UgZGVwZW5kZW5jaWVzXG4gICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci10c2xpbnQnKTtcbiAgICB9O1xuICAgIGRlcHNDYWxsYmFja0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2sobGludGVydHNsaW50RGVwcyk7XG4gICAgaWRsZUNhbGxiYWNrcy5hZGQoZGVwc0NhbGxiYWNrSUQpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLndvcmtlckhlbHBlciA9IG5ldyBXb3JrZXJIZWxwZXIoKTtcblxuICAgIC8vIENvbmZpZyBzdWJzY3JpcHRpb25zXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci10c2xpbnQucnVsZXNEaXJlY3RvcnknLCAoZGlyKSA9PiB7XG4gICAgICAgIGlmIChkaXIgJiYgcGF0aC5pc0Fic29sdXRlKGRpcikpIHtcbiAgICAgICAgICBmcy5zdGF0KGRpciwgKGVyciwgc3RhdHMpID0+IHtcbiAgICAgICAgICAgIGlmIChzdGF0cyAmJiBzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICAgIGNvbmZpZy5ydWxlc0RpcmVjdG9yeSA9IGRpcjtcbiAgICAgICAgICAgICAgdGhpcy53b3JrZXJIZWxwZXIuY2hhbmdlQ29uZmlnKCdydWxlc0RpcmVjdG9yeScsIGRpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXRzbGludC51c2VMb2NhbFRzbGludCcsICh1c2UpID0+IHtcbiAgICAgICAgY29uZmlnLnVzZUxvY2FsVHNsaW50ID0gdXNlO1xuICAgICAgICB0aGlzLndvcmtlckhlbHBlci5jaGFuZ2VDb25maWcoJ3VzZUxvY2FsVHNsaW50JywgdXNlKTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXRzbGludC5lbmFibGVTZW1hbnRpY1J1bGVzJywgKGVuYWJsZVNlbWFudGljUnVsZXMpID0+IHtcbiAgICAgICAgY29uZmlnLmVuYWJsZVNlbWFudGljUnVsZXMgPSBlbmFibGVTZW1hbnRpY1J1bGVzO1xuICAgICAgICB0aGlzLndvcmtlckhlbHBlci5jaGFuZ2VDb25maWcoJ2VuYWJsZVNlbWFudGljUnVsZXMnLCBlbmFibGVTZW1hbnRpY1J1bGVzKTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXRzbGludC51c2VHbG9iYWxUc2xpbnQnLCAodXNlKSA9PiB7XG4gICAgICAgIGNvbmZpZy51c2VHbG9iYWxUc2xpbnQgPSB1c2U7XG4gICAgICAgIHRoaXMud29ya2VySGVscGVyLmNoYW5nZUNvbmZpZygndXNlR2xvYmFsVHNsaW50JywgdXNlKTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXRzbGludC5nbG9iYWxOb2RlUGF0aCcsIChnbG9iYWxOb2RlUGF0aCkgPT4ge1xuICAgICAgICBjb25maWcuZ2xvYmFsTm9kZVBhdGggPSBnbG9iYWxOb2RlUGF0aDtcbiAgICAgICAgdGhpcy53b3JrZXJIZWxwZXIuY2hhbmdlQ29uZmlnKCdnbG9iYWxOb2RlUGF0aCcsIGdsb2JhbE5vZGVQYXRoKTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXRzbGludC5pZ25vcmVUeXBpbmdzJywgKGlnbm9yZVR5cGluZ3MpID0+IHtcbiAgICAgICAgdGhpcy5pZ25vcmVUeXBpbmdzID0gaWdub3JlVHlwaW5ncztcbiAgICAgIH0pLFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKCh0ZXh0RWRpdG9yKSA9PiB7XG4gICAgICAgIC8vIE1hcmtzIGVhY2ggVHlwZVNjcmlwdCBlZGl0b3Igd2l0aCBhIENTUyBjbGFzcyBzbyB0aGF0XG4gICAgICAgIC8vIHdlIGNhbiBlbmFibGUgY29tbWFuZHMgb25seSBmb3IgVHlwZVNjcmlwdCBlZGl0b3JzLlxuICAgICAgICBjb25zdCByb290U2NvcGVzID0gdGV4dEVkaXRvci5nZXRSb290U2NvcGVEZXNjcmlwdG9yKCkuZ2V0U2NvcGVzQXJyYXkoKTtcbiAgICAgICAgaWYgKHJvb3RTY29wZXMuc29tZShzY29wZSA9PiBncmFtbWFyU2NvcGVzLmluY2x1ZGVzKHNjb3BlKSkpIHtcbiAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcodGV4dEVkaXRvcikuY2xhc3NMaXN0LmFkZChlZGl0b3JDbGFzcyk7XG4gICAgICAgICAgdGV4dEVkaXRvci5vbkRpZFNhdmUoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnbGludGVyLXRzbGludC5maXhPblNhdmUnKSkge1xuICAgICAgICAgICAgICBpZiAoIXRoaXMud29ya2VySGVscGVyLmlzUnVubmluZygpKSB7XG4gICAgICAgICAgICAgICAgLy8gV2FpdCBmb3Igd29ya2VyIHRvIGluaXRpYWxpemVcbiAgICAgICAgICAgICAgICBhd2FpdCB3YWl0T25JZGxlKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBhd2FpdCB0aGlzLndvcmtlckhlbHBlci5yZXF1ZXN0Sm9iKCdmaXgnLCB0ZXh0RWRpdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZChgYXRvbS10ZXh0LWVkaXRvci4ke2VkaXRvckNsYXNzfWAsIHtcbiAgICAgICAgLy8gQ29tbWFuZCBzdWJzY3JpcHRpb25zXG4gICAgICAgICdsaW50ZXItdHNsaW50OmZpeC1maWxlJzogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICAgICAgICBpZiAoIXRleHRFZGl0b3IgfHwgdGV4dEVkaXRvci5pc01vZGlmaWVkKCkpIHtcbiAgICAgICAgICAgIC8vIEFib3J0IGZvciBpbnZhbGlkIG9yIHVuc2F2ZWQgdGV4dCBlZGl0b3JzXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0xpbnRlci1UU0xpbnQ6IFBsZWFzZSBzYXZlIGJlZm9yZSBmaXhpbmcnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUaGUgZml4IHJlcGxhY2VzIHRoZSBmaWxlIGNvbnRlbnQgYW5kIHRoZSBjdXJzb3IgY2FuIGp1bXAgYXV0b21hdGljYWxseVxuICAgICAgICAgIC8vIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGUsIHNvIHNhdmUgY3VycmVudCBjdXJzb3IgcG9zaXRpb25cbiAgICAgICAgICBjb25zdCBjdXJzb3JQb3NpdGlvbiA9IHRleHRFZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy53b3JrZXJIZWxwZXIucmVxdWVzdEpvYignZml4JywgdGV4dEVkaXRvcik7XG5cbiAgICAgICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvblRleHQgPSByZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID09PSAwID9cbiAgICAgICAgICAgICAgJ0xpbnRlci1UU0xpbnQ6IEZpeCBjb21wbGV0ZS4nIDpcbiAgICAgICAgICAgICAgJ0xpbnRlci1UU0xpbnQ6IEZpeCBhdHRlbXB0IGNvbXBsZXRlLCBidXQgbGludGluZyBlcnJvcnMgcmVtYWluLic7XG5cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKG5vdGlmaWNhdGlvblRleHQpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAvLyBSZXN0b3JlIGN1cnNvciB0byB0aGUgcG9zaXRpb24gYmVmb3JlIGZpeCBqb2JcbiAgICAgICAgICAgIHRleHRFZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oY3Vyc29yUG9zaXRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICBjb25zdCBjcmVhdGVXb3JrZXJDYWxsYmFjayA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgIHRoaXMud29ya2VySGVscGVyLnN0YXJ0V29ya2VyKGNvbmZpZyk7XG4gICAgICBpZGxlQ2FsbGJhY2tzLmRlbGV0ZShjcmVhdGVXb3JrZXJDYWxsYmFjayk7XG4gICAgfSk7XG4gICAgaWRsZUNhbGxiYWNrcy5hZGQoY3JlYXRlV29ya2VyQ2FsbGJhY2spO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSk7XG4gICAgaWRsZUNhbGxiYWNrcy5jbGVhcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cbiAgICB0aGlzLndvcmtlckhlbHBlci50ZXJtaW5hdGVXb3JrZXIoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnVFNMaW50JyxcbiAgICAgIGdyYW1tYXJTY29wZXMsXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogYXN5bmMgKHRleHRFZGl0b3IpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaWdub3JlVHlwaW5ncyAmJiB0ZXh0RWRpdG9yLmdldFBhdGgoKS50b0xvd2VyQ2FzZSgpLmVuZHNXaXRoKCcuZC50cycpKSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLndvcmtlckhlbHBlci5pc1J1bm5pbmcoKSkge1xuICAgICAgICAgIC8vIFdhaXQgZm9yIHdvcmtlciB0byBpbml0aWFsaXplXG4gICAgICAgICAgYXdhaXQgd2FpdE9uSWRsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy53b3JrZXJIZWxwZXIucmVxdWVzdEpvYignbGludCcsIHRleHRFZGl0b3IpO1xuXG4gICAgICAgIGlmICh0ZXh0RWRpdG9yLmdldFRleHQoKSAhPT0gdGV4dCkge1xuICAgICAgICAgIC8vIFRleHQgaGFzIGJlZW4gbW9kaWZpZWQgc2luY2UgdGhlIGxpbnQgd2FzIHRyaWdnZXJlZCwgdGVsbCBsaW50ZXIgbm90IHRvIHVwZGF0ZVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19
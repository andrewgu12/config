(function() {
  var ATOM_VARIABLES, ColorBuffer, ColorProject, ColorSearch, CompositeDisposable, Emitter, Palette, PathsLoader, PathsScanner, Range, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, THEME_VARIABLES, VariablesCollection, compareArray, minimatch, ref, scopeFromFileName,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], ColorBuffer = ref[0], ColorSearch = ref[1], Palette = ref[2], VariablesCollection = ref[3], PathsLoader = ref[4], PathsScanner = ref[5], Emitter = ref[6], CompositeDisposable = ref[7], Range = ref[8], SERIALIZE_VERSION = ref[9], SERIALIZE_MARKERS_VERSION = ref[10], THEME_VARIABLES = ref[11], ATOM_VARIABLES = ref[12], scopeFromFileName = ref[13], minimatch = ref[14];

  compareArray = function(a, b) {
    var i, j, len, v;
    if ((a == null) || (b == null)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (i = j = 0, len = a.length; j < len; i = ++j) {
      v = a[i];
      if (v !== b[i]) {
        return false;
      }
    }
    return true;
  };

  module.exports = ColorProject = (function() {
    ColorProject.deserialize = function(state) {
      var markersVersion, ref1;
      if (SERIALIZE_VERSION == null) {
        ref1 = require('./versions'), SERIALIZE_VERSION = ref1.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = ref1.SERIALIZE_MARKERS_VERSION;
      }
      markersVersion = SERIALIZE_MARKERS_VERSION;
      if (atom.inDevMode() && atom.project.getPaths().some(function(p) {
        return p.match(/\/pigments$/);
      })) {
        markersVersion += '-dev';
      }
      if ((state != null ? state.version : void 0) !== SERIALIZE_VERSION) {
        state = {};
      }
      if ((state != null ? state.markersVersion : void 0) !== markersVersion) {
        delete state.variables;
        delete state.buffers;
      }
      if (!compareArray(state.globalSourceNames, atom.config.get('pigments.sourceNames')) || !compareArray(state.globalIgnoredNames, atom.config.get('pigments.ignoredNames'))) {
        delete state.variables;
        delete state.buffers;
        delete state.paths;
      }
      return new ColorProject(state);
    };

    function ColorProject(state) {
      var buffers, ref1, svgColorExpression, timestamp, variables;
      if (state == null) {
        state = {};
      }
      if (Emitter == null) {
        ref1 = require('atom'), Emitter = ref1.Emitter, CompositeDisposable = ref1.CompositeDisposable, Range = ref1.Range;
      }
      if (VariablesCollection == null) {
        VariablesCollection = require('./variables-collection');
      }
      this.includeThemes = state.includeThemes, this.ignoredNames = state.ignoredNames, this.sourceNames = state.sourceNames, this.ignoredScopes = state.ignoredScopes, this.paths = state.paths, this.searchNames = state.searchNames, this.ignoreGlobalSourceNames = state.ignoreGlobalSourceNames, this.ignoreGlobalIgnoredNames = state.ignoreGlobalIgnoredNames, this.ignoreGlobalIgnoredScopes = state.ignoreGlobalIgnoredScopes, this.ignoreGlobalSearchNames = state.ignoreGlobalSearchNames, this.ignoreGlobalSupportedFiletypes = state.ignoreGlobalSupportedFiletypes, this.supportedFiletypes = state.supportedFiletypes, variables = state.variables, timestamp = state.timestamp, buffers = state.buffers;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.colorBuffersByEditorId = {};
      this.bufferStates = buffers != null ? buffers : {};
      this.variableExpressionsRegistry = require('./variable-expressions');
      this.colorExpressionsRegistry = require('./color-expressions');
      if (variables != null) {
        this.variables = atom.deserializers.deserialize(variables);
      } else {
        this.variables = new VariablesCollection;
      }
      this.subscriptions.add(this.variables.onDidChange((function(_this) {
        return function(results) {
          return _this.emitVariablesChangeEvent(results);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.sourceNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredBufferNames', (function(_this) {
        return function(ignoredBufferNames) {
          _this.ignoredBufferNames = ignoredBufferNames;
          return _this.updateColorBuffers();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredScopes', (function(_this) {
        return function() {
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.supportedFiletypes', (function(_this) {
        return function() {
          _this.updateIgnoredFiletypes();
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoreVcsIgnoredPaths', (function(_this) {
        return function() {
          return _this.loadPathsAndVariables();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.sassShadeAndTintImplementation', (function(_this) {
        return function() {
          return _this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
            registry: _this.colorExpressionsRegistry
          });
        };
      })(this)));
      svgColorExpression = this.colorExpressionsRegistry.getExpression('pigments:named_colors');
      this.subscriptions.add(atom.config.observe('pigments.filetypesForColorWords', (function(_this) {
        return function(scopes) {
          svgColorExpression.scopes = scopes != null ? scopes : [];
          return _this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
            name: svgColorExpression.name,
            registry: _this.colorExpressionsRegistry
          });
        };
      })(this)));
      this.subscriptions.add(this.colorExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function(arg) {
          var name;
          name = arg.name;
          if ((_this.paths == null) || name === 'pigments:variables') {
            return;
          }
          return _this.variables.evaluateVariables(_this.variables.getVariables(), function() {
            var colorBuffer, id, ref2, results1;
            ref2 = _this.colorBuffersByEditorId;
            results1 = [];
            for (id in ref2) {
              colorBuffer = ref2[id];
              results1.push(colorBuffer.update());
            }
            return results1;
          });
        };
      })(this)));
      this.subscriptions.add(this.variableExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function() {
          if (_this.paths == null) {
            return;
          }
          return _this.reloadVariablesForPaths(_this.getPaths());
        };
      })(this)));
      if (timestamp != null) {
        this.timestamp = new Date(Date.parse(timestamp));
      }
      this.updateIgnoredFiletypes();
      if (this.paths != null) {
        this.initialize();
      }
      this.initializeBuffers();
    }

    ColorProject.prototype.onDidInitialize = function(callback) {
      return this.emitter.on('did-initialize', callback);
    };

    ColorProject.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    ColorProject.prototype.onDidUpdateVariables = function(callback) {
      return this.emitter.on('did-update-variables', callback);
    };

    ColorProject.prototype.onDidCreateColorBuffer = function(callback) {
      return this.emitter.on('did-create-color-buffer', callback);
    };

    ColorProject.prototype.onDidChangeIgnoredScopes = function(callback) {
      return this.emitter.on('did-change-ignored-scopes', callback);
    };

    ColorProject.prototype.onDidChangePaths = function(callback) {
      return this.emitter.on('did-change-paths', callback);
    };

    ColorProject.prototype.observeColorBuffers = function(callback) {
      var colorBuffer, id, ref1;
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        colorBuffer = ref1[id];
        callback(colorBuffer);
      }
      return this.onDidCreateColorBuffer(callback);
    };

    ColorProject.prototype.isInitialized = function() {
      return this.initialized;
    };

    ColorProject.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    ColorProject.prototype.initialize = function() {
      if (this.isInitialized()) {
        return Promise.resolve(this.variables.getVariables());
      }
      if (this.initializePromise != null) {
        return this.initializePromise;
      }
      return this.initializePromise = new Promise((function(_this) {
        return function(resolve) {
          return _this.variables.onceInitialized(resolve);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.loadPathsAndVariables();
        };
      })(this)).then((function(_this) {
        return function() {
          if (_this.includeThemes) {
            return _this.includeThemesVariables();
          }
        };
      })(this)).then((function(_this) {
        return function() {
          var variables;
          _this.initialized = true;
          variables = _this.variables.getVariables();
          _this.emitter.emit('did-initialize', variables);
          return variables;
        };
      })(this));
    };

    ColorProject.prototype.destroy = function() {
      var buffer, id, ref1;
      if (this.destroyed) {
        return;
      }
      if (PathsScanner == null) {
        PathsScanner = require('./paths-scanner');
      }
      this.destroyed = true;
      PathsScanner.terminateRunningTask();
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        buffer = ref1[id];
        buffer.destroy();
      }
      this.colorBuffersByEditorId = null;
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.emitter.emit('did-destroy', this);
      return this.emitter.dispose();
    };

    ColorProject.prototype.reload = function() {
      return this.initialize().then((function(_this) {
        return function() {
          _this.variables.reset();
          _this.paths = [];
          return _this.loadPathsAndVariables();
        };
      })(this)).then((function(_this) {
        return function() {
          if (atom.config.get('pigments.notifyReloads')) {
            return atom.notifications.addSuccess("Pigments successfully reloaded", {
              dismissable: atom.config.get('pigments.dismissableReloadNotifications'),
              description: "Found:\n- **" + _this.paths.length + "** path(s)\n- **" + (_this.getVariables().length) + "** variables(s) including **" + (_this.getColorVariables().length) + "** color(s)"
            });
          } else {
            return console.log("Found:\n- " + _this.paths.length + " path(s)\n- " + (_this.getVariables().length) + " variables(s) including " + (_this.getColorVariables().length) + " color(s)");
          }
        };
      })(this))["catch"](function(reason) {
        var detail, stack;
        detail = reason.message;
        stack = reason.stack;
        atom.notifications.addError("Pigments couldn't be reloaded", {
          detail: detail,
          stack: stack,
          dismissable: true
        });
        return console.error(reason);
      });
    };

    ColorProject.prototype.loadPathsAndVariables = function() {
      var destroyed;
      destroyed = null;
      return this.loadPaths().then((function(_this) {
        return function(arg) {
          var dirtied, j, len, path, removed;
          dirtied = arg.dirtied, removed = arg.removed;
          if (removed.length > 0) {
            _this.paths = _this.paths.filter(function(p) {
              return indexOf.call(removed, p) < 0;
            });
            _this.deleteVariablesForPaths(removed);
          }
          if ((_this.paths != null) && dirtied.length > 0) {
            for (j = 0, len = dirtied.length; j < len; j++) {
              path = dirtied[j];
              if (indexOf.call(_this.paths, path) < 0) {
                _this.paths.push(path);
              }
            }
            if (_this.variables.length) {
              return dirtied;
            } else {
              return _this.paths;
            }
          } else if (_this.paths == null) {
            return _this.paths = dirtied;
          } else if (!_this.variables.length) {
            return _this.paths;
          } else {
            return [];
          }
        };
      })(this)).then((function(_this) {
        return function(paths) {
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          if (results != null) {
            return _this.variables.updateCollection(results);
          }
        };
      })(this));
    };

    ColorProject.prototype.findAllColors = function() {
      var patterns;
      if (ColorSearch == null) {
        ColorSearch = require('./color-search');
      }
      patterns = this.getSearchNames();
      return new ColorSearch({
        sourceNames: patterns,
        project: this,
        ignoredNames: this.getIgnoredNames(),
        context: this.getContext()
      });
    };

    ColorProject.prototype.setColorPickerAPI = function(colorPickerAPI) {
      this.colorPickerAPI = colorPickerAPI;
    };

    ColorProject.prototype.initializeBuffers = function() {
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var buffer, bufferElement, editorPath;
          editorPath = editor.getPath();
          if ((editorPath == null) || _this.isBufferIgnored(editorPath)) {
            return;
          }
          buffer = _this.colorBufferForEditor(editor);
          if (buffer != null) {
            bufferElement = atom.views.getView(buffer);
            return bufferElement.attach();
          }
        };
      })(this)));
    };

    ColorProject.prototype.hasColorBufferForEditor = function(editor) {
      if (this.destroyed || (editor == null)) {
        return false;
      }
      return this.colorBuffersByEditorId[editor.id] != null;
    };

    ColorProject.prototype.colorBufferForEditor = function(editor) {
      var buffer, state, subscription;
      if (this.destroyed) {
        return;
      }
      if (editor == null) {
        return;
      }
      if (ColorBuffer == null) {
        ColorBuffer = require('./color-buffer');
      }
      if (this.colorBuffersByEditorId[editor.id] != null) {
        return this.colorBuffersByEditorId[editor.id];
      }
      if (this.bufferStates[editor.id] != null) {
        state = this.bufferStates[editor.id];
        state.editor = editor;
        state.project = this;
        delete this.bufferStates[editor.id];
      } else {
        state = {
          editor: editor,
          project: this
        };
      }
      this.colorBuffersByEditorId[editor.id] = buffer = new ColorBuffer(state);
      this.subscriptions.add(subscription = buffer.onDidDestroy((function(_this) {
        return function() {
          _this.subscriptions.remove(subscription);
          subscription.dispose();
          return delete _this.colorBuffersByEditorId[editor.id];
        };
      })(this)));
      this.emitter.emit('did-create-color-buffer', buffer);
      return buffer;
    };

    ColorProject.prototype.colorBufferForPath = function(path) {
      var colorBuffer, id, ref1;
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        colorBuffer = ref1[id];
        if (colorBuffer.editor.getPath() === path) {
          return colorBuffer;
        }
      }
    };

    ColorProject.prototype.updateColorBuffers = function() {
      var buffer, bufferElement, e, editor, id, j, len, ref1, ref2, results1;
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        buffer = ref1[id];
        if (this.isBufferIgnored(buffer.editor.getPath())) {
          buffer.destroy();
          delete this.colorBuffersByEditorId[id];
        }
      }
      try {
        if (this.colorBuffersByEditorId != null) {
          ref2 = atom.workspace.getTextEditors();
          results1 = [];
          for (j = 0, len = ref2.length; j < len; j++) {
            editor = ref2[j];
            if (this.hasColorBufferForEditor(editor) || this.isBufferIgnored(editor.getPath())) {
              continue;
            }
            buffer = this.colorBufferForEditor(editor);
            if (buffer != null) {
              bufferElement = atom.views.getView(buffer);
              results1.push(bufferElement.attach());
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }
      } catch (error) {
        e = error;
        return console.log(e);
      }
    };

    ColorProject.prototype.isBufferIgnored = function(path) {
      var j, len, ref1, source, sources;
      if (minimatch == null) {
        minimatch = require('minimatch');
      }
      path = atom.project.relativize(path);
      sources = (ref1 = this.ignoredBufferNames) != null ? ref1 : [];
      for (j = 0, len = sources.length; j < len; j++) {
        source = sources[j];
        if (minimatch(path, source, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
      return false;
    };

    ColorProject.prototype.getPaths = function() {
      var ref1;
      return (ref1 = this.paths) != null ? ref1.slice() : void 0;
    };

    ColorProject.prototype.appendPath = function(path) {
      if (path != null) {
        return this.paths.push(path);
      }
    };

    ColorProject.prototype.hasPath = function(path) {
      var ref1;
      return indexOf.call((ref1 = this.paths) != null ? ref1 : [], path) >= 0;
    };

    ColorProject.prototype.loadPaths = function(noKnownPaths) {
      if (noKnownPaths == null) {
        noKnownPaths = false;
      }
      if (PathsLoader == null) {
        PathsLoader = require('./paths-loader');
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var config, knownPaths, ref1, rootPaths;
          rootPaths = _this.getRootPaths();
          knownPaths = noKnownPaths ? [] : (ref1 = _this.paths) != null ? ref1 : [];
          config = {
            knownPaths: knownPaths,
            timestamp: _this.timestamp,
            ignoredNames: _this.getIgnoredNames(),
            paths: rootPaths,
            traverseIntoSymlinkDirectories: atom.config.get('pigments.traverseIntoSymlinkDirectories'),
            sourceNames: _this.getSourceNames(),
            ignoreVcsIgnores: atom.config.get('pigments.ignoreVcsIgnoredPaths')
          };
          return PathsLoader.startTask(config, function(results) {
            var isDescendentOfRootPaths, j, len, p;
            for (j = 0, len = knownPaths.length; j < len; j++) {
              p = knownPaths[j];
              isDescendentOfRootPaths = rootPaths.some(function(root) {
                return p.indexOf(root) === 0;
              });
              if (!isDescendentOfRootPaths) {
                if (results.removed == null) {
                  results.removed = [];
                }
                results.removed.push(p);
              }
            }
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.updatePaths = function() {
      if (!this.initialized) {
        return Promise.resolve();
      }
      return this.loadPaths().then((function(_this) {
        return function(arg) {
          var dirtied, j, len, p, removed;
          dirtied = arg.dirtied, removed = arg.removed;
          _this.deleteVariablesForPaths(removed);
          _this.paths = _this.paths.filter(function(p) {
            return indexOf.call(removed, p) < 0;
          });
          for (j = 0, len = dirtied.length; j < len; j++) {
            p = dirtied[j];
            if (indexOf.call(_this.paths, p) < 0) {
              _this.paths.push(p);
            }
          }
          _this.emitter.emit('did-change-paths', _this.getPaths());
          return _this.reloadVariablesForPaths(dirtied);
        };
      })(this));
    };

    ColorProject.prototype.isVariablesSourcePath = function(path) {
      var j, len, source, sources;
      if (!path) {
        return false;
      }
      if (minimatch == null) {
        minimatch = require('minimatch');
      }
      path = atom.project.relativize(path);
      sources = this.getSourceNames();
      for (j = 0, len = sources.length; j < len; j++) {
        source = sources[j];
        if (minimatch(path, source, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.isIgnoredPath = function(path) {
      var ignore, ignoredNames, j, len;
      if (!path) {
        return false;
      }
      if (minimatch == null) {
        minimatch = require('minimatch');
      }
      path = atom.project.relativize(path);
      ignoredNames = this.getIgnoredNames();
      for (j = 0, len = ignoredNames.length; j < len; j++) {
        ignore = ignoredNames[j];
        if (minimatch(path, ignore, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.scopeFromFileName = function(path) {
      var scope;
      if (scopeFromFileName == null) {
        scopeFromFileName = require('./scope-from-file-name');
      }
      scope = scopeFromFileName(path);
      if (scope === 'sass' || scope === 'scss') {
        scope = [scope, this.getSassScopeSuffix()].join(':');
      }
      return scope;
    };

    ColorProject.prototype.getPalette = function() {
      if (Palette == null) {
        Palette = require('./palette');
      }
      if (!this.isInitialized()) {
        return new Palette;
      }
      return new Palette(this.getColorVariables());
    };

    ColorProject.prototype.getContext = function() {
      return this.variables.getContext();
    };

    ColorProject.prototype.getVariables = function() {
      return this.variables.getVariables();
    };

    ColorProject.prototype.getVariableExpressionsRegistry = function() {
      return this.variableExpressionsRegistry;
    };

    ColorProject.prototype.getVariableById = function(id) {
      return this.variables.getVariableById(id);
    };

    ColorProject.prototype.getVariableByName = function(name) {
      return this.variables.getVariableByName(name);
    };

    ColorProject.prototype.getColorVariables = function() {
      return this.variables.getColorVariables();
    };

    ColorProject.prototype.getColorExpressionsRegistry = function() {
      return this.colorExpressionsRegistry;
    };

    ColorProject.prototype.showVariableInFile = function(variable) {
      return atom.workspace.open(variable.path).then(function(editor) {
        var buffer, bufferRange, ref1;
        if (Range == null) {
          ref1 = require('atom'), Emitter = ref1.Emitter, CompositeDisposable = ref1.CompositeDisposable, Range = ref1.Range;
        }
        buffer = editor.getBuffer();
        bufferRange = Range.fromObject([buffer.positionForCharacterIndex(variable.range[0]), buffer.positionForCharacterIndex(variable.range[1])]);
        return editor.setSelectedBufferRange(bufferRange, {
          autoscroll: true
        });
      });
    };

    ColorProject.prototype.emitVariablesChangeEvent = function(results) {
      return this.emitter.emit('did-update-variables', results);
    };

    ColorProject.prototype.loadVariablesForPath = function(path) {
      return this.loadVariablesForPaths([path]);
    };

    ColorProject.prototype.loadVariablesForPaths = function(paths) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.scanPathsForVariables(paths, function(results) {
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.getVariablesForPath = function(path) {
      return this.variables.getVariablesForPath(path);
    };

    ColorProject.prototype.getVariablesForPaths = function(paths) {
      return this.variables.getVariablesForPaths(paths);
    };

    ColorProject.prototype.deleteVariablesForPath = function(path) {
      return this.deleteVariablesForPaths([path]);
    };

    ColorProject.prototype.deleteVariablesForPaths = function(paths) {
      return this.variables.deleteVariablesForPaths(paths);
    };

    ColorProject.prototype.reloadVariablesForPath = function(path) {
      return this.reloadVariablesForPaths([path]);
    };

    ColorProject.prototype.reloadVariablesForPaths = function(paths) {
      var promise;
      promise = Promise.resolve();
      if (!this.isInitialized()) {
        promise = this.initialize();
      }
      return promise.then((function(_this) {
        return function() {
          if (paths.some(function(path) {
            return indexOf.call(_this.paths, path) < 0;
          })) {
            return Promise.resolve([]);
          }
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.variables.updateCollection(results, paths);
        };
      })(this));
    };

    ColorProject.prototype.scanPathsForVariables = function(paths, callback) {
      var colorBuffer;
      if (paths.length === 1 && (colorBuffer = this.colorBufferForPath(paths[0]))) {
        return colorBuffer.scanBufferForVariables().then(function(results) {
          return callback(results);
        });
      } else {
        if (PathsScanner == null) {
          PathsScanner = require('./paths-scanner');
        }
        return PathsScanner.startTask(paths.map((function(_this) {
          return function(p) {
            return [p, _this.scopeFromFileName(p)];
          };
        })(this)), this.variableExpressionsRegistry, function(results) {
          return callback(results);
        });
      }
    };

    ColorProject.prototype.loadThemesVariables = function() {
      var div, html, iterator, variables;
      if (THEME_VARIABLES == null) {
        THEME_VARIABLES = require('./uris').THEME_VARIABLES;
      }
      if (ATOM_VARIABLES == null) {
        ATOM_VARIABLES = require('./atom-variables');
      }
      iterator = 0;
      variables = [];
      html = '';
      ATOM_VARIABLES.forEach(function(v) {
        return html += "<div class='" + v + "'>" + v + "</div>";
      });
      div = document.createElement('div');
      div.className = 'pigments-sampler';
      div.innerHTML = html;
      document.body.appendChild(div);
      ATOM_VARIABLES.forEach(function(v, i) {
        var color, end, node, variable;
        node = div.children[i];
        color = getComputedStyle(node).color;
        end = iterator + v.length + color.length + 4;
        variable = {
          name: "@" + v,
          line: i,
          value: color,
          range: [iterator, end],
          path: THEME_VARIABLES
        };
        iterator = end;
        return variables.push(variable);
      });
      document.body.removeChild(div);
      return variables;
    };

    ColorProject.prototype.getRootPaths = function() {
      return atom.project.getPaths();
    };

    ColorProject.prototype.getSassScopeSuffix = function() {
      var ref1, ref2;
      return (ref1 = (ref2 = this.sassShadeAndTintImplementation) != null ? ref2 : atom.config.get('pigments.sassShadeAndTintImplementation')) != null ? ref1 : 'compass';
    };

    ColorProject.prototype.setSassShadeAndTintImplementation = function(sassShadeAndTintImplementation) {
      this.sassShadeAndTintImplementation = sassShadeAndTintImplementation;
      return this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
        registry: this.colorExpressionsRegistry
      });
    };

    ColorProject.prototype.getSourceNames = function() {
      var names, ref1, ref2;
      names = ['.pigments'];
      names = names.concat((ref1 = this.sourceNames) != null ? ref1 : []);
      if (!this.ignoreGlobalSourceNames) {
        names = names.concat((ref2 = atom.config.get('pigments.sourceNames')) != null ? ref2 : []);
      }
      return names;
    };

    ColorProject.prototype.setSourceNames = function(sourceNames) {
      this.sourceNames = sourceNames != null ? sourceNames : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return;
      }
      return this.initialize().then((function(_this) {
        return function() {
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalSourceNames = function(ignoreGlobalSourceNames) {
      this.ignoreGlobalSourceNames = ignoreGlobalSourceNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getSearchNames = function() {
      var names, ref1, ref2, ref3, ref4;
      names = [];
      names = names.concat((ref1 = this.sourceNames) != null ? ref1 : []);
      names = names.concat((ref2 = this.searchNames) != null ? ref2 : []);
      if (!this.ignoreGlobalSearchNames) {
        names = names.concat((ref3 = atom.config.get('pigments.sourceNames')) != null ? ref3 : []);
        names = names.concat((ref4 = atom.config.get('pigments.extendedSearchNames')) != null ? ref4 : []);
      }
      return names;
    };

    ColorProject.prototype.setSearchNames = function(searchNames) {
      this.searchNames = searchNames != null ? searchNames : [];
    };

    ColorProject.prototype.setIgnoreGlobalSearchNames = function(ignoreGlobalSearchNames) {
      this.ignoreGlobalSearchNames = ignoreGlobalSearchNames;
    };

    ColorProject.prototype.getIgnoredNames = function() {
      var names, ref1, ref2, ref3;
      names = (ref1 = this.ignoredNames) != null ? ref1 : [];
      if (!this.ignoreGlobalIgnoredNames) {
        names = names.concat((ref2 = this.getGlobalIgnoredNames()) != null ? ref2 : []);
        names = names.concat((ref3 = atom.config.get('core.ignoredNames')) != null ? ref3 : []);
      }
      return names;
    };

    ColorProject.prototype.getGlobalIgnoredNames = function() {
      var ref1;
      return (ref1 = atom.config.get('pigments.ignoredNames')) != null ? ref1.map(function(p) {
        if (/\/\*$/.test(p)) {
          return p + '*';
        } else {
          return p;
        }
      }) : void 0;
    };

    ColorProject.prototype.setIgnoredNames = function(ignoredNames1) {
      this.ignoredNames = ignoredNames1 != null ? ignoredNames1 : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return Promise.reject('Project is not initialized yet');
      }
      return this.initialize().then((function(_this) {
        return function() {
          var dirtied;
          dirtied = _this.paths.filter(function(p) {
            return _this.isIgnoredPath(p);
          });
          _this.deleteVariablesForPaths(dirtied);
          _this.paths = _this.paths.filter(function(p) {
            return !_this.isIgnoredPath(p);
          });
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredNames = function(ignoreGlobalIgnoredNames) {
      this.ignoreGlobalIgnoredNames = ignoreGlobalIgnoredNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getIgnoredScopes = function() {
      var ref1, ref2, scopes;
      scopes = (ref1 = this.ignoredScopes) != null ? ref1 : [];
      if (!this.ignoreGlobalIgnoredScopes) {
        scopes = scopes.concat((ref2 = atom.config.get('pigments.ignoredScopes')) != null ? ref2 : []);
      }
      scopes = scopes.concat(this.ignoredFiletypes);
      return scopes;
    };

    ColorProject.prototype.setIgnoredScopes = function(ignoredScopes) {
      this.ignoredScopes = ignoredScopes != null ? ignoredScopes : [];
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredScopes = function(ignoreGlobalIgnoredScopes) {
      this.ignoreGlobalIgnoredScopes = ignoreGlobalIgnoredScopes;
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setSupportedFiletypes = function(supportedFiletypes) {
      this.supportedFiletypes = supportedFiletypes != null ? supportedFiletypes : [];
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.updateIgnoredFiletypes = function() {
      return this.ignoredFiletypes = this.getIgnoredFiletypes();
    };

    ColorProject.prototype.getIgnoredFiletypes = function() {
      var filetypes, ref1, ref2, scopes;
      filetypes = (ref1 = this.supportedFiletypes) != null ? ref1 : [];
      if (!this.ignoreGlobalSupportedFiletypes) {
        filetypes = filetypes.concat((ref2 = atom.config.get('pigments.supportedFiletypes')) != null ? ref2 : []);
      }
      if (filetypes.length === 0) {
        filetypes = ['*'];
      }
      if (filetypes.some(function(type) {
        return type === '*';
      })) {
        return [];
      }
      scopes = filetypes.map(function(ext) {
        var ref3;
        return (ref3 = atom.grammars.selectGrammar("file." + ext)) != null ? ref3.scopeName.replace(/\./g, '\\.') : void 0;
      }).filter(function(scope) {
        return scope != null;
      });
      return ["^(?!\\.(" + (scopes.join('|')) + "))"];
    };

    ColorProject.prototype.setIgnoreGlobalSupportedFiletypes = function(ignoreGlobalSupportedFiletypes) {
      this.ignoreGlobalSupportedFiletypes = ignoreGlobalSupportedFiletypes;
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.themesIncluded = function() {
      return this.includeThemes;
    };

    ColorProject.prototype.setIncludeThemes = function(includeThemes) {
      if (includeThemes === this.includeThemes) {
        return Promise.resolve();
      }
      this.includeThemes = includeThemes;
      if (this.includeThemes) {
        return this.includeThemesVariables();
      } else {
        return this.disposeThemesVariables();
      }
    };

    ColorProject.prototype.includeThemesVariables = function() {
      this.themesSubscription = atom.themes.onDidChangeActiveThemes((function(_this) {
        return function() {
          var variables;
          if (!_this.includeThemes) {
            return;
          }
          if (THEME_VARIABLES == null) {
            THEME_VARIABLES = require('./uris').THEME_VARIABLES;
          }
          variables = _this.loadThemesVariables();
          return _this.variables.updatePathCollection(THEME_VARIABLES, variables);
        };
      })(this));
      this.subscriptions.add(this.themesSubscription);
      return this.variables.addMany(this.loadThemesVariables());
    };

    ColorProject.prototype.disposeThemesVariables = function() {
      if (THEME_VARIABLES == null) {
        THEME_VARIABLES = require('./uris').THEME_VARIABLES;
      }
      this.subscriptions.remove(this.themesSubscription);
      this.variables.deleteVariablesForPaths([THEME_VARIABLES]);
      return this.themesSubscription.dispose();
    };

    ColorProject.prototype.getTimestamp = function() {
      return new Date();
    };

    ColorProject.prototype.serialize = function() {
      var data, ref1;
      if (SERIALIZE_VERSION == null) {
        ref1 = require('./versions'), SERIALIZE_VERSION = ref1.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = ref1.SERIALIZE_MARKERS_VERSION;
      }
      data = {
        deserializer: 'ColorProject',
        timestamp: this.getTimestamp(),
        version: SERIALIZE_VERSION,
        markersVersion: SERIALIZE_MARKERS_VERSION,
        globalSourceNames: atom.config.get('pigments.sourceNames'),
        globalIgnoredNames: atom.config.get('pigments.ignoredNames')
      };
      if (this.ignoreGlobalSourceNames != null) {
        data.ignoreGlobalSourceNames = this.ignoreGlobalSourceNames;
      }
      if (this.ignoreGlobalSearchNames != null) {
        data.ignoreGlobalSearchNames = this.ignoreGlobalSearchNames;
      }
      if (this.ignoreGlobalIgnoredNames != null) {
        data.ignoreGlobalIgnoredNames = this.ignoreGlobalIgnoredNames;
      }
      if (this.ignoreGlobalIgnoredScopes != null) {
        data.ignoreGlobalIgnoredScopes = this.ignoreGlobalIgnoredScopes;
      }
      if (this.includeThemes != null) {
        data.includeThemes = this.includeThemes;
      }
      if (this.ignoredScopes != null) {
        data.ignoredScopes = this.ignoredScopes;
      }
      if (this.ignoredNames != null) {
        data.ignoredNames = this.ignoredNames;
      }
      if (this.sourceNames != null) {
        data.sourceNames = this.sourceNames;
      }
      if (this.searchNames != null) {
        data.searchNames = this.searchNames;
      }
      data.buffers = this.serializeBuffers();
      if (this.isInitialized()) {
        data.paths = this.paths;
        data.variables = this.variables.serialize();
      }
      return data;
    };

    ColorProject.prototype.serializeBuffers = function() {
      var colorBuffer, id, out, ref1;
      out = {};
      ref1 = this.colorBuffersByEditorId;
      for (id in ref1) {
        colorBuffer = ref1[id];
        out[id] = colorBuffer.serialize();
      }
      return out;
    };

    return ColorProject;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL21pbmdiby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItcHJvamVjdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9RQUFBO0lBQUE7O0VBQUEsTUFRSSxFQVJKLEVBQ0Usb0JBREYsRUFDZSxvQkFEZixFQUVFLGdCQUZGLEVBRVcsNEJBRlgsRUFHRSxvQkFIRixFQUdlLHFCQUhmLEVBSUUsZ0JBSkYsRUFJVyw0QkFKWCxFQUlnQyxjQUpoQyxFQUtFLDBCQUxGLEVBS3FCLG1DQUxyQixFQUtnRCx5QkFMaEQsRUFLaUUsd0JBTGpFLEVBTUUsMkJBTkYsRUFPRTs7RUFHRixZQUFBLEdBQWUsU0FBQyxDQUFELEVBQUcsQ0FBSDtBQUNiLFFBQUE7SUFBQSxJQUFvQixXQUFKLElBQWMsV0FBOUI7QUFBQSxhQUFPLE1BQVA7O0lBQ0EsSUFBb0IsQ0FBQyxDQUFDLE1BQUYsS0FBWSxDQUFDLENBQUMsTUFBbEM7QUFBQSxhQUFPLE1BQVA7O0FBQ0EsU0FBQSwyQ0FBQTs7VUFBK0IsQ0FBQSxLQUFPLENBQUUsQ0FBQSxDQUFBO0FBQXhDLGVBQU87O0FBQVA7QUFDQSxXQUFPO0VBSk07O0VBTWYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNKLFlBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxLQUFEO0FBQ1osVUFBQTtNQUFBLElBQU8seUJBQVA7UUFDRSxPQUFpRCxPQUFBLENBQVEsWUFBUixDQUFqRCxFQUFDLDBDQUFELEVBQW9CLDJEQUR0Qjs7TUFHQSxjQUFBLEdBQWlCO01BQ2pCLElBQTRCLElBQUksQ0FBQyxTQUFMLENBQUEsQ0FBQSxJQUFxQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF1QixDQUFDLElBQXhCLENBQTZCLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxLQUFGLENBQVEsYUFBUjtNQUFQLENBQTdCLENBQWpEO1FBQUEsY0FB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QUg7UUFDRSxJQUFJLENBQUMsYUFBTCxHQUFxQixJQUFDLENBQUEsY0FEeEI7O01BRUEsSUFBRywwQkFBSDtRQUNFLElBQUksQ0FBQyxhQUFMLEdBQXFCLElBQUMsQ0FBQSxjQUR4Qjs7TUFFQSxJQUFHLHlCQUFIO1FBQ0UsSUFBSSxDQUFDLFlBQUwsR0FBb0IsSUFBQyxDQUFBLGFBRHZCOztNQUVBLElBQUcsd0JBQUg7UUFDRSxJQUFJLENBQUMsV0FBTCxHQUFtQixJQUFDLENBQUEsWUFEdEI7O01BRUEsSUFBRyx3QkFBSDtRQUNFLElBQUksQ0FBQyxXQUFMLEdBQW1CLElBQUMsQ0FBQSxZQUR0Qjs7TUFHQSxJQUFJLENBQUMsT0FBTCxHQUFlLElBQUMsQ0FBQSxnQkFBRCxDQUFBO01BRWYsSUFBRyxJQUFDLENBQUEsYUFBRCxDQUFBLENBQUg7UUFDRSxJQUFJLENBQUMsS0FBTCxHQUFhLElBQUMsQ0FBQTtRQUNkLElBQUksQ0FBQyxTQUFMLEdBQWlCLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFBLEVBRm5COzthQUlBO0lBckNTOzsyQkF1Q1gsZ0JBQUEsR0FBa0IsU0FBQTtBQUNoQixVQUFBO01BQUEsR0FBQSxHQUFNO0FBQ047QUFBQSxXQUFBLFVBQUE7O1FBQ0UsR0FBSSxDQUFBLEVBQUEsQ0FBSixHQUFVLFdBQVcsQ0FBQyxTQUFaLENBQUE7QUFEWjthQUVBO0lBSmdCOzs7OztBQTlyQnBCIiwic291cmNlc0NvbnRlbnQiOlsiW1xuICBDb2xvckJ1ZmZlciwgQ29sb3JTZWFyY2gsXG4gIFBhbGV0dGUsIFZhcmlhYmxlc0NvbGxlY3Rpb24sXG4gIFBhdGhzTG9hZGVyLCBQYXRoc1NjYW5uZXIsXG4gIEVtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUsIFJhbmdlLFxuICBTRVJJQUxJWkVfVkVSU0lPTiwgU0VSSUFMSVpFX01BUktFUlNfVkVSU0lPTiwgVEhFTUVfVkFSSUFCTEVTLCBBVE9NX1ZBUklBQkxFUyxcbiAgc2NvcGVGcm9tRmlsZU5hbWUsXG4gIG1pbmltYXRjaFxuXSA9IFtdXG5cbmNvbXBhcmVBcnJheSA9IChhLGIpIC0+XG4gIHJldHVybiBmYWxzZSBpZiBub3QgYT8gb3Igbm90IGI/XG4gIHJldHVybiBmYWxzZSB1bmxlc3MgYS5sZW5ndGggaXMgYi5sZW5ndGhcbiAgcmV0dXJuIGZhbHNlIGZvciB2LGkgaW4gYSB3aGVuIHYgaXNudCBiW2ldXG4gIHJldHVybiB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENvbG9yUHJvamVjdFxuICBAZGVzZXJpYWxpemU6IChzdGF0ZSkgLT5cbiAgICB1bmxlc3MgU0VSSUFMSVpFX1ZFUlNJT04/XG4gICAgICB7U0VSSUFMSVpFX1ZFUlNJT04sIFNFUklBTElaRV9NQVJLRVJTX1ZFUlNJT059ID0gcmVxdWlyZSAnLi92ZXJzaW9ucydcblxuICAgIG1hcmtlcnNWZXJzaW9uID0gU0VSSUFMSVpFX01BUktFUlNfVkVSU0lPTlxuICAgIG1hcmtlcnNWZXJzaW9uICs9ICctZGV2JyBpZiBhdG9tLmluRGV2TW9kZSgpIGFuZCBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5zb21lIChwKSAtPiBwLm1hdGNoKC9cXC9waWdtZW50cyQvKVxuXG4gICAgaWYgc3RhdGU/LnZlcnNpb24gaXNudCBTRVJJQUxJWkVfVkVSU0lPTlxuICAgICAgc3RhdGUgPSB7fVxuXG4gICAgaWYgc3RhdGU/Lm1hcmtlcnNWZXJzaW9uIGlzbnQgbWFya2Vyc1ZlcnNpb25cbiAgICAgIGRlbGV0ZSBzdGF0ZS52YXJpYWJsZXNcbiAgICAgIGRlbGV0ZSBzdGF0ZS5idWZmZXJzXG5cbiAgICBpZiBub3QgY29tcGFyZUFycmF5KHN0YXRlLmdsb2JhbFNvdXJjZU5hbWVzLCBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLnNvdXJjZU5hbWVzJykpIG9yIG5vdCBjb21wYXJlQXJyYXkoc3RhdGUuZ2xvYmFsSWdub3JlZE5hbWVzLCBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycpKVxuICAgICAgZGVsZXRlIHN0YXRlLnZhcmlhYmxlc1xuICAgICAgZGVsZXRlIHN0YXRlLmJ1ZmZlcnNcbiAgICAgIGRlbGV0ZSBzdGF0ZS5wYXRoc1xuXG4gICAgbmV3IENvbG9yUHJvamVjdChzdGF0ZSlcblxuICBjb25zdHJ1Y3RvcjogKHN0YXRlPXt9KSAtPlxuICAgIHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBSYW5nZX0gPSByZXF1aXJlICdhdG9tJyB1bmxlc3MgRW1pdHRlcj9cbiAgICBWYXJpYWJsZXNDb2xsZWN0aW9uID89IHJlcXVpcmUgJy4vdmFyaWFibGVzLWNvbGxlY3Rpb24nXG5cbiAgICB7XG4gICAgICBAaW5jbHVkZVRoZW1lcywgQGlnbm9yZWROYW1lcywgQHNvdXJjZU5hbWVzLCBAaWdub3JlZFNjb3BlcywgQHBhdGhzLCBAc2VhcmNoTmFtZXMsIEBpZ25vcmVHbG9iYWxTb3VyY2VOYW1lcywgQGlnbm9yZUdsb2JhbElnbm9yZWROYW1lcywgQGlnbm9yZUdsb2JhbElnbm9yZWRTY29wZXMsIEBpZ25vcmVHbG9iYWxTZWFyY2hOYW1lcywgQGlnbm9yZUdsb2JhbFN1cHBvcnRlZEZpbGV0eXBlcywgQHN1cHBvcnRlZEZpbGV0eXBlcywgdmFyaWFibGVzLCB0aW1lc3RhbXAsIGJ1ZmZlcnNcbiAgICB9ID0gc3RhdGVcblxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWQgPSB7fVxuICAgIEBidWZmZXJTdGF0ZXMgPSBidWZmZXJzID8ge31cblxuICAgIEB2YXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnkgPSByZXF1aXJlICcuL3ZhcmlhYmxlLWV4cHJlc3Npb25zJ1xuICAgIEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnkgPSByZXF1aXJlICcuL2NvbG9yLWV4cHJlc3Npb25zJ1xuXG4gICAgaWYgdmFyaWFibGVzP1xuICAgICAgQHZhcmlhYmxlcyA9IGF0b20uZGVzZXJpYWxpemVycy5kZXNlcmlhbGl6ZSh2YXJpYWJsZXMpXG4gICAgZWxzZVxuICAgICAgQHZhcmlhYmxlcyA9IG5ldyBWYXJpYWJsZXNDb2xsZWN0aW9uXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHZhcmlhYmxlcy5vbkRpZENoYW5nZSAocmVzdWx0cykgPT5cbiAgICAgIEBlbWl0VmFyaWFibGVzQ2hhbmdlRXZlbnQocmVzdWx0cylcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5zb3VyY2VOYW1lcycsID0+XG4gICAgICBAdXBkYXRlUGF0aHMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycsID0+XG4gICAgICBAdXBkYXRlUGF0aHMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmlnbm9yZWRCdWZmZXJOYW1lcycsIChAaWdub3JlZEJ1ZmZlck5hbWVzKSA9PlxuICAgICAgQHVwZGF0ZUNvbG9yQnVmZmVycygpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuaWdub3JlZFNjb3BlcycsID0+XG4gICAgICBAZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWlnbm9yZWQtc2NvcGVzJywgQGdldElnbm9yZWRTY29wZXMoKSlcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdwaWdtZW50cy5zdXBwb3J0ZWRGaWxldHlwZXMnLCA9PlxuICAgICAgQHVwZGF0ZUlnbm9yZWRGaWxldHlwZXMoKVxuICAgICAgQGVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1pZ25vcmVkLXNjb3BlcycsIEBnZXRJZ25vcmVkU2NvcGVzKCkpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuaWdub3JlVmNzSWdub3JlZFBhdGhzJywgPT5cbiAgICAgIEBsb2FkUGF0aHNBbmRWYXJpYWJsZXMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLnNhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbicsID0+XG4gICAgICBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5LmVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIHtcbiAgICAgICAgcmVnaXN0cnk6IEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnlcbiAgICAgIH1cblxuICAgIHN2Z0NvbG9yRXhwcmVzc2lvbiA9IEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnkuZ2V0RXhwcmVzc2lvbigncGlnbWVudHM6bmFtZWRfY29sb3JzJylcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAncGlnbWVudHMuZmlsZXR5cGVzRm9yQ29sb3JXb3JkcycsIChzY29wZXMpID0+XG4gICAgICBzdmdDb2xvckV4cHJlc3Npb24uc2NvcGVzID0gc2NvcGVzID8gW11cbiAgICAgIEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnkuZW1pdHRlci5lbWl0ICdkaWQtdXBkYXRlLWV4cHJlc3Npb25zJywge1xuICAgICAgICBuYW1lOiBzdmdDb2xvckV4cHJlc3Npb24ubmFtZVxuICAgICAgICByZWdpc3RyeTogQGNvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeVxuICAgICAgfVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBjb2xvckV4cHJlc3Npb25zUmVnaXN0cnkub25EaWRVcGRhdGVFeHByZXNzaW9ucyAoe25hbWV9KSA9PlxuICAgICAgcmV0dXJuIGlmIG5vdCBAcGF0aHM/IG9yIG5hbWUgaXMgJ3BpZ21lbnRzOnZhcmlhYmxlcydcbiAgICAgIEB2YXJpYWJsZXMuZXZhbHVhdGVWYXJpYWJsZXMgQHZhcmlhYmxlcy5nZXRWYXJpYWJsZXMoKSwgPT5cbiAgICAgICAgY29sb3JCdWZmZXIudXBkYXRlKCkgZm9yIGlkLCBjb2xvckJ1ZmZlciBvZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEB2YXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnkub25EaWRVcGRhdGVFeHByZXNzaW9ucyA9PlxuICAgICAgcmV0dXJuIHVubGVzcyBAcGF0aHM/XG4gICAgICBAcmVsb2FkVmFyaWFibGVzRm9yUGF0aHMoQGdldFBhdGhzKCkpXG5cbiAgICBAdGltZXN0YW1wID0gbmV3IERhdGUoRGF0ZS5wYXJzZSh0aW1lc3RhbXApKSBpZiB0aW1lc3RhbXA/XG5cbiAgICBAdXBkYXRlSWdub3JlZEZpbGV0eXBlcygpXG5cbiAgICBAaW5pdGlhbGl6ZSgpIGlmIEBwYXRocz9cbiAgICBAaW5pdGlhbGl6ZUJ1ZmZlcnMoKVxuXG4gIG9uRGlkSW5pdGlhbGl6ZTogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtaW5pdGlhbGl6ZScsIGNhbGxiYWNrXG5cbiAgb25EaWREZXN0cm95OiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1kZXN0cm95JywgY2FsbGJhY2tcblxuICBvbkRpZFVwZGF0ZVZhcmlhYmxlczogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtdXBkYXRlLXZhcmlhYmxlcycsIGNhbGxiYWNrXG5cbiAgb25EaWRDcmVhdGVDb2xvckJ1ZmZlcjogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtY3JlYXRlLWNvbG9yLWJ1ZmZlcicsIGNhbGxiYWNrXG5cbiAgb25EaWRDaGFuZ2VJZ25vcmVkU2NvcGVzOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBjYWxsYmFja1xuXG4gIG9uRGlkQ2hhbmdlUGF0aHM6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWNoYW5nZS1wYXRocycsIGNhbGxiYWNrXG5cbiAgb2JzZXJ2ZUNvbG9yQnVmZmVyczogKGNhbGxiYWNrKSAtPlxuICAgIGNhbGxiYWNrKGNvbG9yQnVmZmVyKSBmb3IgaWQsY29sb3JCdWZmZXIgb2YgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRcbiAgICBAb25EaWRDcmVhdGVDb2xvckJ1ZmZlcihjYWxsYmFjaylcblxuICBpc0luaXRpYWxpemVkOiAtPiBAaW5pdGlhbGl6ZWRcblxuICBpc0Rlc3Ryb3llZDogLT4gQGRlc3Ryb3llZFxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShAdmFyaWFibGVzLmdldFZhcmlhYmxlcygpKSBpZiBAaXNJbml0aWFsaXplZCgpXG4gICAgcmV0dXJuIEBpbml0aWFsaXplUHJvbWlzZSBpZiBAaW5pdGlhbGl6ZVByb21pc2U/XG4gICAgQGluaXRpYWxpemVQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+XG4gICAgICBAdmFyaWFibGVzLm9uY2VJbml0aWFsaXplZChyZXNvbHZlKVxuICAgIClcbiAgICAudGhlbiA9PlxuICAgICAgQGxvYWRQYXRoc0FuZFZhcmlhYmxlcygpXG4gICAgLnRoZW4gPT5cbiAgICAgIEBpbmNsdWRlVGhlbWVzVmFyaWFibGVzKCkgaWYgQGluY2x1ZGVUaGVtZXNcbiAgICAudGhlbiA9PlxuICAgICAgQGluaXRpYWxpemVkID0gdHJ1ZVxuXG4gICAgICB2YXJpYWJsZXMgPSBAdmFyaWFibGVzLmdldFZhcmlhYmxlcygpXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtaW5pdGlhbGl6ZScsIHZhcmlhYmxlc1xuICAgICAgdmFyaWFibGVzXG5cbiAgZGVzdHJveTogLT5cbiAgICByZXR1cm4gaWYgQGRlc3Ryb3llZFxuXG4gICAgUGF0aHNTY2FubmVyID89IHJlcXVpcmUgJy4vcGF0aHMtc2Nhbm5lcidcblxuICAgIEBkZXN0cm95ZWQgPSB0cnVlXG5cbiAgICBQYXRoc1NjYW5uZXIudGVybWluYXRlUnVubmluZ1Rhc2soKVxuXG4gICAgYnVmZmVyLmRlc3Ryb3koKSBmb3IgaWQsYnVmZmVyIG9mIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkXG4gICAgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWQgPSBudWxsXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG51bGxcblxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1kZXN0cm95JywgdGhpc1xuICAgIEBlbWl0dGVyLmRpc3Bvc2UoKVxuXG4gIHJlbG9hZDogLT5cbiAgICBAaW5pdGlhbGl6ZSgpLnRoZW4gPT5cbiAgICAgIEB2YXJpYWJsZXMucmVzZXQoKVxuICAgICAgQHBhdGhzID0gW11cbiAgICAgIEBsb2FkUGF0aHNBbmRWYXJpYWJsZXMoKVxuICAgIC50aGVuID0+XG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLm5vdGlmeVJlbG9hZHMnKVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcIlBpZ21lbnRzIHN1Y2Nlc3NmdWxseSByZWxvYWRlZFwiLCBkaXNtaXNzYWJsZTogYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5kaXNtaXNzYWJsZVJlbG9hZE5vdGlmaWNhdGlvbnMnKSwgZGVzY3JpcHRpb246IFwiXCJcIkZvdW5kOlxuICAgICAgICAtICoqI3tAcGF0aHMubGVuZ3RofSoqIHBhdGgocylcbiAgICAgICAgLSAqKiN7QGdldFZhcmlhYmxlcygpLmxlbmd0aH0qKiB2YXJpYWJsZXMocykgaW5jbHVkaW5nICoqI3tAZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGh9KiogY29sb3IocylcbiAgICAgICAgXCJcIlwiKVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLmxvZyhcIlwiXCJGb3VuZDpcbiAgICAgICAgLSAje0BwYXRocy5sZW5ndGh9IHBhdGgocylcbiAgICAgICAgLSAje0BnZXRWYXJpYWJsZXMoKS5sZW5ndGh9IHZhcmlhYmxlcyhzKSBpbmNsdWRpbmcgI3tAZ2V0Q29sb3JWYXJpYWJsZXMoKS5sZW5ndGh9IGNvbG9yKHMpXG4gICAgICAgIFwiXCJcIilcbiAgICAuY2F0Y2ggKHJlYXNvbikgLT5cbiAgICAgIGRldGFpbCA9IHJlYXNvbi5tZXNzYWdlXG4gICAgICBzdGFjayA9IHJlYXNvbi5zdGFja1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiUGlnbWVudHMgY291bGRuJ3QgYmUgcmVsb2FkZWRcIiwge2RldGFpbCwgc3RhY2ssIGRpc21pc3NhYmxlOiB0cnVlfSlcbiAgICAgIGNvbnNvbGUuZXJyb3IgcmVhc29uXG5cbiAgbG9hZFBhdGhzQW5kVmFyaWFibGVzOiAtPlxuICAgIGRlc3Ryb3llZCA9IG51bGxcblxuICAgIEBsb2FkUGF0aHMoKS50aGVuICh7ZGlydGllZCwgcmVtb3ZlZH0pID0+XG4gICAgICAjIFdlIGNhbiBmaW5kIHJlbW92ZWQgZmlsZXMgb25seSB3aGVuIHRoZXJlJ3MgYWxyZWFkeSBwYXRocyBmcm9tXG4gICAgICAjIGEgc2VyaWFsaXplZCBzdGF0ZVxuICAgICAgaWYgcmVtb3ZlZC5sZW5ndGggPiAwXG4gICAgICAgIEBwYXRocyA9IEBwYXRocy5maWx0ZXIgKHApIC0+IHAgbm90IGluIHJlbW92ZWRcbiAgICAgICAgQGRlbGV0ZVZhcmlhYmxlc0ZvclBhdGhzKHJlbW92ZWQpXG5cbiAgICAgICMgVGhlcmUgd2FzIHNlcmlhbGl6ZWQgcGF0aHMsIGFuZCB0aGUgaW5pdGlhbGl6YXRpb24gZGlzY292ZXJlZFxuICAgICAgIyBzb21lIG5ldyBvciBkaXJ0eSBvbmVzLlxuICAgICAgaWYgQHBhdGhzPyBhbmQgZGlydGllZC5sZW5ndGggPiAwXG4gICAgICAgIEBwYXRocy5wdXNoIHBhdGggZm9yIHBhdGggaW4gZGlydGllZCB3aGVuIHBhdGggbm90IGluIEBwYXRoc1xuXG4gICAgICAgICMgVGhlcmUgd2FzIGFsc28gc2VyaWFsaXplZCB2YXJpYWJsZXMsIHNvIHdlJ2xsIHJlc2NhbiBvbmx5IHRoZVxuICAgICAgICAjIGRpcnR5IHBhdGhzXG4gICAgICAgIGlmIEB2YXJpYWJsZXMubGVuZ3RoXG4gICAgICAgICAgZGlydGllZFxuICAgICAgICAjIFRoZXJlIHdhcyBubyB2YXJpYWJsZXMsIHNvIGl0J3MgcHJvYmFibHkgYmVjYXVzZSB0aGUgbWFya2Vyc1xuICAgICAgICAjIHZlcnNpb24gY2hhbmdlZCwgd2UnbGwgcmVzY2FuIGFsbCB0aGUgZmlsZXNcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBwYXRoc1xuICAgICAgIyBUaGVyZSB3YXMgbm8gc2VyaWFsaXplZCBwYXRocywgc28gdGhlcmUncyBubyB2YXJpYWJsZXMgbmVpdGhlclxuICAgICAgZWxzZSB1bmxlc3MgQHBhdGhzP1xuICAgICAgICBAcGF0aHMgPSBkaXJ0aWVkXG4gICAgICAjIE9ubHkgdGhlIG1hcmtlcnMgdmVyc2lvbiBjaGFuZ2VkLCBhbGwgdGhlIHBhdGhzIGZyb20gdGhlIHNlcmlhbGl6ZWRcbiAgICAgICMgc3RhdGUgd2lsbCBiZSByZXNjYW5uZWRcbiAgICAgIGVsc2UgdW5sZXNzIEB2YXJpYWJsZXMubGVuZ3RoXG4gICAgICAgIEBwYXRoc1xuICAgICAgIyBOb3RoaW5nIGNoYW5nZWQsIHRoZXJlJ3Mgbm8gZGlydHkgcGF0aHMgdG8gcmVzY2FuXG4gICAgICBlbHNlXG4gICAgICAgIFtdXG4gICAgLnRoZW4gKHBhdGhzKSA9PlxuICAgICAgQGxvYWRWYXJpYWJsZXNGb3JQYXRocyhwYXRocylcbiAgICAudGhlbiAocmVzdWx0cykgPT5cbiAgICAgIEB2YXJpYWJsZXMudXBkYXRlQ29sbGVjdGlvbihyZXN1bHRzKSBpZiByZXN1bHRzP1xuXG4gIGZpbmRBbGxDb2xvcnM6IC0+XG4gICAgQ29sb3JTZWFyY2ggPz0gcmVxdWlyZSAnLi9jb2xvci1zZWFyY2gnXG5cbiAgICBwYXR0ZXJucyA9IEBnZXRTZWFyY2hOYW1lcygpXG4gICAgbmV3IENvbG9yU2VhcmNoXG4gICAgICBzb3VyY2VOYW1lczogcGF0dGVybnNcbiAgICAgIHByb2plY3Q6IHRoaXNcbiAgICAgIGlnbm9yZWROYW1lczogQGdldElnbm9yZWROYW1lcygpXG4gICAgICBjb250ZXh0OiBAZ2V0Q29udGV4dCgpXG5cbiAgc2V0Q29sb3JQaWNrZXJBUEk6IChAY29sb3JQaWNrZXJBUEkpIC0+XG5cbiAgIyMgICAgIyMjIyMjIyMgICMjICAgICAjIyAjIyMjIyMjIyAjIyMjIyMjIyAjIyMjIyMjIyAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAgICMjICAgICAgICMjICAgICAgICMjICAgICAjIyAjI1xuICAjIyAgICAjIyMjIyMjIyAgIyMgICAgICMjICMjIyMjIyAgICMjIyMjIyAgICMjIyMjIyAgICMjIyMjIyMjICAgIyMjIyMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMgICAgICAgIyMgICAjIyAgICAgICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMgICAgICAgIyMgICAgIyMgICMjICAgICMjXG4gICMjICAgICMjIyMjIyMjICAgIyMjIyMjIyAgIyMgICAgICAgIyMgICAgICAgIyMjIyMjIyMgIyMgICAgICMjICAjIyMjIyNcblxuICBpbml0aWFsaXplQnVmZmVyczogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBlZGl0b3JQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgcmV0dXJuIGlmIG5vdCBlZGl0b3JQYXRoPyBvciBAaXNCdWZmZXJJZ25vcmVkKGVkaXRvclBhdGgpXG5cbiAgICAgIGJ1ZmZlciA9IEBjb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG4gICAgICBpZiBidWZmZXI/XG4gICAgICAgIGJ1ZmZlckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYnVmZmVyKVxuICAgICAgICBidWZmZXJFbGVtZW50LmF0dGFjaCgpXG5cbiAgaGFzQ29sb3JCdWZmZXJGb3JFZGl0b3I6IChlZGl0b3IpIC0+XG4gICAgcmV0dXJuIGZhbHNlIGlmIEBkZXN0cm95ZWQgb3Igbm90IGVkaXRvcj9cbiAgICBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdP1xuXG4gIGNvbG9yQnVmZmVyRm9yRWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgIHJldHVybiBpZiBAZGVzdHJveWVkXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG5cbiAgICBDb2xvckJ1ZmZlciA/PSByZXF1aXJlICcuL2NvbG9yLWJ1ZmZlcidcblxuICAgIGlmIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkW2VkaXRvci5pZF0/XG4gICAgICByZXR1cm4gQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVxuXG4gICAgaWYgQGJ1ZmZlclN0YXRlc1tlZGl0b3IuaWRdP1xuICAgICAgc3RhdGUgPSBAYnVmZmVyU3RhdGVzW2VkaXRvci5pZF1cbiAgICAgIHN0YXRlLmVkaXRvciA9IGVkaXRvclxuICAgICAgc3RhdGUucHJvamVjdCA9IHRoaXNcbiAgICAgIGRlbGV0ZSBAYnVmZmVyU3RhdGVzW2VkaXRvci5pZF1cbiAgICBlbHNlXG4gICAgICBzdGF0ZSA9IHtlZGl0b3IsIHByb2plY3Q6IHRoaXN9XG5cbiAgICBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFtlZGl0b3IuaWRdID0gYnVmZmVyID0gbmV3IENvbG9yQnVmZmVyKHN0YXRlKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIHN1YnNjcmlwdGlvbiA9IGJ1ZmZlci5vbkRpZERlc3Ryb3kgPT5cbiAgICAgIEBzdWJzY3JpcHRpb25zLnJlbW92ZShzdWJzY3JpcHRpb24pXG4gICAgICBzdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICBkZWxldGUgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWRbZWRpdG9yLmlkXVxuXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNyZWF0ZS1jb2xvci1idWZmZXInLCBidWZmZXJcblxuICAgIGJ1ZmZlclxuXG4gIGNvbG9yQnVmZmVyRm9yUGF0aDogKHBhdGgpIC0+XG4gICAgZm9yIGlkLGNvbG9yQnVmZmVyIG9mIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkXG4gICAgICByZXR1cm4gY29sb3JCdWZmZXIgaWYgY29sb3JCdWZmZXIuZWRpdG9yLmdldFBhdGgoKSBpcyBwYXRoXG5cbiAgdXBkYXRlQ29sb3JCdWZmZXJzOiAtPlxuICAgIGZvciBpZCwgYnVmZmVyIG9mIEBjb2xvckJ1ZmZlcnNCeUVkaXRvcklkXG4gICAgICBpZiBAaXNCdWZmZXJJZ25vcmVkKGJ1ZmZlci5lZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgICBidWZmZXIuZGVzdHJveSgpXG4gICAgICAgIGRlbGV0ZSBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFtpZF1cblxuICAgIHRyeVxuICAgICAgaWYgQGNvbG9yQnVmZmVyc0J5RWRpdG9ySWQ/XG4gICAgICAgIGZvciBlZGl0b3IgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuICAgICAgICAgIGNvbnRpbnVlIGlmIEBoYXNDb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpIG9yIEBpc0J1ZmZlcklnbm9yZWQoZWRpdG9yLmdldFBhdGgoKSlcblxuICAgICAgICAgIGJ1ZmZlciA9IEBjb2xvckJ1ZmZlckZvckVkaXRvcihlZGl0b3IpXG4gICAgICAgICAgaWYgYnVmZmVyP1xuICAgICAgICAgICAgYnVmZmVyRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhidWZmZXIpXG4gICAgICAgICAgICBidWZmZXJFbGVtZW50LmF0dGFjaCgpXG5cbiAgICBjYXRjaCBlXG4gICAgICBjb25zb2xlLmxvZyBlXG5cbiAgaXNCdWZmZXJJZ25vcmVkOiAocGF0aCkgLT5cbiAgICBtaW5pbWF0Y2ggPz0gcmVxdWlyZSAnbWluaW1hdGNoJ1xuXG4gICAgcGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplKHBhdGgpXG4gICAgc291cmNlcyA9IEBpZ25vcmVkQnVmZmVyTmFtZXMgPyBbXVxuICAgIHJldHVybiB0cnVlIGZvciBzb3VyY2UgaW4gc291cmNlcyB3aGVuIG1pbmltYXRjaChwYXRoLCBzb3VyY2UsIG1hdGNoQmFzZTogdHJ1ZSwgZG90OiB0cnVlKVxuICAgIGZhbHNlXG5cbiAgIyMgICAgIyMjIyMjIyMgICAgICMjIyAgICAjIyMjIyMjIyAjIyAgICAgIyMgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgICAjIyAjIyAgICAgICMjICAgICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgICMjICAgIyMgICAgICMjICAgICMjICAgICAjIyAjI1xuICAjIyAgICAjIyMjIyMjIyAgIyMgICAgICMjICAgICMjICAgICMjIyMjIyMjIyAgIyMjIyMjXG4gICMjICAgICMjICAgICAgICAjIyMjIyMjIyMgICAgIyMgICAgIyMgICAgICMjICAgICAgICMjXG4gICMjICAgICMjICAgICAgICAjIyAgICAgIyMgICAgIyMgICAgIyMgICAgICMjICMjICAgICMjXG4gICMjICAgICMjICAgICAgICAjIyAgICAgIyMgICAgIyMgICAgIyMgICAgICMjICAjIyMjIyNcblxuICBnZXRQYXRoczogLT4gQHBhdGhzPy5zbGljZSgpXG5cbiAgYXBwZW5kUGF0aDogKHBhdGgpIC0+IEBwYXRocy5wdXNoKHBhdGgpIGlmIHBhdGg/XG5cbiAgaGFzUGF0aDogKHBhdGgpIC0+IHBhdGggaW4gKEBwYXRocyA/IFtdKVxuXG4gIGxvYWRQYXRoczogKG5vS25vd25QYXRocz1mYWxzZSkgLT5cbiAgICBQYXRoc0xvYWRlciA/PSByZXF1aXJlICcuL3BhdGhzLWxvYWRlcidcblxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICByb290UGF0aHMgPSBAZ2V0Um9vdFBhdGhzKClcbiAgICAgIGtub3duUGF0aHMgPSBpZiBub0tub3duUGF0aHMgdGhlbiBbXSBlbHNlIEBwYXRocyA/IFtdXG4gICAgICBjb25maWcgPSB7XG4gICAgICAgIGtub3duUGF0aHNcbiAgICAgICAgQHRpbWVzdGFtcFxuICAgICAgICBpZ25vcmVkTmFtZXM6IEBnZXRJZ25vcmVkTmFtZXMoKVxuICAgICAgICBwYXRoczogcm9vdFBhdGhzXG4gICAgICAgIHRyYXZlcnNlSW50b1N5bWxpbmtEaXJlY3RvcmllczogYXRvbS5jb25maWcuZ2V0ICdwaWdtZW50cy50cmF2ZXJzZUludG9TeW1saW5rRGlyZWN0b3JpZXMnXG4gICAgICAgIHNvdXJjZU5hbWVzOiBAZ2V0U291cmNlTmFtZXMoKVxuICAgICAgICBpZ25vcmVWY3NJZ25vcmVzOiBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmlnbm9yZVZjc0lnbm9yZWRQYXRocycpXG4gICAgICB9XG4gICAgICBQYXRoc0xvYWRlci5zdGFydFRhc2sgY29uZmlnLCAocmVzdWx0cykgPT5cbiAgICAgICAgZm9yIHAgaW4ga25vd25QYXRoc1xuICAgICAgICAgIGlzRGVzY2VuZGVudE9mUm9vdFBhdGhzID0gcm9vdFBhdGhzLnNvbWUgKHJvb3QpIC0+XG4gICAgICAgICAgICBwLmluZGV4T2Yocm9vdCkgaXMgMFxuXG4gICAgICAgICAgdW5sZXNzIGlzRGVzY2VuZGVudE9mUm9vdFBhdGhzXG4gICAgICAgICAgICByZXN1bHRzLnJlbW92ZWQgPz0gW11cbiAgICAgICAgICAgIHJlc3VsdHMucmVtb3ZlZC5wdXNoKHApXG5cbiAgICAgICAgcmVzb2x2ZShyZXN1bHRzKVxuXG4gIHVwZGF0ZVBhdGhzOiAtPlxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKSB1bmxlc3MgQGluaXRpYWxpemVkXG5cbiAgICBAbG9hZFBhdGhzKCkudGhlbiAoe2RpcnRpZWQsIHJlbW92ZWR9KSA9PlxuICAgICAgQGRlbGV0ZVZhcmlhYmxlc0ZvclBhdGhzKHJlbW92ZWQpXG5cbiAgICAgIEBwYXRocyA9IEBwYXRocy5maWx0ZXIgKHApIC0+IHAgbm90IGluIHJlbW92ZWRcbiAgICAgIEBwYXRocy5wdXNoKHApIGZvciBwIGluIGRpcnRpZWQgd2hlbiBwIG5vdCBpbiBAcGF0aHNcblxuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNoYW5nZS1wYXRocycsIEBnZXRQYXRocygpXG4gICAgICBAcmVsb2FkVmFyaWFibGVzRm9yUGF0aHMoZGlydGllZClcblxuICBpc1ZhcmlhYmxlc1NvdXJjZVBhdGg6IChwYXRoKSAtPlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgcGF0aFxuXG4gICAgbWluaW1hdGNoID89IHJlcXVpcmUgJ21pbmltYXRjaCdcbiAgICBwYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemUocGF0aClcbiAgICBzb3VyY2VzID0gQGdldFNvdXJjZU5hbWVzKClcblxuICAgIHJldHVybiB0cnVlIGZvciBzb3VyY2UgaW4gc291cmNlcyB3aGVuIG1pbmltYXRjaChwYXRoLCBzb3VyY2UsIG1hdGNoQmFzZTogdHJ1ZSwgZG90OiB0cnVlKVxuXG4gIGlzSWdub3JlZFBhdGg6IChwYXRoKSAtPlxuICAgIHJldHVybiBmYWxzZSB1bmxlc3MgcGF0aFxuXG4gICAgbWluaW1hdGNoID89IHJlcXVpcmUgJ21pbmltYXRjaCdcbiAgICBwYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemUocGF0aClcbiAgICBpZ25vcmVkTmFtZXMgPSBAZ2V0SWdub3JlZE5hbWVzKClcblxuICAgIHJldHVybiB0cnVlIGZvciBpZ25vcmUgaW4gaWdub3JlZE5hbWVzIHdoZW4gbWluaW1hdGNoKHBhdGgsIGlnbm9yZSwgbWF0Y2hCYXNlOiB0cnVlLCBkb3Q6IHRydWUpXG5cbiAgc2NvcGVGcm9tRmlsZU5hbWU6IChwYXRoKSAtPlxuICAgIHNjb3BlRnJvbUZpbGVOYW1lID89IHJlcXVpcmUgJy4vc2NvcGUtZnJvbS1maWxlLW5hbWUnXG5cbiAgICBzY29wZSA9IHNjb3BlRnJvbUZpbGVOYW1lKHBhdGgpXG5cbiAgICBpZiBzY29wZSBpcyAnc2Fzcycgb3Igc2NvcGUgaXMgJ3Njc3MnXG4gICAgICBzY29wZSA9IFtzY29wZSwgQGdldFNhc3NTY29wZVN1ZmZpeCgpXS5qb2luKCc6JylcblxuICAgIHNjb3BlXG5cbiAgIyMgICAgIyMgICAgICMjICAgICMjIyAgICAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgICAjIyAjIyAgICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgICMjICAgIyMgICMjICAgICAjIyAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjIyMjIyMjICAgIyMjIyMjXG4gICMjICAgICAjIyAgICMjICAjIyMjIyMjIyMgIyMgICAjIyAgICAgICAgICMjXG4gICMjICAgICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgIyMgICMjICAgICMjXG4gICMjICAgICAgICMjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICAjIyMjIyNcblxuICBnZXRQYWxldHRlOiAtPlxuICAgIFBhbGV0dGUgPz0gcmVxdWlyZSAnLi9wYWxldHRlJ1xuXG4gICAgcmV0dXJuIG5ldyBQYWxldHRlIHVubGVzcyBAaXNJbml0aWFsaXplZCgpXG4gICAgbmV3IFBhbGV0dGUoQGdldENvbG9yVmFyaWFibGVzKCkpXG5cbiAgZ2V0Q29udGV4dDogLT4gQHZhcmlhYmxlcy5nZXRDb250ZXh0KClcblxuICBnZXRWYXJpYWJsZXM6IC0+IEB2YXJpYWJsZXMuZ2V0VmFyaWFibGVzKClcblxuICBnZXRWYXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnk6IC0+IEB2YXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnlcblxuICBnZXRWYXJpYWJsZUJ5SWQ6IChpZCkgLT4gQHZhcmlhYmxlcy5nZXRWYXJpYWJsZUJ5SWQoaWQpXG5cbiAgZ2V0VmFyaWFibGVCeU5hbWU6IChuYW1lKSAtPiBAdmFyaWFibGVzLmdldFZhcmlhYmxlQnlOYW1lKG5hbWUpXG5cbiAgZ2V0Q29sb3JWYXJpYWJsZXM6IC0+IEB2YXJpYWJsZXMuZ2V0Q29sb3JWYXJpYWJsZXMoKVxuXG4gIGdldENvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeTogLT4gQGNvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeVxuXG4gIHNob3dWYXJpYWJsZUluRmlsZTogKHZhcmlhYmxlKSAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4odmFyaWFibGUucGF0aCkudGhlbiAoZWRpdG9yKSAtPlxuICAgICAge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUsIFJhbmdlfSA9IHJlcXVpcmUgJ2F0b20nIHVubGVzcyBSYW5nZT9cblxuICAgICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICAgIGJ1ZmZlclJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdCBbXG4gICAgICAgIGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHZhcmlhYmxlLnJhbmdlWzBdKVxuICAgICAgICBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleCh2YXJpYWJsZS5yYW5nZVsxXSlcbiAgICAgIF1cblxuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoYnVmZmVyUmFuZ2UsIGF1dG9zY3JvbGw6IHRydWUpXG5cbiAgZW1pdFZhcmlhYmxlc0NoYW5nZUV2ZW50OiAocmVzdWx0cykgLT5cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtdXBkYXRlLXZhcmlhYmxlcycsIHJlc3VsdHNcblxuICBsb2FkVmFyaWFibGVzRm9yUGF0aDogKHBhdGgpIC0+IEBsb2FkVmFyaWFibGVzRm9yUGF0aHMgW3BhdGhdXG5cbiAgbG9hZFZhcmlhYmxlc0ZvclBhdGhzOiAocGF0aHMpIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIEBzY2FuUGF0aHNGb3JWYXJpYWJsZXMgcGF0aHMsIChyZXN1bHRzKSA9PiByZXNvbHZlKHJlc3VsdHMpXG5cbiAgZ2V0VmFyaWFibGVzRm9yUGF0aDogKHBhdGgpIC0+IEB2YXJpYWJsZXMuZ2V0VmFyaWFibGVzRm9yUGF0aChwYXRoKVxuXG4gIGdldFZhcmlhYmxlc0ZvclBhdGhzOiAocGF0aHMpIC0+IEB2YXJpYWJsZXMuZ2V0VmFyaWFibGVzRm9yUGF0aHMocGF0aHMpXG5cbiAgZGVsZXRlVmFyaWFibGVzRm9yUGF0aDogKHBhdGgpIC0+IEBkZWxldGVWYXJpYWJsZXNGb3JQYXRocyBbcGF0aF1cblxuICBkZWxldGVWYXJpYWJsZXNGb3JQYXRoczogKHBhdGhzKSAtPlxuICAgIEB2YXJpYWJsZXMuZGVsZXRlVmFyaWFibGVzRm9yUGF0aHMocGF0aHMpXG5cbiAgcmVsb2FkVmFyaWFibGVzRm9yUGF0aDogKHBhdGgpIC0+IEByZWxvYWRWYXJpYWJsZXNGb3JQYXRocyBbcGF0aF1cblxuICByZWxvYWRWYXJpYWJsZXNGb3JQYXRoczogKHBhdGhzKSAtPlxuICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKVxuICAgIHByb21pc2UgPSBAaW5pdGlhbGl6ZSgpIHVubGVzcyBAaXNJbml0aWFsaXplZCgpXG5cbiAgICBwcm9taXNlXG4gICAgLnRoZW4gPT5cbiAgICAgIGlmIHBhdGhzLnNvbWUoKHBhdGgpID0+IHBhdGggbm90IGluIEBwYXRocylcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSlcblxuICAgICAgQGxvYWRWYXJpYWJsZXNGb3JQYXRocyhwYXRocylcbiAgICAudGhlbiAocmVzdWx0cykgPT5cbiAgICAgIEB2YXJpYWJsZXMudXBkYXRlQ29sbGVjdGlvbihyZXN1bHRzLCBwYXRocylcblxuICBzY2FuUGF0aHNGb3JWYXJpYWJsZXM6IChwYXRocywgY2FsbGJhY2spIC0+XG4gICAgaWYgcGF0aHMubGVuZ3RoIGlzIDEgYW5kIGNvbG9yQnVmZmVyID0gQGNvbG9yQnVmZmVyRm9yUGF0aChwYXRoc1swXSlcbiAgICAgIGNvbG9yQnVmZmVyLnNjYW5CdWZmZXJGb3JWYXJpYWJsZXMoKS50aGVuIChyZXN1bHRzKSAtPiBjYWxsYmFjayhyZXN1bHRzKVxuICAgIGVsc2VcbiAgICAgIFBhdGhzU2Nhbm5lciA/PSByZXF1aXJlICcuL3BhdGhzLXNjYW5uZXInXG5cbiAgICAgIFBhdGhzU2Nhbm5lci5zdGFydFRhc2sgcGF0aHMubWFwKChwKSA9PiBbcCwgQHNjb3BlRnJvbUZpbGVOYW1lKHApXSksIEB2YXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnksIChyZXN1bHRzKSAtPiBjYWxsYmFjayhyZXN1bHRzKVxuXG4gIGxvYWRUaGVtZXNWYXJpYWJsZXM6IC0+XG4gICAge1RIRU1FX1ZBUklBQkxFU30gPSByZXF1aXJlICcuL3VyaXMnIHVubGVzcyBUSEVNRV9WQVJJQUJMRVM/XG4gICAgQVRPTV9WQVJJQUJMRVMgPz0gcmVxdWlyZSAnLi9hdG9tLXZhcmlhYmxlcydcblxuICAgIGl0ZXJhdG9yID0gMFxuICAgIHZhcmlhYmxlcyA9IFtdXG4gICAgaHRtbCA9ICcnXG4gICAgQVRPTV9WQVJJQUJMRVMuZm9yRWFjaCAodikgLT4gaHRtbCArPSBcIjxkaXYgY2xhc3M9JyN7dn0nPiN7dn08L2Rpdj5cIlxuXG4gICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBkaXYuY2xhc3NOYW1lID0gJ3BpZ21lbnRzLXNhbXBsZXInXG4gICAgZGl2LmlubmVySFRNTCA9IGh0bWxcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRpdilcblxuICAgIEFUT01fVkFSSUFCTEVTLmZvckVhY2ggKHYsaSkgLT5cbiAgICAgIG5vZGUgPSBkaXYuY2hpbGRyZW5baV1cbiAgICAgIGNvbG9yID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKS5jb2xvclxuICAgICAgZW5kID0gaXRlcmF0b3IgKyB2Lmxlbmd0aCArIGNvbG9yLmxlbmd0aCArIDRcblxuICAgICAgdmFyaWFibGUgPVxuICAgICAgICBuYW1lOiBcIkAje3Z9XCJcbiAgICAgICAgbGluZTogaVxuICAgICAgICB2YWx1ZTogY29sb3JcbiAgICAgICAgcmFuZ2U6IFtpdGVyYXRvcixlbmRdXG4gICAgICAgIHBhdGg6IFRIRU1FX1ZBUklBQkxFU1xuXG4gICAgICBpdGVyYXRvciA9IGVuZFxuICAgICAgdmFyaWFibGVzLnB1c2godmFyaWFibGUpXG5cbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRpdilcbiAgICByZXR1cm4gdmFyaWFibGVzXG5cbiAgIyMgICAgICMjIyMjIyAgIyMjIyMjIyMgIyMjIyMjIyMgIyMjIyMjIyMgIyMjIyAjIyAgICAjIyAgIyMjIyMjICAgICMjIyMjI1xuICAjIyAgICAjIyAgICAjIyAjIyAgICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjIyAgICMjICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjIyMgICMjICMjICAgICAgICAjI1xuICAjIyAgICAgIyMjIyMjICAjIyMjIyMgICAgICAjIyAgICAgICAjIyAgICAgIyMgICMjICMjICMjICMjICAgIyMjIyAgIyMjIyMjXG4gICMjICAgICAgICAgICMjICMjICAgICAgICAgICMjICAgICAgICMjICAgICAjIyAgIyMgICMjIyMgIyMgICAgIyMgICAgICAgICMjXG4gICMjICAgICMjICAgICMjICMjICAgICAgICAgICMjICAgICAgICMjICAgICAjIyAgIyMgICAjIyMgIyMgICAgIyMgICMjICAgICMjXG4gICMjICAgICAjIyMjIyMgICMjIyMjIyMjICAgICMjICAgICAgICMjICAgICMjIyMgIyMgICAgIyMgICMjIyMjIyAgICAjIyMjIyNcblxuICBnZXRSb290UGF0aHM6IC0+IGF0b20ucHJvamVjdC5nZXRQYXRocygpXG5cbiAgZ2V0U2Fzc1Njb3BlU3VmZml4OiAtPlxuICAgIEBzYXNzU2hhZGVBbmRUaW50SW1wbGVtZW50YXRpb24gPyBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLnNhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbicpID8gJ2NvbXBhc3MnXG5cbiAgc2V0U2Fzc1NoYWRlQW5kVGludEltcGxlbWVudGF0aW9uOiAoQHNhc3NTaGFkZUFuZFRpbnRJbXBsZW1lbnRhdGlvbikgLT5cbiAgICBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5LmVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIHtcbiAgICAgIHJlZ2lzdHJ5OiBAY29sb3JFeHByZXNzaW9uc1JlZ2lzdHJ5XG4gICAgfVxuXG4gIGdldFNvdXJjZU5hbWVzOiAtPlxuICAgIG5hbWVzID0gWycucGlnbWVudHMnXVxuICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KEBzb3VyY2VOYW1lcyA/IFtdKVxuICAgIHVubGVzcyBAaWdub3JlR2xvYmFsU291cmNlTmFtZXNcbiAgICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuc291cmNlTmFtZXMnKSA/IFtdKVxuICAgIG5hbWVzXG5cbiAgc2V0U291cmNlTmFtZXM6IChAc291cmNlTmFtZXM9W10pIC0+XG4gICAgcmV0dXJuIGlmIG5vdCBAaW5pdGlhbGl6ZWQ/IGFuZCBub3QgQGluaXRpYWxpemVQcm9taXNlP1xuXG4gICAgQGluaXRpYWxpemUoKS50aGVuID0+IEBsb2FkUGF0aHNBbmRWYXJpYWJsZXModHJ1ZSlcblxuICBzZXRJZ25vcmVHbG9iYWxTb3VyY2VOYW1lczogKEBpZ25vcmVHbG9iYWxTb3VyY2VOYW1lcykgLT5cbiAgICBAdXBkYXRlUGF0aHMoKVxuXG4gIGdldFNlYXJjaE5hbWVzOiAtPlxuICAgIG5hbWVzID0gW11cbiAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChAc291cmNlTmFtZXMgPyBbXSlcbiAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChAc2VhcmNoTmFtZXMgPyBbXSlcbiAgICB1bmxlc3MgQGlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLnNvdXJjZU5hbWVzJykgPyBbXSlcbiAgICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuZXh0ZW5kZWRTZWFyY2hOYW1lcycpID8gW10pXG4gICAgbmFtZXNcblxuICBzZXRTZWFyY2hOYW1lczogKEBzZWFyY2hOYW1lcz1bXSkgLT5cblxuICBzZXRJZ25vcmVHbG9iYWxTZWFyY2hOYW1lczogKEBpZ25vcmVHbG9iYWxTZWFyY2hOYW1lcykgLT5cblxuICBnZXRJZ25vcmVkTmFtZXM6IC0+XG4gICAgbmFtZXMgPSBAaWdub3JlZE5hbWVzID8gW11cbiAgICB1bmxlc3MgQGlnbm9yZUdsb2JhbElnbm9yZWROYW1lc1xuICAgICAgbmFtZXMgPSBuYW1lcy5jb25jYXQoQGdldEdsb2JhbElnbm9yZWROYW1lcygpID8gW10pXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ2NvcmUuaWdub3JlZE5hbWVzJykgPyBbXSlcbiAgICBuYW1lc1xuXG4gIGdldEdsb2JhbElnbm9yZWROYW1lczogLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmlnbm9yZWROYW1lcycpPy5tYXAgKHApIC0+XG4gICAgICBpZiAvXFwvXFwqJC8udGVzdChwKSB0aGVuIHAgKyAnKicgZWxzZSBwXG5cbiAgc2V0SWdub3JlZE5hbWVzOiAoQGlnbm9yZWROYW1lcz1bXSkgLT5cbiAgICBpZiBub3QgQGluaXRpYWxpemVkPyBhbmQgbm90IEBpbml0aWFsaXplUHJvbWlzZT9cbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnUHJvamVjdCBpcyBub3QgaW5pdGlhbGl6ZWQgeWV0JylcblxuICAgIEBpbml0aWFsaXplKCkudGhlbiA9PlxuICAgICAgZGlydGllZCA9IEBwYXRocy5maWx0ZXIgKHApID0+IEBpc0lnbm9yZWRQYXRoKHApXG4gICAgICBAZGVsZXRlVmFyaWFibGVzRm9yUGF0aHMoZGlydGllZClcblxuICAgICAgQHBhdGhzID0gQHBhdGhzLmZpbHRlciAocCkgPT4gIUBpc0lnbm9yZWRQYXRoKHApXG4gICAgICBAbG9hZFBhdGhzQW5kVmFyaWFibGVzKHRydWUpXG5cbiAgc2V0SWdub3JlR2xvYmFsSWdub3JlZE5hbWVzOiAoQGlnbm9yZUdsb2JhbElnbm9yZWROYW1lcykgLT5cbiAgICBAdXBkYXRlUGF0aHMoKVxuXG4gIGdldElnbm9yZWRTY29wZXM6IC0+XG4gICAgc2NvcGVzID0gQGlnbm9yZWRTY29wZXMgPyBbXVxuICAgIHVubGVzcyBAaWdub3JlR2xvYmFsSWdub3JlZFNjb3Blc1xuICAgICAgc2NvcGVzID0gc2NvcGVzLmNvbmNhdChhdG9tLmNvbmZpZy5nZXQoJ3BpZ21lbnRzLmlnbm9yZWRTY29wZXMnKSA/IFtdKVxuXG4gICAgc2NvcGVzID0gc2NvcGVzLmNvbmNhdChAaWdub3JlZEZpbGV0eXBlcylcbiAgICBzY29wZXNcblxuICBzZXRJZ25vcmVkU2NvcGVzOiAoQGlnbm9yZWRTY29wZXM9W10pIC0+XG4gICAgQGVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1pZ25vcmVkLXNjb3BlcycsIEBnZXRJZ25vcmVkU2NvcGVzKCkpXG5cbiAgc2V0SWdub3JlR2xvYmFsSWdub3JlZFNjb3BlczogKEBpZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzKSAtPlxuICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBAZ2V0SWdub3JlZFNjb3BlcygpKVxuXG4gIHNldFN1cHBvcnRlZEZpbGV0eXBlczogKEBzdXBwb3J0ZWRGaWxldHlwZXM9W10pIC0+XG4gICAgQHVwZGF0ZUlnbm9yZWRGaWxldHlwZXMoKVxuICAgIEBlbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtaWdub3JlZC1zY29wZXMnLCBAZ2V0SWdub3JlZFNjb3BlcygpKVxuXG4gIHVwZGF0ZUlnbm9yZWRGaWxldHlwZXM6IC0+XG4gICAgQGlnbm9yZWRGaWxldHlwZXMgPSBAZ2V0SWdub3JlZEZpbGV0eXBlcygpXG5cbiAgZ2V0SWdub3JlZEZpbGV0eXBlczogLT5cbiAgICBmaWxldHlwZXMgPSBAc3VwcG9ydGVkRmlsZXR5cGVzID8gW11cblxuICAgIHVubGVzcyBAaWdub3JlR2xvYmFsU3VwcG9ydGVkRmlsZXR5cGVzXG4gICAgICBmaWxldHlwZXMgPSBmaWxldHlwZXMuY29uY2F0KGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuc3VwcG9ydGVkRmlsZXR5cGVzJykgPyBbXSlcblxuICAgIGZpbGV0eXBlcyA9IFsnKiddIGlmIGZpbGV0eXBlcy5sZW5ndGggaXMgMFxuXG4gICAgcmV0dXJuIFtdIGlmIGZpbGV0eXBlcy5zb21lICh0eXBlKSAtPiB0eXBlIGlzICcqJ1xuXG4gICAgc2NvcGVzID0gZmlsZXR5cGVzLm1hcCAoZXh0KSAtPlxuICAgICAgYXRvbS5ncmFtbWFycy5zZWxlY3RHcmFtbWFyKFwiZmlsZS4je2V4dH1cIik/LnNjb3BlTmFtZS5yZXBsYWNlKC9cXC4vZywgJ1xcXFwuJylcbiAgICAuZmlsdGVyIChzY29wZSkgLT4gc2NvcGU/XG5cbiAgICBbXCJeKD8hXFxcXC4oI3tzY29wZXMuam9pbignfCcpfSkpXCJdXG5cbiAgc2V0SWdub3JlR2xvYmFsU3VwcG9ydGVkRmlsZXR5cGVzOiAoQGlnbm9yZUdsb2JhbFN1cHBvcnRlZEZpbGV0eXBlcykgLT5cbiAgICBAdXBkYXRlSWdub3JlZEZpbGV0eXBlcygpXG4gICAgQGVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1pZ25vcmVkLXNjb3BlcycsIEBnZXRJZ25vcmVkU2NvcGVzKCkpXG5cbiAgdGhlbWVzSW5jbHVkZWQ6IC0+IEBpbmNsdWRlVGhlbWVzXG5cbiAgc2V0SW5jbHVkZVRoZW1lczogKGluY2x1ZGVUaGVtZXMpIC0+XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpIGlmIGluY2x1ZGVUaGVtZXMgaXMgQGluY2x1ZGVUaGVtZXNcblxuICAgIEBpbmNsdWRlVGhlbWVzID0gaW5jbHVkZVRoZW1lc1xuICAgIGlmIEBpbmNsdWRlVGhlbWVzXG4gICAgICBAaW5jbHVkZVRoZW1lc1ZhcmlhYmxlcygpXG4gICAgZWxzZVxuICAgICAgQGRpc3Bvc2VUaGVtZXNWYXJpYWJsZXMoKVxuXG4gIGluY2x1ZGVUaGVtZXNWYXJpYWJsZXM6IC0+XG4gICAgQHRoZW1lc1N1YnNjcmlwdGlvbiA9IGF0b20udGhlbWVzLm9uRGlkQ2hhbmdlQWN0aXZlVGhlbWVzID0+XG4gICAgICByZXR1cm4gdW5sZXNzIEBpbmNsdWRlVGhlbWVzXG5cbiAgICAgIHtUSEVNRV9WQVJJQUJMRVN9ID0gcmVxdWlyZSAnLi91cmlzJyB1bmxlc3MgVEhFTUVfVkFSSUFCTEVTP1xuXG4gICAgICB2YXJpYWJsZXMgPSBAbG9hZFRoZW1lc1ZhcmlhYmxlcygpXG4gICAgICBAdmFyaWFibGVzLnVwZGF0ZVBhdGhDb2xsZWN0aW9uKFRIRU1FX1ZBUklBQkxFUywgdmFyaWFibGVzKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEB0aGVtZXNTdWJzY3JpcHRpb25cbiAgICBAdmFyaWFibGVzLmFkZE1hbnkoQGxvYWRUaGVtZXNWYXJpYWJsZXMoKSlcblxuICBkaXNwb3NlVGhlbWVzVmFyaWFibGVzOiAtPlxuICAgIHtUSEVNRV9WQVJJQUJMRVN9ID0gcmVxdWlyZSAnLi91cmlzJyB1bmxlc3MgVEhFTUVfVkFSSUFCTEVTP1xuXG4gICAgQHN1YnNjcmlwdGlvbnMucmVtb3ZlIEB0aGVtZXNTdWJzY3JpcHRpb25cbiAgICBAdmFyaWFibGVzLmRlbGV0ZVZhcmlhYmxlc0ZvclBhdGhzKFtUSEVNRV9WQVJJQUJMRVNdKVxuICAgIEB0aGVtZXNTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG5cbiAgZ2V0VGltZXN0YW1wOiAtPiBuZXcgRGF0ZSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIHVubGVzcyBTRVJJQUxJWkVfVkVSU0lPTj9cbiAgICAgIHtTRVJJQUxJWkVfVkVSU0lPTiwgU0VSSUFMSVpFX01BUktFUlNfVkVSU0lPTn0gPSByZXF1aXJlICcuL3ZlcnNpb25zJ1xuXG4gICAgZGF0YSA9XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdDb2xvclByb2plY3QnXG4gICAgICB0aW1lc3RhbXA6IEBnZXRUaW1lc3RhbXAoKVxuICAgICAgdmVyc2lvbjogU0VSSUFMSVpFX1ZFUlNJT05cbiAgICAgIG1hcmtlcnNWZXJzaW9uOiBTRVJJQUxJWkVfTUFSS0VSU19WRVJTSU9OXG4gICAgICBnbG9iYWxTb3VyY2VOYW1lczogYXRvbS5jb25maWcuZ2V0KCdwaWdtZW50cy5zb3VyY2VOYW1lcycpXG4gICAgICBnbG9iYWxJZ25vcmVkTmFtZXM6IGF0b20uY29uZmlnLmdldCgncGlnbWVudHMuaWdub3JlZE5hbWVzJylcblxuICAgIGlmIEBpZ25vcmVHbG9iYWxTb3VyY2VOYW1lcz9cbiAgICAgIGRhdGEuaWdub3JlR2xvYmFsU291cmNlTmFtZXMgPSBAaWdub3JlR2xvYmFsU291cmNlTmFtZXNcbiAgICBpZiBAaWdub3JlR2xvYmFsU2VhcmNoTmFtZXM/XG4gICAgICBkYXRhLmlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzID0gQGlnbm9yZUdsb2JhbFNlYXJjaE5hbWVzXG4gICAgaWYgQGlnbm9yZUdsb2JhbElnbm9yZWROYW1lcz9cbiAgICAgIGRhdGEuaWdub3JlR2xvYmFsSWdub3JlZE5hbWVzID0gQGlnbm9yZUdsb2JhbElnbm9yZWROYW1lc1xuICAgIGlmIEBpZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzP1xuICAgICAgZGF0YS5pZ25vcmVHbG9iYWxJZ25vcmVkU2NvcGVzID0gQGlnbm9yZUdsb2JhbElnbm9yZWRTY29wZXNcbiAgICBpZiBAaW5jbHVkZVRoZW1lcz9cbiAgICAgIGRhdGEuaW5jbHVkZVRoZW1lcyA9IEBpbmNsdWRlVGhlbWVzXG4gICAgaWYgQGlnbm9yZWRTY29wZXM/XG4gICAgICBkYXRhLmlnbm9yZWRTY29wZXMgPSBAaWdub3JlZFNjb3Blc1xuICAgIGlmIEBpZ25vcmVkTmFtZXM/XG4gICAgICBkYXRhLmlnbm9yZWROYW1lcyA9IEBpZ25vcmVkTmFtZXNcbiAgICBpZiBAc291cmNlTmFtZXM/XG4gICAgICBkYXRhLnNvdXJjZU5hbWVzID0gQHNvdXJjZU5hbWVzXG4gICAgaWYgQHNlYXJjaE5hbWVzP1xuICAgICAgZGF0YS5zZWFyY2hOYW1lcyA9IEBzZWFyY2hOYW1lc1xuXG4gICAgZGF0YS5idWZmZXJzID0gQHNlcmlhbGl6ZUJ1ZmZlcnMoKVxuXG4gICAgaWYgQGlzSW5pdGlhbGl6ZWQoKVxuICAgICAgZGF0YS5wYXRocyA9IEBwYXRoc1xuICAgICAgZGF0YS52YXJpYWJsZXMgPSBAdmFyaWFibGVzLnNlcmlhbGl6ZSgpXG5cbiAgICBkYXRhXG5cbiAgc2VyaWFsaXplQnVmZmVyczogLT5cbiAgICBvdXQgPSB7fVxuICAgIGZvciBpZCxjb2xvckJ1ZmZlciBvZiBAY29sb3JCdWZmZXJzQnlFZGl0b3JJZFxuICAgICAgb3V0W2lkXSA9IGNvbG9yQnVmZmVyLnNlcmlhbGl6ZSgpXG4gICAgb3V0XG4iXX0=

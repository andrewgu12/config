Object.defineProperty(exports, '__esModule', {
  value: true
});

var getLinter = _asyncToGenerator(function* (filePath) {
  var basedir = _path2['default'].dirname(filePath);
  if (tslintCache.has(basedir)) {
    return tslintCache.get(basedir);
  }

  if (config.useLocalTslint) {
    var localLint = yield resolveAndCacheLinter(basedir);
    if (localLint) {
      return localLint;
    }
  }

  if (fallbackLinter) {
    tslintCache.set(basedir, fallbackLinter);
    return fallbackLinter;
  }

  if (config.useGlobalTslint) {
    if (config.globalNodePath) {
      var globalLint = yield resolveAndCacheLinter(basedir, config.globalNodePath);
      if (globalLint) {
        fallbackLinter = globalLint;
        return globalLint;
      }
    }

    var prefix = undefined;
    try {
      prefix = yield getNodePrefixPath();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Attempted to load global tslint, but "npm get prefix" failed. Falling back to the packaged version of tslint. You can specify your prefix manually in the settings or linter-tslint config file. If your prefix is specified in the settings, make sure that it is correct.\n\nThe error message encountered was:\n\n' + err.message);
    }

    if (prefix) {
      var globalLint = yield resolveAndCacheLinter(basedir, prefix);
      if (globalLint) {
        fallbackLinter = globalLint;
        return globalLint;
      }
      // eslint-disable-next-line no-console
      console.warn('Unable to find global installation of tslint at ' + prefix + '. Falling back to the packaged version of tslint. If you have not done so, install tslint by running "npm install -g tslint" from the command line.');
    }
  }

  // eslint-disable-next-line import/no-dynamic-require
  fallbackLinter = require(tslintModuleName).Linter;
  tslintCache.set(basedir, fallbackLinter);
  return fallbackLinter;
});

var getProgram = _asyncToGenerator(function* (Linter, configurationPath) {
  var program = undefined;
  var configurationDir = _path2['default'].dirname(configurationPath);
  var tsconfigPath = _path2['default'].resolve(configurationDir, 'tsconfig.json');
  try {
    var stats = yield stat(tsconfigPath);
    if (stats.isFile()) {
      program = Linter.createProgram(tsconfigPath, configurationDir);
    }
  } catch (err) {
    // no-op
  }
  return program;
}

/**
 * Lint the provided TypeScript content
 * @param content {string} The content of the TypeScript file
 * @param filePath {string} File path of the TypeScript filePath
 * @param options {Object} Linter options
 * @return Array of lint results
 */
);

var lint = _asyncToGenerator(function* (content, filePath, options) {
  if (filePath === null || filePath === undefined) {
    return null;
  }

  var lintResult = undefined;
  try {
    var Linter = yield getLinter(filePath);
    var configurationPath = Linter.findConfigurationPath(null, filePath);
    var configuration = Linter.loadConfigurationFromPath(configurationPath);

    var rulesDirectory = configuration.rulesDirectory;

    if (rulesDirectory && configurationPath) {
      (function () {
        var configurationDir = _path2['default'].dirname(configurationPath);
        if (!Array.isArray(rulesDirectory)) {
          rulesDirectory = [rulesDirectory];
        }
        rulesDirectory = rulesDirectory.map(function (dir) {
          if (_path2['default'].isAbsolute(dir)) {
            return dir;
          }
          return _path2['default'].join(configurationDir, dir);
        });

        if (config.rulesDirectory) {
          rulesDirectory.push(config.rulesDirectory);
        }
      })();
    }

    var program = undefined;
    if (config.enableSemanticRules && configurationPath) {
      program = yield getProgram(Linter, configurationPath);
    }

    var linter = new Linter(Object.assign({
      formatter: 'json',
      rulesDirectory: rulesDirectory
    }, options), program);

    linter.lint(filePath, content, configuration);
    lintResult = linter.getResult();
  } catch (err) {
    console.error(err.message, err.stack); // eslint-disable-line no-console
    lintResult = {};
  }

  if (
  // tslint@<5
  !lintResult.failureCount &&
  // tslint@>=5
  !lintResult.errorCount && !lintResult.warningCount && !lintResult.infoCount) {
    return [];
  }

  return lintResult.failures.map(function (failure) {
    var ruleUri = (0, _tslintRuleDocumentation.getRuleUri)(failure.getRuleName());
    var startPosition = failure.getStartPosition().getLineAndCharacter();
    var endPosition = failure.getEndPosition().getLineAndCharacter();
    return {
      type: failure.ruleSeverity || 'warning',
      html: (0, _escapeHtml2['default'])(failure.getFailure()) + ' (<a href="' + ruleUri.uri + '">' + failure.getRuleName() + '</a>)',
      filePath: _path2['default'].normalize(failure.getFileName()),
      range: [[startPosition.line, startPosition.character], [endPosition.line, endPosition.character]]
    };
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/* global emit */

var _escapeHtml = require('escape-html');

var _escapeHtml2 = _interopRequireDefault(_escapeHtml);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tslintRuleDocumentation = require('tslint-rule-documentation');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _consistentPath = require('consistent-path');

var _consistentPath2 = _interopRequireDefault(_consistentPath);

'use babel';

process.title = 'linter-tslint worker';

var tslintModuleName = 'tslint';
var tslintCache = new Map();
var config = {
  useLocalTslint: false
};

var fallbackLinter = undefined;
var requireResolve = undefined;

function stat(pathname) {
  return new Promise(function (resolve, reject) {
    _fs2['default'].stat(pathname, function (err, stats) {
      if (err) {
        return reject(err);
      }
      return resolve(stats);
    });
  });
}

/**
 * Shim for TSLint v3 interoperability
 * @param {Function} Linter TSLint v3 linter
 * @return {Function} TSLint v4-compatible linter
 */
function shim(Linter) {
  function LinterShim(options) {
    this.options = options;
    this.results = {};
  }

  // Assign class properties
  Object.assign(LinterShim, Linter);

  // Assign instance methods
  LinterShim.prototype = Object.assign({}, Linter.prototype, {
    lint: function lint(filePath, text, configuration) {
      var options = Object.assign({}, this.options, { configuration: configuration });
      var linter = new Linter(filePath, text, options);
      this.results = linter.lint();
    },
    getResult: function getResult() {
      return this.results;
    }
  });

  return LinterShim;
}

function resolveAndCacheLinter(fileDir, moduleDir) {
  var basedir = moduleDir || fileDir;
  return new Promise(function (resolve) {
    if (!requireResolve) {
      requireResolve = require('resolve');
    }
    requireResolve(tslintModuleName, { basedir: basedir }, function (err, linterPath, pkg) {
      var linter = undefined;
      if (!err && pkg && /^3|4|5\./.test(pkg.version)) {
        if (pkg.version.startsWith('3')) {
          // eslint-disable-next-line import/no-dynamic-require
          linter = shim(require('loophole').allowUnsafeNewFunction(function () {
            return require(linterPath);
          }));
        } else {
          // eslint-disable-next-line import/no-dynamic-require
          linter = require('loophole').allowUnsafeNewFunction(function () {
            return require(linterPath).Linter;
          });
        }
        tslintCache.set(fileDir, linter);
      }
      resolve(linter);
    });
  });
}

function getNodePrefixPath() {
  return new Promise(function (resolve, reject) {
    var npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    _child_process2['default'].exec(npmCommand + ' get prefix', { env: Object.assign(Object.assign({}, process.env), { PATH: (0, _consistentPath2['default'])() }) }, function (err, stdout, stderr) {
      if (err || stderr) {
        reject(err || new Error(stderr));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

exports['default'] = _asyncToGenerator(function* (initialConfig) {
  config.useLocalTslint = initialConfig.useLocalTslint;
  config.enableSemanticRules = initialConfig.enableSemanticRules;
  config.useGlobalTslint = initialConfig.useGlobalTslint;
  config.globalNodePath = initialConfig.globalNodePath;

  process.on('message', _asyncToGenerator(function* (message) {
    if (message.messageType === 'config') {
      config[message.message.key] = message.message.value;

      if (message.message.key === 'useLocalTslint') {
        tslintCache.clear();
      }
    } else {
      var _message$message = message.message;
      var emitKey = _message$message.emitKey;
      var jobType = _message$message.jobType;
      var content = _message$message.content;
      var filePath = _message$message.filePath;

      var options = jobType === 'fix' ? { fix: true } : {};

      var results = yield lint(content, filePath, options);
      emit(emitKey, results);
    }
  }));
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vLmF0b20vcGFja2FnZXMvbGludGVyLXRzbGludC9saWIvd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUEwR2UsU0FBUyxxQkFBeEIsV0FBeUIsUUFBUSxFQUFFO0FBQ2pDLE1BQU0sT0FBTyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2QyxNQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDNUIsV0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ2pDOztBQUVELE1BQUksTUFBTSxDQUFDLGNBQWMsRUFBRTtBQUN6QixRQUFNLFNBQVMsR0FBRyxNQUFNLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZELFFBQUksU0FBUyxFQUFFO0FBQ2IsYUFBTyxTQUFTLENBQUM7S0FDbEI7R0FDRjs7QUFFRCxNQUFJLGNBQWMsRUFBRTtBQUNsQixlQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN6QyxXQUFPLGNBQWMsQ0FBQztHQUN2Qjs7QUFFRCxNQUFJLE1BQU0sQ0FBQyxlQUFlLEVBQUU7QUFDMUIsUUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFO0FBQ3pCLFVBQU0sVUFBVSxHQUFHLE1BQU0scUJBQXFCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMvRSxVQUFJLFVBQVUsRUFBRTtBQUNkLHNCQUFjLEdBQUcsVUFBVSxDQUFDO0FBQzVCLGVBQU8sVUFBVSxDQUFDO09BQ25CO0tBQ0Y7O0FBRUQsUUFBSSxNQUFNLFlBQUEsQ0FBQztBQUNYLFFBQUk7QUFDRixZQUFNLEdBQUcsTUFBTSxpQkFBaUIsRUFBRSxDQUFDO0tBQ3BDLENBQUMsT0FBTyxHQUFHLEVBQUU7O0FBRVosYUFBTyxDQUFDLElBQUksMlRBQXlULEdBQUcsQ0FBQyxPQUFPLENBQUcsQ0FBQztLQUNy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Ii9Vc2Vycy9taW5nYm8vLmF0b20vcGFja2FnZXMvbGludGVyLXRzbGludC9saWIvd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qIGdsb2JhbCBlbWl0ICovXG5cbmltcG9ydCBlc2NhcGVIVE1MIGZyb20gJ2VzY2FwZS1odG1sJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGdldFJ1bGVVcmkgfSBmcm9tICd0c2xpbnQtcnVsZS1kb2N1bWVudGF0aW9uJztcbmltcG9ydCBDaGlsZFByb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgZ2V0UGF0aCBmcm9tICdjb25zaXN0ZW50LXBhdGgnO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2xpbnRlci10c2xpbnQgd29ya2VyJztcblxuY29uc3QgdHNsaW50TW9kdWxlTmFtZSA9ICd0c2xpbnQnO1xuY29uc3QgdHNsaW50Q2FjaGUgPSBuZXcgTWFwKCk7XG5jb25zdCBjb25maWcgPSB7XG4gIHVzZUxvY2FsVHNsaW50OiBmYWxzZSxcbn07XG5cbmxldCBmYWxsYmFja0xpbnRlcjtcbmxldCByZXF1aXJlUmVzb2x2ZTtcblxuZnVuY3Rpb24gc3RhdChwYXRobmFtZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZzLnN0YXQocGF0aG5hbWUsIChlcnIsIHN0YXRzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNvbHZlKHN0YXRzKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogU2hpbSBmb3IgVFNMaW50IHYzIGludGVyb3BlcmFiaWxpdHlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IExpbnRlciBUU0xpbnQgdjMgbGludGVyXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVFNMaW50IHY0LWNvbXBhdGlibGUgbGludGVyXG4gKi9cbmZ1bmN0aW9uIHNoaW0oTGludGVyKSB7XG4gIGZ1bmN0aW9uIExpbnRlclNoaW0ob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5yZXN1bHRzID0ge307XG4gIH1cblxuICAvLyBBc3NpZ24gY2xhc3MgcHJvcGVydGllc1xuICBPYmplY3QuYXNzaWduKExpbnRlclNoaW0sIExpbnRlcik7XG5cbiAgLy8gQXNzaWduIGluc3RhbmNlIG1ldGhvZHNcbiAgTGludGVyU2hpbS5wcm90b3R5cGUgPSBPYmplY3QuYXNzaWduKHt9LCBMaW50ZXIucHJvdG90eXBlLCB7XG4gICAgbGludChmaWxlUGF0aCwgdGV4dCwgY29uZmlndXJhdGlvbikge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucywgeyBjb25maWd1cmF0aW9uIH0pO1xuICAgICAgY29uc3QgbGludGVyID0gbmV3IExpbnRlcihmaWxlUGF0aCwgdGV4dCwgb3B0aW9ucyk7XG4gICAgICB0aGlzLnJlc3VsdHMgPSBsaW50ZXIubGludCgpO1xuICAgIH0sXG4gICAgZ2V0UmVzdWx0KCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVzdWx0cztcbiAgICB9LFxuICB9KTtcblxuICByZXR1cm4gTGludGVyU2hpbTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUFuZENhY2hlTGludGVyKGZpbGVEaXIsIG1vZHVsZURpcikge1xuICBjb25zdCBiYXNlZGlyID0gbW9kdWxlRGlyIHx8IGZpbGVEaXI7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGlmICghcmVxdWlyZVJlc29sdmUpIHtcbiAgICAgIHJlcXVpcmVSZXNvbHZlID0gcmVxdWlyZSgncmVzb2x2ZScpO1xuICAgIH1cbiAgICByZXF1aXJlUmVzb2x2ZShcbiAgICAgIHRzbGludE1vZHVsZU5hbWUsXG4gICAgICB7IGJhc2VkaXIgfSxcbiAgICAgIChlcnIsIGxpbnRlclBhdGgsIHBrZykgPT4ge1xuICAgICAgICBsZXQgbGludGVyO1xuICAgICAgICBpZiAoIWVyciAmJiBwa2cgJiYgL14zfDR8NVxcLi8udGVzdChwa2cudmVyc2lvbikpIHtcbiAgICAgICAgICBpZiAocGtnLnZlcnNpb24uc3RhcnRzV2l0aCgnMycpKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWR5bmFtaWMtcmVxdWlyZVxuICAgICAgICAgICAgbGludGVyID0gc2hpbShyZXF1aXJlKCdsb29waG9sZScpLmFsbG93VW5zYWZlTmV3RnVuY3Rpb24oKCkgPT4gcmVxdWlyZShsaW50ZXJQYXRoKSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWR5bmFtaWMtcmVxdWlyZVxuICAgICAgICAgICAgbGludGVyID0gcmVxdWlyZSgnbG9vcGhvbGUnKS5hbGxvd1Vuc2FmZU5ld0Z1bmN0aW9uKCgpID0+IHJlcXVpcmUobGludGVyUGF0aCkuTGludGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdHNsaW50Q2FjaGUuc2V0KGZpbGVEaXIsIGxpbnRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZShsaW50ZXIpO1xuICAgICAgfSxcbiAgICApO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Tm9kZVByZWZpeFBhdGgoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgbnBtQ29tbWFuZCA9IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgPyAnbnBtLmNtZCcgOiAnbnBtJztcbiAgICBDaGlsZFByb2Nlc3MuZXhlYyhcbiAgICAgIGAke25wbUNvbW1hbmR9IGdldCBwcmVmaXhgLFxuICAgICAgeyBlbnY6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgcHJvY2Vzcy5lbnYpLCB7IFBBVEg6IGdldFBhdGgoKSB9KSB9LFxuICAgICAgKGVyciwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgaWYgKGVyciB8fCBzdGRlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyIHx8IG5ldyBFcnJvcihzdGRlcnIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHN0ZG91dC50cmltKCkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRMaW50ZXIoZmlsZVBhdGgpIHtcbiAgY29uc3QgYmFzZWRpciA9IHBhdGguZGlybmFtZShmaWxlUGF0aCk7XG4gIGlmICh0c2xpbnRDYWNoZS5oYXMoYmFzZWRpcikpIHtcbiAgICByZXR1cm4gdHNsaW50Q2FjaGUuZ2V0KGJhc2VkaXIpO1xuICB9XG5cbiAgaWYgKGNvbmZpZy51c2VMb2NhbFRzbGludCkge1xuICAgIGNvbnN0IGxvY2FsTGludCA9IGF3YWl0IHJlc29sdmVBbmRDYWNoZUxpbnRlcihiYXNlZGlyKTtcbiAgICBpZiAobG9jYWxMaW50KSB7XG4gICAgICByZXR1cm4gbG9jYWxMaW50O1xuICAgIH1cbiAgfVxuXG4gIGlmIChmYWxsYmFja0xpbnRlcikge1xuICAgIHRzbGludENhY2hlLnNldChiYXNlZGlyLCBmYWxsYmFja0xpbnRlcik7XG4gICAgcmV0dXJuIGZhbGxiYWNrTGludGVyO1xuICB9XG5cbiAgaWYgKGNvbmZpZy51c2VHbG9iYWxUc2xpbnQpIHtcbiAgICBpZiAoY29uZmlnLmdsb2JhbE5vZGVQYXRoKSB7XG4gICAgICBjb25zdCBnbG9iYWxMaW50ID0gYXdhaXQgcmVzb2x2ZUFuZENhY2hlTGludGVyKGJhc2VkaXIsIGNvbmZpZy5nbG9iYWxOb2RlUGF0aCk7XG4gICAgICBpZiAoZ2xvYmFsTGludCkge1xuICAgICAgICBmYWxsYmFja0xpbnRlciA9IGdsb2JhbExpbnQ7XG4gICAgICAgIHJldHVybiBnbG9iYWxMaW50O1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwcmVmaXg7XG4gICAgdHJ5IHtcbiAgICAgIHByZWZpeCA9IGF3YWl0IGdldE5vZGVQcmVmaXhQYXRoKCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKGBBdHRlbXB0ZWQgdG8gbG9hZCBnbG9iYWwgdHNsaW50LCBidXQgXCJucG0gZ2V0IHByZWZpeFwiIGZhaWxlZC4gRmFsbGluZyBiYWNrIHRvIHRoZSBwYWNrYWdlZCB2ZXJzaW9uIG9mIHRzbGludC4gWW91IGNhbiBzcGVjaWZ5IHlvdXIgcHJlZml4IG1hbnVhbGx5IGluIHRoZSBzZXR0aW5ncyBvciBsaW50ZXItdHNsaW50IGNvbmZpZyBmaWxlLiBJZiB5b3VyIHByZWZpeCBpcyBzcGVjaWZpZWQgaW4gdGhlIHNldHRpbmdzLCBtYWtlIHN1cmUgdGhhdCBpdCBpcyBjb3JyZWN0LlxcblxcblRoZSBlcnJvciBtZXNzYWdlIGVuY291bnRlcmVkIHdhczpcXG5cXG4ke2Vyci5tZXNzYWdlfWApO1xuICAgIH1cblxuICAgIGlmIChwcmVmaXgpIHtcbiAgICAgIGNvbnN0IGdsb2JhbExpbnQgPSBhd2FpdCByZXNvbHZlQW5kQ2FjaGVMaW50ZXIoYmFzZWRpciwgcHJlZml4KTtcbiAgICAgIGlmIChnbG9iYWxMaW50KSB7XG4gICAgICAgIGZhbGxiYWNrTGludGVyID0gZ2xvYmFsTGludDtcbiAgICAgICAgcmV0dXJuIGdsb2JhbExpbnQ7XG4gICAgICB9XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKGBVbmFibGUgdG8gZmluZCBnbG9iYWwgaW5zdGFsbGF0aW9uIG9mIHRzbGludCBhdCAke3ByZWZpeH0uIEZhbGxpbmcgYmFjayB0byB0aGUgcGFja2FnZWQgdmVyc2lvbiBvZiB0c2xpbnQuIElmIHlvdSBoYXZlIG5vdCBkb25lIHNvLCBpbnN0YWxsIHRzbGludCBieSBydW5uaW5nIFwibnBtIGluc3RhbGwgLWcgdHNsaW50XCIgZnJvbSB0aGUgY29tbWFuZCBsaW5lLmApO1xuICAgIH1cbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZHluYW1pYy1yZXF1aXJlXG4gIGZhbGxiYWNrTGludGVyID0gcmVxdWlyZSh0c2xpbnRNb2R1bGVOYW1lKS5MaW50ZXI7XG4gIHRzbGludENhY2hlLnNldChiYXNlZGlyLCBmYWxsYmFja0xpbnRlcik7XG4gIHJldHVybiBmYWxsYmFja0xpbnRlcjtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0UHJvZ3JhbShMaW50ZXIsIGNvbmZpZ3VyYXRpb25QYXRoKSB7XG4gIGxldCBwcm9ncmFtO1xuICBjb25zdCBjb25maWd1cmF0aW9uRGlyID0gcGF0aC5kaXJuYW1lKGNvbmZpZ3VyYXRpb25QYXRoKTtcbiAgY29uc3QgdHNjb25maWdQYXRoID0gcGF0aC5yZXNvbHZlKGNvbmZpZ3VyYXRpb25EaXIsICd0c2NvbmZpZy5qc29uJyk7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3RhdHMgPSBhd2FpdCBzdGF0KHRzY29uZmlnUGF0aCk7XG4gICAgaWYgKHN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICBwcm9ncmFtID0gTGludGVyLmNyZWF0ZVByb2dyYW0odHNjb25maWdQYXRoLCBjb25maWd1cmF0aW9uRGlyKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIG5vLW9wXG4gIH1cbiAgcmV0dXJuIHByb2dyYW07XG59XG5cbi8qKlxuICogTGludCB0aGUgcHJvdmlkZWQgVHlwZVNjcmlwdCBjb250ZW50XG4gKiBAcGFyYW0gY29udGVudCB7c3RyaW5nfSBUaGUgY29udGVudCBvZiB0aGUgVHlwZVNjcmlwdCBmaWxlXG4gKiBAcGFyYW0gZmlsZVBhdGgge3N0cmluZ30gRmlsZSBwYXRoIG9mIHRoZSBUeXBlU2NyaXB0IGZpbGVQYXRoXG4gKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSBMaW50ZXIgb3B0aW9uc1xuICogQHJldHVybiBBcnJheSBvZiBsaW50IHJlc3VsdHNcbiAqL1xuYXN5bmMgZnVuY3Rpb24gbGludChjb250ZW50LCBmaWxlUGF0aCwgb3B0aW9ucykge1xuICBpZiAoZmlsZVBhdGggPT09IG51bGwgfHwgZmlsZVBhdGggPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbGV0IGxpbnRSZXN1bHQ7XG4gIHRyeSB7XG4gICAgY29uc3QgTGludGVyID0gYXdhaXQgZ2V0TGludGVyKGZpbGVQYXRoKTtcbiAgICBjb25zdCBjb25maWd1cmF0aW9uUGF0aCA9IExpbnRlci5maW5kQ29uZmlndXJhdGlvblBhdGgobnVsbCwgZmlsZVBhdGgpO1xuICAgIGNvbnN0IGNvbmZpZ3VyYXRpb24gPSBMaW50ZXIubG9hZENvbmZpZ3VyYXRpb25Gcm9tUGF0aChjb25maWd1cmF0aW9uUGF0aCk7XG5cbiAgICBsZXQgeyBydWxlc0RpcmVjdG9yeSB9ID0gY29uZmlndXJhdGlvbjtcbiAgICBpZiAocnVsZXNEaXJlY3RvcnkgJiYgY29uZmlndXJhdGlvblBhdGgpIHtcbiAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25EaXIgPSBwYXRoLmRpcm5hbWUoY29uZmlndXJhdGlvblBhdGgpO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHJ1bGVzRGlyZWN0b3J5KSkge1xuICAgICAgICBydWxlc0RpcmVjdG9yeSA9IFtydWxlc0RpcmVjdG9yeV07XG4gICAgICB9XG4gICAgICBydWxlc0RpcmVjdG9yeSA9IHJ1bGVzRGlyZWN0b3J5Lm1hcCgoZGlyKSA9PiB7XG4gICAgICAgIGlmIChwYXRoLmlzQWJzb2x1dGUoZGlyKSkge1xuICAgICAgICAgIHJldHVybiBkaXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGguam9pbihjb25maWd1cmF0aW9uRGlyLCBkaXIpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb25maWcucnVsZXNEaXJlY3RvcnkpIHtcbiAgICAgICAgcnVsZXNEaXJlY3RvcnkucHVzaChjb25maWcucnVsZXNEaXJlY3RvcnkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBwcm9ncmFtO1xuICAgIGlmIChjb25maWcuZW5hYmxlU2VtYW50aWNSdWxlcyAmJiBjb25maWd1cmF0aW9uUGF0aCkge1xuICAgICAgcHJvZ3JhbSA9IGF3YWl0IGdldFByb2dyYW0oTGludGVyLCBjb25maWd1cmF0aW9uUGF0aCk7XG4gICAgfVxuXG4gICAgY29uc3QgbGludGVyID0gbmV3IExpbnRlcihPYmplY3QuYXNzaWduKHtcbiAgICAgIGZvcm1hdHRlcjogJ2pzb24nLFxuICAgICAgcnVsZXNEaXJlY3RvcnksXG4gICAgfSwgb3B0aW9ucyksIHByb2dyYW0pO1xuXG4gICAgbGludGVyLmxpbnQoZmlsZVBhdGgsIGNvbnRlbnQsIGNvbmZpZ3VyYXRpb24pO1xuICAgIGxpbnRSZXN1bHQgPSBsaW50ZXIuZ2V0UmVzdWx0KCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UsIGVyci5zdGFjayk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgIGxpbnRSZXN1bHQgPSB7fTtcbiAgfVxuXG4gIGlmIChcbiAgICAvLyB0c2xpbnRAPDVcbiAgICAhbGludFJlc3VsdC5mYWlsdXJlQ291bnQgJiZcbiAgICAvLyB0c2xpbnRAPj01XG4gICAgIWxpbnRSZXN1bHQuZXJyb3JDb3VudCAmJlxuICAgICFsaW50UmVzdWx0Lndhcm5pbmdDb3VudCAmJlxuICAgICFsaW50UmVzdWx0LmluZm9Db3VudFxuICApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICByZXR1cm4gbGludFJlc3VsdC5mYWlsdXJlcy5tYXAoKGZhaWx1cmUpID0+IHtcbiAgICBjb25zdCBydWxlVXJpID0gZ2V0UnVsZVVyaShmYWlsdXJlLmdldFJ1bGVOYW1lKCkpO1xuICAgIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSBmYWlsdXJlLmdldFN0YXJ0UG9zaXRpb24oKS5nZXRMaW5lQW5kQ2hhcmFjdGVyKCk7XG4gICAgY29uc3QgZW5kUG9zaXRpb24gPSBmYWlsdXJlLmdldEVuZFBvc2l0aW9uKCkuZ2V0TGluZUFuZENoYXJhY3RlcigpO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBmYWlsdXJlLnJ1bGVTZXZlcml0eSB8fCAnd2FybmluZycsXG4gICAgICBodG1sOiBgJHtlc2NhcGVIVE1MKGZhaWx1cmUuZ2V0RmFpbHVyZSgpKX0gKDxhIGhyZWY9XCIke3J1bGVVcmkudXJpfVwiPiR7ZmFpbHVyZS5nZXRSdWxlTmFtZSgpfTwvYT4pYCxcbiAgICAgIGZpbGVQYXRoOiBwYXRoLm5vcm1hbGl6ZShmYWlsdXJlLmdldEZpbGVOYW1lKCkpLFxuICAgICAgcmFuZ2U6IFtcbiAgICAgICAgW3N0YXJ0UG9zaXRpb24ubGluZSwgc3RhcnRQb3NpdGlvbi5jaGFyYWN0ZXJdLFxuICAgICAgICBbZW5kUG9zaXRpb24ubGluZSwgZW5kUG9zaXRpb24uY2hhcmFjdGVyXSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChpbml0aWFsQ29uZmlnKSB7XG4gIGNvbmZpZy51c2VMb2NhbFRzbGludCA9IGluaXRpYWxDb25maWcudXNlTG9jYWxUc2xpbnQ7XG4gIGNvbmZpZy5lbmFibGVTZW1hbnRpY1J1bGVzID0gaW5pdGlhbENvbmZpZy5lbmFibGVTZW1hbnRpY1J1bGVzO1xuICBjb25maWcudXNlR2xvYmFsVHNsaW50ID0gaW5pdGlhbENvbmZpZy51c2VHbG9iYWxUc2xpbnQ7XG4gIGNvbmZpZy5nbG9iYWxOb2RlUGF0aCA9IGluaXRpYWxDb25maWcuZ2xvYmFsTm9kZVBhdGg7XG5cbiAgcHJvY2Vzcy5vbignbWVzc2FnZScsIGFzeW5jIChtZXNzYWdlKSA9PiB7XG4gICAgaWYgKG1lc3NhZ2UubWVzc2FnZVR5cGUgPT09ICdjb25maWcnKSB7XG4gICAgICBjb25maWdbbWVzc2FnZS5tZXNzYWdlLmtleV0gPSBtZXNzYWdlLm1lc3NhZ2UudmFsdWU7XG5cbiAgICAgIGlmIChtZXNzYWdlLm1lc3NhZ2Uua2V5ID09PSAndXNlTG9jYWxUc2xpbnQnKSB7XG4gICAgICAgIHRzbGludENhY2hlLmNsZWFyKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZW1pdEtleSwgam9iVHlwZSwgY29udGVudCwgZmlsZVBhdGgsXG4gICAgICB9ID0gbWVzc2FnZS5tZXNzYWdlO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IGpvYlR5cGUgPT09ICdmaXgnID8geyBmaXg6IHRydWUgfSA6IHt9O1xuXG4gICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgbGludChjb250ZW50LCBmaWxlUGF0aCwgb3B0aW9ucyk7XG4gICAgICBlbWl0KGVtaXRLZXksIHJlc3VsdHMpO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=
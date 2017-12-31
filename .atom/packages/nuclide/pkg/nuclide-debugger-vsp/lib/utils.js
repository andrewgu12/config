'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReactNativeLaunchProcessInfo = exports.getReactNativeAttachProcessInfo = exports.getNodeAttachProcessInfo = exports.getNodeLaunchProcessInfo = exports.getPythonScriptLaunchProcessInfo = exports.getPythonParLaunchProcessInfo = exports.REACT_NATIVE_PACKAGER_DEFAULT_PORT = undefined;

var _asyncToGenerator = _interopRequireDefault(require('async-to-generator'));

let getPythonParLaunchProcessInfo = exports.getPythonParLaunchProcessInfo = (() => {
  var _ref = (0, _asyncToGenerator.default)(function* (parPath, args) {
    return new (_VspProcessInfo || _load_VspProcessInfo()).default(parPath, 'launch', (_constants || _load_constants()).VsAdapterTypes.PYTHON, (yield getPythonAdapterInfo(parPath)), getPythonParConfig(parPath, args));
  });

  return function getPythonParLaunchProcessInfo(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let getPythonScriptLaunchProcessInfo = exports.getPythonScriptLaunchProcessInfo = (() => {
  var _ref2 = (0, _asyncToGenerator.default)(function* (scriptPath, pythonPath, args, cwd, env) {
    return new (_VspProcessInfo || _load_VspProcessInfo()).default(scriptPath, 'launch', (_constants || _load_constants()).VsAdapterTypes.PYTHON, (yield getPythonAdapterInfo(scriptPath)), getPythonScriptConfig(scriptPath, pythonPath, cwd, args, env));
  });

  return function getPythonScriptLaunchProcessInfo(_x3, _x4, _x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
})();

let getNodeBinaryPath = (() => {
  var _ref3 = (0, _asyncToGenerator.default)(function* (path) {
    try {
      // $FlowFB
      return require('./fb-config').getNodeBinaryPath(path);
    } catch (error) {
      return 'node';
    }
  });

  return function getNodeBinaryPath(_x8) {
    return _ref3.apply(this, arguments);
  };
})();

let getPythonAdapterInfo = (() => {
  var _ref4 = (0, _asyncToGenerator.default)(function* (path) {
    const [adapterPath, nodePath] = yield Promise.all([(0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getRemoteDebuggerCommandServiceByNuclideUri)(path).getPythonAdapterPath(), getNodeBinaryPath(path)]);

    return {
      command: nodePath,
      args: [adapterPath]
    };
  });

  return function getPythonAdapterInfo(_x9) {
    return _ref4.apply(this, arguments);
  };
})();

let getPythonAttachTargetProcessInfo = (() => {
  var _ref5 = (0, _asyncToGenerator.default)(function* (targetRootUri, target) {
    return new (_VspProcessInfo || _load_VspProcessInfo()).default(targetRootUri, 'attach', (_constants || _load_constants()).VsAdapterTypes.PYTHON, (yield getPythonAdapterInfo(targetRootUri)), getPythonAttachTargetConfig(target));
  });

  return function getPythonAttachTargetProcessInfo(_x10, _x11) {
    return _ref5.apply(this, arguments);
  };
})();

let getNodeLaunchProcessInfo = exports.getNodeLaunchProcessInfo = (() => {
  var _ref6 = (0, _asyncToGenerator.default)(function* (scriptPath, nodePath, args, cwd, env, outFiles) {
    const adapterInfo = yield getNodeAdapterInfo(scriptPath);
    return new (_VspProcessInfo || _load_VspProcessInfo()).default(scriptPath, 'launch', (_constants || _load_constants()).VsAdapterTypes.NODE, adapterInfo, getNodeScriptConfig(scriptPath, nodePath.length > 0 ? nodePath : adapterInfo.command, cwd, args, env, outFiles));
  });

  return function getNodeLaunchProcessInfo(_x12, _x13, _x14, _x15, _x16, _x17) {
    return _ref6.apply(this, arguments);
  };
})();

let getNodeAttachProcessInfo = exports.getNodeAttachProcessInfo = (() => {
  var _ref7 = (0, _asyncToGenerator.default)(function* (targetUri, port) {
    const adapterInfo = yield getNodeAdapterInfo(targetUri);
    return new (_VspProcessInfo || _load_VspProcessInfo()).default(targetUri, 'attach', (_constants || _load_constants()).VsAdapterTypes.NODE, adapterInfo, getAttachNodeConfig(port));
  });

  return function getNodeAttachProcessInfo(_x18, _x19) {
    return _ref7.apply(this, arguments);
  };
})();

let getNodeAdapterInfo = (() => {
  var _ref8 = (0, _asyncToGenerator.default)(function* (path) {
    const [adapterPath, nodePath] = yield Promise.all([(0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getRemoteDebuggerCommandServiceByNuclideUri)(path).getNodeAdapterPath(), getNodeBinaryPath(path)]);

    return {
      command: nodePath,
      args: [adapterPath]
    };
  });

  return function getNodeAdapterInfo(_x20) {
    return _ref8.apply(this, arguments);
  };
})();

let getReactNativeAttachProcessInfo = exports.getReactNativeAttachProcessInfo = (() => {
  var _ref9 = (0, _asyncToGenerator.default)(function* (workspacePath, port) {
    const scriptPath = (_nuclideUri || _load_nuclideUri()).default.getPath((_nuclideUri || _load_nuclideUri()).default.join(workspacePath, '.vscode/launchReactNative.js'));
    const adapterInfo = yield getReactNativeAdapterInfo(scriptPath);
    return new (_VspProcessInfo || _load_VspProcessInfo()).default(scriptPath, 'attach', (_constants || _load_constants()).VsAdapterTypes.REACT_NATIVE, adapterInfo, getReactNativeScriptConfig(scriptPath, port));
  });

  return function getReactNativeAttachProcessInfo(_x21, _x22) {
    return _ref9.apply(this, arguments);
  };
})();

let getReactNativeLaunchProcessInfo = exports.getReactNativeLaunchProcessInfo = (() => {
  var _ref10 = (0, _asyncToGenerator.default)(function* (workspacePath, port, platform) {
    const scriptPath = (_nuclideUri || _load_nuclideUri()).default.getPath((_nuclideUri || _load_nuclideUri()).default.join(workspacePath, '.vscode/launchReactNative.js'));
    const adapterInfo = yield getReactNativeAdapterInfo(scriptPath);
    return new (_VspProcessInfo || _load_VspProcessInfo()).default(scriptPath, 'launch', (_constants || _load_constants()).VsAdapterTypes.REACT_NATIVE, adapterInfo, getReactNativeScriptConfig(scriptPath, port, platform));
  });

  return function getReactNativeLaunchProcessInfo(_x23, _x24, _x25) {
    return _ref10.apply(this, arguments);
  };
})();

let getReactNativeAdapterInfo = (() => {
  var _ref11 = (0, _asyncToGenerator.default)(function* (path) {
    const nodePath = yield getNodeBinaryPath(path);
    const adapterPath = getReactNativeAdapterPath();

    return {
      command: nodePath,
      args: [adapterPath]
    };
  });

  return function getReactNativeAdapterInfo(_x26) {
    return _ref11.apply(this, arguments);
  };
})();

exports.getDebuggerService = getDebuggerService;
exports.listenToRemoteDebugCommands = listenToRemoteDebugCommands;

var _observable;

function _load_observable() {
  return _observable = require('nuclide-commons/observable');
}

var _UniversalDisposable;

function _load_UniversalDisposable() {
  return _UniversalDisposable = _interopRequireDefault(require('nuclide-commons/UniversalDisposable'));
}

var _VspProcessInfo;

function _load_VspProcessInfo() {
  return _VspProcessInfo = _interopRequireDefault(require('./VspProcessInfo'));
}

var _VspProcessInfo2;

function _load_VspProcessInfo2() {
  return _VspProcessInfo2 = require('./VspProcessInfo');
}

var _nuclideUri;

function _load_nuclideUri() {
  return _nuclideUri = _interopRequireDefault(require('nuclide-commons/nuclideUri'));
}

var _constants;

function _load_constants() {
  return _constants = require('../../nuclide-debugger-common/lib/constants');
}

var _nuclideRemoteConnection;

function _load_nuclideRemoteConnection() {
  return _nuclideRemoteConnection = require('../../nuclide-remote-connection');
}

var _consumeFirstProvider;

function _load_consumeFirstProvider() {
  return _consumeFirstProvider = _interopRequireDefault(require('../../commons-atom/consumeFirstProvider'));
}

var _log4js;

function _load_log4js() {
  return _log4js = require('log4js');
}

var _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');

var _nuclideAnalytics;

function _load_nuclideAnalytics() {
  return _nuclideAnalytics = require('../../nuclide-analytics');
}

var _systemInfo;

function _load_systemInfo() {
  return _systemInfo = require('../../commons-node/system-info');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 * @format
 */

const DEFAULT_DEBUG_OPTIONS = new Set(['WaitOnAbnormalExit', 'WaitOnNormalExit', 'RedirectOutput']);

const REACT_NATIVE_PACKAGER_DEFAULT_PORT = exports.REACT_NATIVE_PACKAGER_DEFAULT_PORT = 8081;

// Delay starting the remote debug server to avoid affecting Nuclide's startup.
const REMOTE_DEBUG_SERVICES_DELAYED_STARTUP_MS = 10 * 1000;

function getPythonParConfig(parPath, args) {
  const localParPath = (_nuclideUri || _load_nuclideUri()).default.getPath(parPath);
  const cwd = (_nuclideUri || _load_nuclideUri()).default.dirname(localParPath);
  return {
    stopOnEntry: false,
    console: 'none',
    // Will be replaced with the main module at runtime.
    program: '/dev/null',
    args,
    debugOptions: Array.from(DEFAULT_DEBUG_OPTIONS),
    pythonPath: localParPath,
    cwd
  };
}

function getPythonScriptConfig(scriptPath, pythonPath, cwd, args, env) {
  return {
    stopOnEntry: false,
    console: 'none',
    program: (_nuclideUri || _load_nuclideUri()).default.getPath(scriptPath),
    cwd,
    args,
    env,
    debugOptions: Array.from(DEFAULT_DEBUG_OPTIONS),
    pythonPath
  };
}

function getPythonAttachTargetConfig(target) {
  const debugOptions = new Set(DEFAULT_DEBUG_OPTIONS);
  (target.debugOptions || []).forEach(opt => debugOptions.add(opt));
  return {
    localRoot: target.localRoot,
    remoteRoot: target.remoteRoot,
    // debugOptions: Array.from(debugOptions),
    port: target.port,
    host: '127.0.0.1'
  };
}

function getDebuggerService() {
  return (0, (_consumeFirstProvider || _load_consumeFirstProvider()).default)('nuclide-debugger.remote');
}

function rootUriOfConnection(connection) {
  return connection == null ? '' : connection.getUriOfRemotePath('/');
}

function notifyOpenDebugSession() {
  atom.notifications.addInfo("Received a remote debug request, but there's an open debug session already!", {
    detail: 'To be able to remote debug, please terminate your existing session'
  });
}

function getNodeScriptConfig(scriptPath, nodePath, cwd, args, env, outFiles) {
  return {
    protocol: 'inspector',
    stopOnEntry: false,
    program: (_nuclideUri || _load_nuclideUri()).default.getPath(scriptPath),
    runtimeExecutable: nodePath,
    cwd,
    args,
    env,
    outFiles: outFiles.length > 0 ? [outFiles] : []
  };
}

function getReactNativeScriptConfig(scriptPath, port, platform) {
  return {
    protocol: 'inspector',
    stopOnEntry: false,
    platform,
    program: scriptPath,
    // TODO(pelmers): do we need to supply outdir?,
    port
  };
}

function getReactNativeAdapterPath() {
  return (_nuclideUri || _load_nuclideUri()).default.join(__dirname, '../VendorLib/vscode-react-native/out/debugger/reactNativeDebugEntryPoint.js');
}

function getAttachNodeConfig(port) {
  return { port };
}

function listenToRemoteDebugCommands() {
  const connections = (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).ServerConnection.observeRemoteConnections().map(conns => new Set(conns)).let((0, (_observable || _load_observable()).diffSets)()).flatMap(diff => _rxjsBundlesRxMinJs.Observable.from(diff.added)).startWith(null);

  const remoteDebuggerServices = connections.map(conn => {
    const rootUri = rootUriOfConnection(conn);
    const service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getRemoteDebuggerCommandServiceByNuclideUri)(rootUri);

    return { service, rootUri };
  });

  const delayStartupObservable = _rxjsBundlesRxMinJs.Observable.interval(REMOTE_DEBUG_SERVICES_DELAYED_STARTUP_MS).first().ignoreElements();

  return new (_UniversalDisposable || _load_UniversalDisposable()).default(delayStartupObservable.switchMap(() => {
    return remoteDebuggerServices.flatMap(({ service, rootUri }) => {
      return service.observeAttachDebugTargets().refCount().map(targets => findDuplicateAttachTargetIds(targets));
    });
  }).subscribe(duplicateTargetIds => notifyDuplicateDebugTargets(duplicateTargetIds)), delayStartupObservable.concat(remoteDebuggerServices).flatMap(({ service, rootUri }) => {
    return service.observeRemoteDebugCommands().refCount().catch(error => {
      if (!(0, (_systemInfo || _load_systemInfo()).isRunningInTest)()) {
        (0, (_log4js || _load_log4js()).getLogger)().error('Failed to listen to remote debug commands - ' + 'You could be running locally with two Atom windows. ' + `IsLocal: ${String(rootUri === '')}`);
      }
      return _rxjsBundlesRxMinJs.Observable.empty();
    }).map(command => ({ rootUri, command }));
  }).let((0, (_observable || _load_observable()).fastDebounce)(500)).subscribe((() => {
    var _ref12 = (0, _asyncToGenerator.default)(function* ({ rootUri, command }) {
      const attachProcessInfo = yield getPythonAttachTargetProcessInfo(rootUri, command.target);
      const debuggerService = yield getDebuggerService();
      const instance = debuggerService.getDebuggerInstance();
      if (instance == null) {
        (0, (_nuclideAnalytics || _load_nuclideAnalytics()).track)('fb-python-debugger-auto-attach');
        debuggerService.startDebugging(attachProcessInfo);
        return;
      } else if (instance.getProviderName() !== (_VspProcessInfo2 || _load_VspProcessInfo2()).VSP_DEBUGGER_SERVICE_NAME) {
        notifyOpenDebugSession();
        return;
      }
      const vspInfo = instance.getDebuggerProcessInfo();
      if (vspInfo.getDebugMode() !== 'attach' || vspInfo.getAdapterType() !== (_constants || _load_constants()).VsAdapterTypes.PYTHON || vspInfo.getConfig().port !== command.target.port) {
        notifyOpenDebugSession();
      }
      // Otherwise, we're already debugging that target.
    });

    return function (_x27) {
      return _ref12.apply(this, arguments);
    };
  })()));
}

let shouldNotifyDuplicateTargets = true;
let duplicateTargetsNotification;

function notifyDuplicateDebugTargets(duplicateTargetIds) {
  if (duplicateTargetIds.size > 0 && shouldNotifyDuplicateTargets && duplicateTargetsNotification == null) {
    const formattedIds = Array.from(duplicateTargetIds).join(', ');
    duplicateTargetsNotification = atom.notifications.addInfo(`Debugger: duplicate attach targets: \`${formattedIds}\``, {
      buttons: [{
        onDidClick: () => {
          shouldNotifyDuplicateTargets = false;
          if (duplicateTargetsNotification != null) {
            duplicateTargetsNotification.dismiss();
          }
        },
        text: 'Ignore'
      }],
      description: `Nuclide debugger detected duplicate attach targets with ids (${formattedIds}) ` + 'That could be instagram running multiple processes - check out https://our.intern.facebook.com/intern/dex/instagram-server/debugging-with-nuclide/',
      dismissable: true
    });
    duplicateTargetsNotification.onDidDismiss(() => {
      duplicateTargetsNotification = null;
    });
  }
}

function findDuplicateAttachTargetIds(targets) {
  const targetIds = new Set();
  const duplicateTargetIds = new Set();
  targets.forEach(target => {
    const { id } = target;
    if (id == null) {
      return;
    }
    if (targetIds.has(id)) {
      duplicateTargetIds.add(id);
    } else {
      targetIds.add(id);
    }
  });
  return duplicateTargetIds;
}
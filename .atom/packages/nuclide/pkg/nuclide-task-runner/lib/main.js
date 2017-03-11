'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _syncAtomCommands;

function _load_syncAtomCommands() {
  return _syncAtomCommands = _interopRequireDefault(require('../../commons-atom/sync-atom-commands'));
}

var _createPackage;

function _load_createPackage() {
  return _createPackage = _interopRequireDefault(require('../../commons-atom/createPackage'));
}

var _LocalStorageJsonTable;

function _load_LocalStorageJsonTable() {
  return _LocalStorageJsonTable = require('../../commons-atom/LocalStorageJsonTable');
}

var _PanelRenderer;

function _load_PanelRenderer() {
  return _PanelRenderer = _interopRequireDefault(require('../../commons-atom/PanelRenderer'));
}

var _collection;

function _load_collection() {
  return _collection = require('../../commons-node/collection');
}

var _event;

function _load_event() {
  return _event = require('../../commons-node/event');
}

var _reduxObservable;

function _load_reduxObservable() {
  return _reduxObservable = require('../../commons-node/redux-observable');
}

var _UniversalDisposable;

function _load_UniversalDisposable() {
  return _UniversalDisposable = _interopRequireDefault(require('../../commons-node/UniversalDisposable'));
}

var _nuclideAnalytics;

function _load_nuclideAnalytics() {
  return _nuclideAnalytics = require('../../nuclide-analytics');
}

var _createEmptyAppState;

function _load_createEmptyAppState() {
  return _createEmptyAppState = require('./createEmptyAppState');
}

var _Actions;

function _load_Actions() {
  return _Actions = _interopRequireWildcard(require('./redux/Actions'));
}

var _Epics;

function _load_Epics() {
  return _Epics = _interopRequireWildcard(require('./redux/Epics'));
}

var _Reducers;

function _load_Reducers() {
  return _Reducers = _interopRequireWildcard(require('./redux/Reducers'));
}

var _createPanelItem;

function _load_createPanelItem() {
  return _createPanelItem = require('./ui/createPanelItem');
}

var _atom = require('atom');

var _nullthrows;

function _load_nullthrows() {
  return _nullthrows = _interopRequireDefault(require('nullthrows'));
}

var _redux;

function _load_redux() {
  return _redux = require('redux');
}

var _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');

var _shallowequal;

function _load_shallowequal() {
  return _shallowequal = _interopRequireDefault(require('shallowequal'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: use a more general versioning mechanism.
// Perhaps Atom should provide packages with some way of doing this.
const SERIALIZED_VERSION = 2; /**
                               * Copyright (c) 2015-present, Facebook, Inc.
                               * All rights reserved.
                               *
                               * This source code is licensed under the license found in the LICENSE file in
                               * the root directory of this source tree.
                               *
                               * 
                               */

class Activation {

  constructor(rawState) {
    let serializedState = rawState;
    if (serializedState == null || serializedState.version !== SERIALIZED_VERSION) {
      serializedState = {};
    }

    // The serialized state that Atom gives us here is based on the open roots. However, users often
    // open an empty window and then add a root (especially with remote projects). We need to go
    // outside of Atom's normal serialization mechanism to account for this.
    const visibilityTable = new (_LocalStorageJsonTable || _load_LocalStorageJsonTable()).LocalStorageJsonTable('nuclide:nuclide-task-runner:visibility');

    // If the task runner toolbar was shown previously, we'll display a placholder until the view
    // initializes so there's not a jump in the UI. Unfortunately, since we haven't yet been
    // connected to the current working directory service at this point, we don't know what root to
    // check the previous visibility of. We could just assume it's
    // `atom.project.getDirectories()[0]`, but using explicitly serialized package state is better.
    const { previousSessionVisible } = serializedState;
    let showPlaceholderInitially;
    if (typeof previousSessionVisible === 'boolean') {
      showPlaceholderInitially = previousSessionVisible;
    } else {
      // This collection of roots wasn't seen before. Just fall back to the state of the last known
      // session.
      const entries = visibilityTable.getEntries();
      const previousEntry = entries[entries.length - 1];
      showPlaceholderInitially = previousEntry && previousEntry.value;
    }

    const initialState = Object.assign({}, (0, (_createEmptyAppState || _load_createEmptyAppState()).createEmptyAppState)(), serializedState, {
      showPlaceholderInitially,
      visible: showPlaceholderInitially
    });

    const epics = Object.keys(_Epics || _load_Epics()).map(k => (_Epics || _load_Epics())[k]).filter(epic => typeof epic === 'function');
    const epicOptions = {
      visibilityTable,
      states: new _rxjsBundlesRxMinJs.ReplaySubject(1)
    };
    const rootEpic = (actions, store) => (0, (_reduxObservable || _load_reduxObservable()).combineEpics)(...epics)(actions, store, epicOptions);
    this._store = (0, (_redux || _load_redux()).createStore)((_Reducers || _load_Reducers()).app, initialState, (0, (_redux || _load_redux()).applyMiddleware)((0, (_reduxObservable || _load_reduxObservable()).createEpicMiddleware)(rootEpic), trackingMiddleware));
    const states = _rxjsBundlesRxMinJs.Observable.from(this._store).filter(state => state != null);
    this._actionCreators = (0, (_redux || _load_redux()).bindActionCreators)(_Actions || _load_Actions(), this._store.dispatch);
    this._panelRenderer = new (_PanelRenderer || _load_PanelRenderer()).default({
      location: 'top',
      createItem: () => (0, (_createPanelItem || _load_createPanelItem()).createPanelItem)(this._store)
    });

    this._disposables = new (_UniversalDisposable || _load_UniversalDisposable()).default(visibilityTable,

    // We pass a stream of states to the epics expicitly. This is less than ideal. See
    // redux-observable/redux-observable#56
    // $FlowFixMe: Teach flow about Symbol.observable
    _rxjsBundlesRxMinJs.Observable.from(this._store).subscribe(epicOptions.states), activateInitialPackagesObservable().subscribe(() => {
      this._store.dispatch((_Actions || _load_Actions()).didActivateInitialPackages());
    }),

    // Whenever the visiblity changes, store the value in localStorage so that we can use it
    // to decide whether we should show the placeholder at the beginning of the next session.
    states.filter(state => state.viewIsInitialized && state.projectRoot).map(state => ({
      visible: state.visible,
      projectRootPath: state.projectRoot && state.projectRoot.getPath()
    })).distinctUntilChanged((_shallowequal || _load_shallowequal()).default).subscribe(({ projectRootPath, visible }) => {
      visibilityTable.setItem(projectRootPath, visible);
    }), this._panelRenderer, atom.commands.add('atom-workspace', {
      'nuclide-task-runner:toggle-toolbar-visibility': event => {
        const visible = event.detail != null && typeof event.detail === 'object' ? event.detail.visible : undefined;
        if (typeof visible === 'boolean') {
          this._actionCreators.setToolbarVisibility(visible);
        } else {
          this._actionCreators.toggleToolbarVisibility();
        }
      },
      'nuclide-task-runner:run-selected-task': event => {
        const detail = event != null ? event.detail : null;
        const taskId = detail != null && detail.taskRunnerId && detail.type ? detail : null;
        this._actionCreators.runTask(taskId);
      }
    }),

    // Add a command for each task type. If there's more than one of the same type runnable, the
    // first is used.
    // TODO: Instead, prompt user for which to use and remember their choice.
    (0, (_syncAtomCommands || _load_syncAtomCommands()).default)(states.debounceTime(500).map(state => state.taskLists).distinctUntilChanged().map(taskLists => {
      const allTasks = Array.prototype.concat(...Array.from(taskLists.values()));
      const types = allTasks.filter(taskMeta => taskMeta.runnable).map(taskMeta => taskMeta.type);
      return new Set(types);
    }), taskType => ({
      'atom-workspace': {
        [`nuclide-task-runner:${ taskType }`]: () => {
          const state = this._store.getState();
          const { activeTaskId, taskRunners } = state;
          const taskRunnerIds = Array.from(taskRunners.keys());
          // Give precedence to the task runner of the selected task.
          if (activeTaskId != null) {
            (0, (_collection || _load_collection()).arrayRemove)(taskRunnerIds, activeTaskId.taskRunnerId);
            taskRunnerIds.unshift(activeTaskId.taskRunnerId);
          }
          for (const taskRunnerId of taskRunnerIds) {
            const taskList = state.taskLists.get(taskRunnerId);
            if (taskList == null) {
              continue;
            }
            for (const taskMeta of taskList) {
              if (taskMeta.runnable && taskMeta.type === taskType) {
                this._actionCreators.runTask(taskMeta);
                return;
              }
            }
          }
        }
      }
    })),

    // Add a command for each individual task ID.
    (0, (_syncAtomCommands || _load_syncAtomCommands()).default)(states.debounceTime(500).map(state => state.taskLists).distinctUntilChanged().map(taskLists => {
      const state = this._store.getState();
      const taskIds = new Set();
      for (const [taskRunnerId, taskList] of taskLists) {
        const taskRunnerName = (0, (_nullthrows || _load_nullthrows()).default)(state.taskRunners.get(taskRunnerId)).name;
        for (const taskMeta of taskList) {
          taskIds.add({ taskRunnerId, taskRunnerName, type: taskMeta.type });
        }
      }
      return taskIds;
    }), taskId => ({
      'atom-workspace': {
        [`nuclide-task-runner:${ taskId.taskRunnerName }-${ taskId.type }`]: () => {
          this._actionCreators.runTask(taskId);
        }
      }
    })),

    // Add a toggle command for each task runner.
    (0, (_syncAtomCommands || _load_syncAtomCommands()).default)(states.debounceTime(500).map(state => state.taskRunners).distinctUntilChanged().map(taskRunners => new Set(taskRunners.values())), taskRunner => ({
      'atom-workspace': {
        [`nuclide-task-runner:toggle-${ taskRunner.name }-toolbar`]: () => {
          this._actionCreators.toggleToolbarVisibility(taskRunner.id);
        }
      }
    }), taskRunner => taskRunner.id), states.map(state => state.visible).distinctUntilChanged().subscribe(visible => {
      this._panelRenderer.render({ visible });
    }));
  }

  dispose() {
    this._disposables.dispose();
  }

  consumeCurrentWorkingDirectory(api) {
    this._disposables.add(api.observeCwd(directory => {
      this._actionCreators.setProjectRoot(directory);
    }));
  }

  consumeToolBar(getToolBar) {
    const toolBar = getToolBar('nuclide-task-runner');
    toolBar.addSpacer({
      priority: 400
    });
    const { element } = toolBar.addButton({
      callback: 'nuclide-task-runner:toggle-toolbar-visibility',
      tooltip: 'Toggle Task Runner Toolbar',
      iconset: 'ion',
      icon: 'play',
      priority: 401
    });
    element.className += ' nuclide-task-runner-tool-bar-button';

    const buttonUpdatesDisposable = new (_UniversalDisposable || _load_UniversalDisposable()).default(
    // $FlowFixMe: Update rx defs to accept ish with Symbol.observable
    _rxjsBundlesRxMinJs.Observable.from(this._store).subscribe(state => {
      if (state.taskRunners.size > 0) {
        element.removeAttribute('hidden');
      } else {
        element.setAttribute('hidden', 'hidden');
      }
    }));

    // Remove the button from the toolbar.
    const buttonPresenceDisposable = new _atom.Disposable(() => {
      toolBar.removeItems();
    });

    // If this package is disabled, stop updating the button and remove it from the toolbar.
    this._disposables.add(buttonUpdatesDisposable, buttonPresenceDisposable);

    // If tool-bar is disabled, stop updating the button state and remove tool-bar related cleanup
    // from this package's disposal actions.
    return new _atom.Disposable(() => {
      buttonUpdatesDisposable.dispose();
      this._disposables.remove(buttonUpdatesDisposable);
      this._disposables.remove(buttonPresenceDisposable);
    });
  }

  provideTaskRunnerServiceApi() {
    let pkg = this;
    this._disposables.add(() => {
      pkg = null;
    });
    return {
      register: taskRunner => {
        if (!(pkg != null)) {
          throw new Error('Task runner service API used after deactivation');
        }

        pkg._actionCreators.registerTaskRunner(taskRunner);
        return new _atom.Disposable(() => {
          if (pkg != null) {
            pkg._actionCreators.unregisterTaskRunner(taskRunner);
          }
        });
      }
    };
  }

  serialize() {
    const state = this._store.getState();
    return {
      previousSessionActiveTaskId: state.activeTaskId || state.previousSessionActiveTaskId,
      previousSessionActiveTaskRunnerId: state.activeTaskRunnerId || state.previousSessionActiveTaskRunnerId,
      previousSessionVisible: state.visible,
      version: SERIALIZED_VERSION
    };
  }

  getDistractionFreeModeProvider() {
    let pkg = this;
    this._disposables.add(() => {
      pkg = null;
    });
    return {
      name: 'nuclide-task-runner',
      isVisible() {
        if (!(pkg != null)) {
          throw new Error('Invariant violation: "pkg != null"');
        }

        return pkg._store.getState().visible;
      },
      toggle() {
        if (!(pkg != null)) {
          throw new Error('Invariant violation: "pkg != null"');
        }

        pkg._actionCreators.toggleToolbarVisibility();
      }
    };
  }

  // Exported for testing :'(
  _getCommands() {
    return this._actionCreators;
  }
}

exports.default = (0, (_createPackage || _load_createPackage()).default)(Activation);


function activateInitialPackagesObservable() {
  if (atom.packages.hasActivatedInitialPackages) {
    return _rxjsBundlesRxMinJs.Observable.of(undefined);
  }
  return (0, (_event || _load_event()).observableFromSubscribeFunction)(atom.packages.onDidActivateInitialPackages.bind(atom.packages));
}

function trackTaskAction(type, action, state) {
  const task = action.payload.task;
  const taskTrackingData = task != null && typeof task.getTrackingData === 'function' ? task.getTrackingData() : {};
  const error = action.type === (_Actions || _load_Actions()).TASK_ERRORED ? action.payload.error : null;
  const { activeTaskId } = state;
  (0, (_nuclideAnalytics || _load_nuclideAnalytics()).trackEvent)({
    type,
    data: Object.assign({}, taskTrackingData, {
      taskRunnerId: activeTaskId && activeTaskId.taskRunnerId,
      taskType: activeTaskId && activeTaskId.type,
      errorMessage: error != null ? error.message : null,
      stackTrace: error != null ? String(error.stack) : null
    })
  });
}

const trackingMiddleware = store => next => action => {
  switch (action.type) {
    case (_Actions || _load_Actions()).TASK_STARTED:
      trackTaskAction('nuclide-task-runner:task-started', action, store.getState());
      break;
    case (_Actions || _load_Actions()).TASK_STOPPED:
      trackTaskAction('nuclide-task-runner:task-stopped', action, store.getState());
      break;
    case (_Actions || _load_Actions()).TASK_COMPLETED:
      trackTaskAction('nuclide-task-runner:task-completed', action, store.getState());
      break;
    case (_Actions || _load_Actions()).TASK_ERRORED:
      trackTaskAction('nuclide-task-runner:task-errored', action, store.getState());
      break;
  }
  return next(action);
};
module.exports = exports['default'];
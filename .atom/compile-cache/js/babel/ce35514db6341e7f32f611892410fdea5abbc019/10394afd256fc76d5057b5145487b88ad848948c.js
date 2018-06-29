Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

//  weak

var _atom = require('atom');

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _reactForAtom = require('react-for-atom');

var _componentsComposePanel = require('./components/ComposePanel');

var _componentsComposePanel2 = _interopRequireDefault(_componentsComposePanel);

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reduxStore = require('./redux/store');

var _reduxStore2 = _interopRequireDefault(_reduxStore);

var _reduxActionsLog = require('./redux/actions/log');

var _reduxActionsServices = require('./redux/actions/services');

var _componentsRemoteInfosPrompt = require('./components/RemoteInfosPrompt');

var _componentsRemoteInfosPrompt2 = _interopRequireDefault(_componentsRemoteInfosPrompt);

var _immutable = require('immutable');

'use babel';exports['default'] = {

  dockerView: null,
  bottomPanel: null,
  subscriptions: null,
  config: {
    supressNotifications: {
      title: 'Supress notifications',
      description: 'This supresses "verbose" notifications when commands are successfully executed',
      type: 'boolean',
      'default': false
    }
  },

  activate: function activate(state) {
    var _this = this;

    this.dockerView = document.createElement('div');
    this.dockerView.classList.add("docker");
    this.bottomPanel = atom.workspace.addBottomPanel({
      item: this.dockerView,
      visible: false
    });
    this.modalView = document.createElement('div');
    this.modalView.classList.add("docker");
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.modalView,
      visible: false
    });

    _reactForAtom.ReactDOM.render(_reactForAtom.React.createElement(
      'div',
      null,
      'Select a compose file with docker:select-compose-file'
    ), this.dockerView);
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new _atom.CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'docker:toggle': function dockerToggle() {
        return _this.toggle();
      },
      'docker:select-compose-file': function dockerSelectComposeFile() {
        return _this.selectComposeFile().then(function () {});
      },
      'docker:add-compose-file': function dockerAddComposeFile() {
        return _this.selectComposeFile(true).then(function () {});
      }
    }));
  },

  deactivate: function deactivate() {
    this.bottomPanel.destroy();
    this.modalPanel.destroy();
    this.subscriptions.dispose();
  },

  serialize: function serialize() {
    return {};
  },

  pushSuccessVerboseNotification: function pushSuccessVerboseNotification() {
    var _atom$notifications;

    if (atom.config.get('docker.supressNotifications')) {
      return;
    }
    (_atom$notifications = atom.notifications).addSuccess.apply(_atom$notifications, arguments);
  },

  selectComposeFile: function selectComposeFile(adding) {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
      var grammarName = atom.workspace.getActiveTextEditor().getGrammar().name;

      if (grammarName != "YAML") {
        atom.notifications.addWarning("Selected file is not a docker-compose file");
      } else {
        (function () {
          var composeFile = atom.workspace.getActivePaneItem().buffer.file;
          var composeFilePath = composeFile.getPath();
          console.log('selected compose file : ' + composeFilePath);

          composeFile.read().then(function (content) {
            try {
              var yamlContent = _jsYaml2['default'].safeLoad(content);
              console.log(yamlContent);
              var services = undefined;
              var version = yamlContent.version;

              switch (version) {
                case '1':
                  services = Object.keys(yamlContent).map(function (key) {
                    return { name: key };
                  });
                  break;
                case '2':
                case '3':
                  services = Object.keys(yamlContent.services).map(function (key) {
                    return {
                      name: key,
                      container_name: yamlContent.services[key].container_name ? yamlContent.services[key].container_name : undefined,
                      tag: yamlContent.services[key].image && yamlContent.services[key].build ? yamlContent.services[key].image : undefined
                    };
                  });
                  break;
                default:
              }

              _reduxStore2['default'].dispatch(adding ? (0, _reduxActionsServices.createComposeFileAddedAction)(composeFilePath, services, version) : (0, _reduxActionsServices.createComposeFileSelectedAction)(composeFilePath, services, version));

              _this2.renderServiceList();
              _this2.execPS();

              if (_this2.bottomPanel.isVisible() == false) _this2.bottomPanel.show();
              resolve();
            } catch (e) {
              console.log(e);

              atom.notifications.addError("Impossible to select compose file", {
                detail: e.toString()
              });
              resolve(e);
            }
          });
        })();
      }
    });
  },

  getCommandArgs: function getCommandArgs(filePaths, action, serviceNames) {
    return [].concat(_toConsumableArray((0, _immutable.fromJS)(filePaths).map(function (filePath) {
      return ['-f', filePath];
    }).reduce(function (reduction, value) {
      return reduction.concat(value);
    }, (0, _immutable.fromJS)([])).toJS()), [action, action == "up" ? "-d" : "", action == "rm" ? "-f" : ""], _toConsumableArray(serviceNames)).filter(function (arg) {
      return arg != "";
    });
  },

  execComposeCommand: function execComposeCommand(action, serviceNames, withExec) {
    var _this3 = this;

    withExec = withExec || false;
    serviceNames = serviceNames || [];
    var filePaths = _reduxStore2['default'].getState().compose.map(function (conf) {
      return conf.filePath;
    });

    return new Promise(function (resolve, reject) {
      if (withExec) {
        (0, _child_process.exec)('docker-compose '.concat(_this3.getCommandArgs(filePaths, action, serviceNames).join(' ')), {
          cwd: _path2['default'].dirname(filePaths[0])
        }, function (error, stdout, stderr) {
          if (error) reject(stderr);else resolve(stdout);
        });
      } else {
        var child = (0, _child_process.spawn)('docker-compose', _this3.getCommandArgs(filePaths, action, serviceNames), { cwd: _path2['default'].dirname(filePaths[0]) });
        var dataHandler = function dataHandler(data) {
          var str = data.toString();
          _reduxStore2['default'].dispatch((0, _reduxActionsLog.createLogReceivedAction)(str));
          if (str.indexOf('exited with code') != -1) _this3.execPS();
        };

        child.stdout.on('data', dataHandler);
        child.stderr.on('data', dataHandler);
        child.on('exit', function (code) {
          if (code == 0) resolve();else reject();
        });
      }
    });
  },

  execPS: function execPS() {
    var _this4 = this;

    this.execComposeCommand('ps', [], true).then(function (stdout) {
      return _this4.handlePSOutput(stdout);
    })['catch'](function () {});
  },

  handlePSOutput: function handlePSOutput(output) {
    var lines = output.split('\n').slice(2);
    var services = (0, _immutable.fromJS)(_reduxStore2['default'].getState().compose).map(function (config) {
      return config.get('services');
    }).reduce(function (reduction, value) {
      return reduction.concat(value);
    }, (0, _immutable.fromJS)([])).toJS();

    var refreshedServices = services.map(function (service) {
      var n = service.container_name || service.name;

      var line = lines.find(function (line) {
        return line.split(' ')[0].indexOf(n) != -1;
      });

      return {
        name: n,
        up: line && line.indexOf(' Up ') != -1 ? 'up' : 'down'
      };
    });

    console.log(refreshedServices);
    _reduxStore2['default'].dispatch((0, _reduxActionsServices.createServiceStateChangedAction)(refreshedServices));
    this.renderServiceList();
  },

  pushImage: function pushImage(tag, remoteTag) {
    (0, _child_process.exec)('docker tag ' + tag + ' ' + remoteTag, {}, function (err, stdout, stderr) {
      if (err) {
        atom.notifications.addError('Impossible to tag ' + tag + ' with ' + remoteTag, { dismissable: true, detail: stderr });
        return;
      } else {
        atom.notifications.addSuccess('Tagged ' + tag + ' with ' + remoteTag + ' successfully, pushing ...');
        (0, _child_process.exec)('docker push ' + remoteTag, {}, function (error, pushStdout, pushStderr) {
          if (error) {
            atom.notifications.addError('Impossible to push ' + remoteTag, { dismissable: true, detail: pushStderr });
          } else {
            atom.notifications.addSuccess('Pushed ' + remoteTag + ' successfully');
          }
        });
      }
    });
  },

  onPush: function onPush(serviceNames) {
    var _this5 = this;

    var tag = (0, _immutable.fromJS)(_reduxStore2['default'].getState().compose).map(function (conf) {
      return conf.services;
    }).reduce(function (reduction, value) {
      return reduction.concat(value);
    }, (0, _immutable.fromJS)([])).find(function (service) {
      return service.get('name') == serviceNames[0];
    }).get('tag');
    var prompt = _reactForAtom.ReactDOM.render(_reactForAtom.React.createElement(_componentsRemoteInfosPrompt2['default'], null), this.modalView);

    this.modalView.onkeydown = function (e) {
      var ctrlDown = e.ctrlKey || e.metaKey;
      if (e.which == 27) {
        // esc
        _this5.modalPanel.hide();
      } else if (e.which == 13) {
        //enter
        if (prompt.text.value.length > 0) {
          _this5.modalPanel.hide();
          var newTag = prompt.text.value;
          atom.notifications.addSuccess(tag + ' => ' + newTag);
          _this5.pushImage(tag, newTag);
        }
      }
    };

    this.modalPanel.show();
    prompt.text.focus();
  },

  onComposeAction: function onComposeAction(action, serviceNames) {
    var _this6 = this;

    _reduxStore2['default'].dispatch((0, _reduxActionsLog.createLogReceivedAction)('[Atom] ' + action + '...'));
    if (action == "push") {
      this.onPush(serviceNames);
    } else {
      this.execComposeCommand(action, serviceNames, action == "ps").then(function (stdout) {
        _this6.pushSuccessVerboseNotification(action + ' ' + (serviceNames && serviceNames.length > 0 ? serviceNames.join(' ') : ""), {});

        if (action == "ps") {
          _this6.handlePSOutput(stdout);
        }

        if (action == "up" || action == "restart") {
          _this6.composePanel.composeLogs.serviceLaunched();
        }

        if (action == "up" || action == "restart" || action == "stop") {
          _this6.execPS();
        }
      })['catch'](function (stderr) {
        atom.notifications.addError(action + ' ' + (serviceNames && serviceNames.length > 0 ? serviceNames.join(' ') : ""), {
          dismissable: false,
          detail: stderr
        });
      });
    }
  },

  renderServiceList: function renderServiceList() {
    this.composePanel = _reactForAtom.ReactDOM.render(_reactForAtom.React.createElement(_componentsComposePanel2['default'], {
      onAction: this.onComposeAction.bind(this),
      composeFilePaths: _reduxStore2['default'].getState().compose.map(function (conf) {
        return conf.filePath;
      })
    }), this.dockerView);
  },

  toggle: function toggle() {
    return this.bottomPanel.isVisible() ? this.bottomPanel.hide() : this.bottomPanel.show();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvZG9ja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBSW9DLE1BQU07O3NCQUN6QixTQUFTOzs7OzRCQUNJLGdCQUFnQjs7c0NBQ3JCLDJCQUEyQjs7Ozs2QkFDMUIsZUFBZTs7b0JBQ3hCLE1BQU07Ozs7MEJBQ0wsZUFBZTs7OzsrQkFDSyxxQkFBcUI7O29DQUNrRCwwQkFBMEI7OzJDQUN6RyxnQ0FBZ0M7Ozs7eUJBQ3pDLFdBQVc7O0FBZGhDLFdBQVcsQ0FBQSxxQkFnQkk7O0FBRWIsWUFBVSxFQUFFLElBQUk7QUFDaEIsYUFBVyxFQUFFLElBQUk7QUFDakIsZUFBYSxFQUFFLElBQUk7QUFDbkIsUUFBTSxFQUFFO0FBQ04sd0JBQW9CLEVBQUU7QUFDcEIsV0FBSyxFQUFFLHVCQUF1QjtBQUM5QixpQkFBVyxFQUFFLGdGQUFnRjtBQUM3RixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7S0FDZjtHQUNGOztBQUVELFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7OztBQUNkLFFBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxRQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztBQUMvQyxVQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVU7QUFDckIsYUFBTyxFQUFFLEtBQUs7S0FDZixDQUFDLENBQUM7QUFDSCxRQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUks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LEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBLEVBQUk7QUFDaEgscUJBQVcsRUFBRSxLQUFLO0FBQ2xCLGdCQUFNLEVBQUUsTUFBTTtTQUNmLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKO0dBQ0Y7O0FBRUQsbUJBQWlCLEVBQUUsNkJBQVc7QUFDNUIsUUFBSSxDQUFDLFlBQVksR0FBRyx1QkFBUyxNQUFNLENBQ2pDO0FBQ0UsY0FBUSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDO0FBQzFDLHNCQUFnQixFQUFFLHdCQUFNLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJO2VBQUksSUFBSSxDQUFDLFFBQVE7T0FBQSxDQUFDLEFBQUM7TUFDdEUsRUFDRixJQUFJLENBQUMsVUFBVSxDQUNoQixDQUFDO0dBQ0g7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO0FBQ1AsV0FDRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxHQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxHQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUN2QjtHQUNIO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL21pbmdiby9jb25maWcvLmF0b20vcGFja2FnZXMvZG9ja2VyL2xpYi9kb2NrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLy8gQGZsb3cgd2Vha1xuXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCB5YW1sIGZyb20gJ2pzLXlhbWwnO1xuaW1wb3J0IHtSZWFjdCwgUmVhY3RET019IGZyb20gJ3JlYWN0LWZvci1hdG9tJztcbmltcG9ydCBDb21wb3NlUGFuZWwgZnJvbSAnLi9jb21wb25lbnRzL0NvbXBvc2VQYW5lbCc7XG5pbXBvcnQge2V4ZWMsIHNwYXdufSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHN0b3JlIGZyb20gJy4vcmVkdXgvc3RvcmUnO1xuaW1wb3J0IHtjcmVhdGVMb2dSZWNlaXZlZEFjdGlvbn0gZnJvbSAnLi9yZWR1eC9hY3Rpb25zL2xvZyc7XG5pbXBvcnQge2NyZWF0ZUNvbXBvc2VGaWxlU2VsZWN0ZWRBY3Rpb24sIGNyZWF0ZUNvbXBvc2VGaWxlQWRkZWRBY3Rpb24sIGNyZWF0ZVNlcnZpY2VTdGF0ZUNoYW5nZWRBY3Rpb259IGZyb20gJy4vcmVkdXgvYWN0aW9ucy9zZXJ2aWNlcyc7XG5pbXBvcnQgUmVtb3RlSW5mb3NQcm9tcHQgZnJvbSAnLi9jb21wb25lbnRzL1JlbW90ZUluZm9zUHJvbXB0JztcbmltcG9ydCB7ZnJvbUpTfSBmcm9tICdpbW11dGFibGUnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgZG9ja2VyVmlldzogbnVsbCxcbiAgYm90dG9tUGFuZWw6IG51bGwsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG4gIGNvbmZpZzoge1xuICAgIHN1cHJlc3NOb3RpZmljYXRpb25zOiB7XG4gICAgICB0aXRsZTogJ1N1cHJlc3Mgbm90aWZpY2F0aW9ucycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgc3VwcmVzc2VzIFwidmVyYm9zZVwiIG5vdGlmaWNhdGlvbnMgd2hlbiBjb21tYW5kcyBhcmUgc3VjY2Vzc2Z1bGx5IGV4ZWN1dGVkJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfVxuICB9LFxuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5kb2NrZXJWaWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5kb2NrZXJWaWV3LmNsYXNzTGlzdC5hZGQoXCJkb2NrZXJcIik7XG4gICAgdGhpcy5ib3R0b21QYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtcbiAgICAgIGl0ZW06IHRoaXMuZG9ja2VyVmlldyxcbiAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgfSk7XG4gICAgdGhpcy5tb2RhbFZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLm1vZGFsVmlldy5jbGFzc0xpc3QuYWRkKFwiZG9ja2VyXCIpO1xuICAgIHRoaXMubW9kYWxQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe1xuICAgICAgaXRlbTogdGhpcy5tb2RhbFZpZXcsXG4gICAgICB2aXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgUmVhY3RET00ucmVuZGVyKDxkaXY+U2VsZWN0IGEgY29tcG9zZSBmaWxlIHdpdGggZG9ja2VyOnNlbGVjdC1jb21wb3NlLWZpbGU8L2Rpdj4sIHRoaXMuZG9ja2VyVmlldyk7XG4gICAgLy8gRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgLy8gUmVnaXN0ZXIgY29tbWFuZCB0aGF0IHRvZ2dsZXMgdGhpcyB2aWV3XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnZG9ja2VyOnRvZ2dsZSc6ICgpID0+IHRoaXMudG9nZ2xlKCksXG4gICAgICAnZG9ja2VyOnNlbGVjdC1jb21wb3NlLWZpbGUnOiAoKSA9PiB0aGlzLnNlbGVjdENvbXBvc2VGaWxlKCkudGhlbihmdW5jdGlvbigpIHtcblxuICAgICAgfSksXG4gICAgICAnZG9ja2VyOmFkZC1jb21wb3NlLWZpbGUnOiAoKSA9PiB0aGlzLnNlbGVjdENvbXBvc2VGaWxlKHRydWUpLnRoZW4oZnVuY3Rpb24oKSB7XG5cbiAgICAgIH0pLFxuICAgIH0pKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuYm90dG9tUGFuZWwuZGVzdHJveSgpO1xuICAgIHRoaXMubW9kYWxQYW5lbC5kZXN0cm95KCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICB9O1xuICB9LFxuXG4gIHB1c2hTdWNjZXNzVmVyYm9zZU5vdGlmaWNhdGlvbiguLi5hcmdzKSB7XG4gICAgaWYoYXRvbS5jb25maWcuZ2V0KCdkb2NrZXIuc3VwcmVzc05vdGlmaWNhdGlvbnMnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyguLi5hcmdzKTtcbiAgfSxcblxuICBzZWxlY3RDb21wb3NlRmlsZShhZGRpbmcpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IGdyYW1tYXJOYW1lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldEdyYW1tYXIoKS5uYW1lO1xuXG4gICAgICBpZiAoZ3JhbW1hck5hbWUgIT0gXCJZQU1MXCIpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJTZWxlY3RlZCBmaWxlIGlzIG5vdCBhIGRvY2tlci1jb21wb3NlIGZpbGVcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY29tcG9zZUZpbGUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpLmJ1ZmZlci5maWxlO1xuICAgICAgICBsZXQgY29tcG9zZUZpbGVQYXRoID0gY29tcG9zZUZpbGUuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhgc2VsZWN0ZWQgY29tcG9zZSBmaWxlIDogJHtjb21wb3NlRmlsZVBhdGh9YCk7XG5cbiAgICAgICAgY29tcG9zZUZpbGUucmVhZCgpLnRoZW4oKGNvbnRlbnQpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHlhbWxDb250ZW50ID0geWFtbC5zYWZlTG9hZChjb250ZW50KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHlhbWxDb250ZW50KTtcbiAgICAgICAgICAgIGxldCBzZXJ2aWNlcztcbiAgICAgICAgICAgIGxldCB2ZXJzaW9uID0geWFtbENvbnRlbnQudmVyc2lvbjtcblxuICAgICAgICAgICAgc3dpdGNoICh2ZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnMSc6XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VzID0gT2JqZWN0LmtleXMoeWFtbENvbnRlbnQpLm1hcCgoa2V5KSA9PiB7cmV0dXJuIHtuYW1lOiBrZXl9fSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJzInOlxuICAgICAgICAgICAgICAgIGNhc2UgJzMnOlxuICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlcyA9IE9iamVjdC5rZXlzKHlhbWxDb250ZW50LnNlcnZpY2VzKS5tYXAoKGtleSkgPT4ge3JldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcl9uYW1lOiB5YW1sQ29udGVudC5zZXJ2aWNlc1trZXldLmNvbnRhaW5lcl9uYW1lID8geWFtbENvbnRlbnQuc2VydmljZXNba2V5XS5jb250YWluZXJfbmFtZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICB0YWc6IHlhbWxDb250ZW50LnNlcnZpY2VzW2tleV0uaW1hZ2UgJiYgeWFtbENvbnRlbnQuc2VydmljZXNba2V5XS5idWlsZCA/IHlhbWxDb250ZW50LnNlcnZpY2VzW2tleV0uaW1hZ2UgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChcbiAgICAgICAgICAgICAgYWRkaW5nXG4gICAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgICBjcmVhdGVDb21wb3NlRmlsZUFkZGVkQWN0aW9uKGNvbXBvc2VGaWxlUGF0aCwgc2VydmljZXMsIHZlcnNpb24pXG4gICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICBjcmVhdGVDb21wb3NlRmlsZVNlbGVjdGVkQWN0aW9uKGNvbXBvc2VGaWxlUGF0aCwgc2VydmljZXMsIHZlcnNpb24pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLnJlbmRlclNlcnZpY2VMaXN0KCk7XG4gICAgICAgICAgICB0aGlzLmV4ZWNQUygpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ib3R0b21QYW5lbC5pc1Zpc2libGUoKSA9PSBmYWxzZSlcbiAgICAgICAgICAgICAgdGhpcy5ib3R0b21QYW5lbC5zaG93KCk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG5cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIkltcG9zc2libGUgdG8gc2VsZWN0IGNvbXBvc2UgZmlsZVwiLCB7XG4gICAgICAgICAgICAgIGRldGFpbDogZS50b1N0cmluZygpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc29sdmUoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBnZXRDb21tYW5kQXJnczogZnVuY3Rpb24oZmlsZVBhdGhzLCBhY3Rpb24sIHNlcnZpY2VOYW1lcykge1xuICAgIHJldHVybiBbXG4gICAgICAuLi5mcm9tSlMoZmlsZVBhdGhzKS5tYXAoZmlsZVBhdGggPT4gWyctZicsIGZpbGVQYXRoXSkucmVkdWNlKChyZWR1Y3Rpb24sIHZhbHVlKSA9PiByZWR1Y3Rpb24uY29uY2F0KHZhbHVlKSwgZnJvbUpTKFtdKSkudG9KUygpLFxuICAgICAgYWN0aW9uLFxuICAgICAgYWN0aW9uID09IFwidXBcIiA/IFwiLWRcIiA6IFwiXCIsXG4gICAgICBhY3Rpb24gPT0gXCJybVwiID8gXCItZlwiIDogXCJcIixcbiAgICAgIC4uLnNlcnZpY2VOYW1lc1xuICAgIF0uZmlsdGVyKChhcmcpID0+IGFyZyAhPSBcIlwiKTtcbiAgfSxcblxuICBleGVjQ29tcG9zZUNvbW1hbmQ6IGZ1bmN0aW9uKGFjdGlvbiwgc2VydmljZU5hbWVzLCB3aXRoRXhlYykge1xuICAgIHdpdGhFeGVjID0gd2l0aEV4ZWMgfHzCoGZhbHNlO1xuICAgIHNlcnZpY2VOYW1lcyA9IHNlcnZpY2VOYW1lcyB8fCBbXTtcbiAgICBsZXQgZmlsZVBhdGhzID0gc3RvcmUuZ2V0U3RhdGUoKS5jb21wb3NlLm1hcChjb25mID0+IGNvbmYuZmlsZVBhdGgpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh3aXRoRXhlYykge1xuICAgICAgICBleGVjKCdkb2NrZXItY29tcG9zZSAnLmNvbmNhdCh0aGlzLmdldENvbW1hbmRBcmdzKGZpbGVQYXRocywgYWN0aW9uLCBzZXJ2aWNlTmFtZXMpLmpvaW4oJyAnKSksIHtcbiAgICAgICAgICBjd2Q6IHBhdGguZGlybmFtZShmaWxlUGF0aHNbMF0pXG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcilcbiAgICAgICAgICAgIHJlamVjdChzdGRlcnIpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc29sdmUoc3Rkb3V0KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY2hpbGQgPSBzcGF3bihcbiAgICAgICAgICAnZG9ja2VyLWNvbXBvc2UnLCB0aGlzLmdldENvbW1hbmRBcmdzKGZpbGVQYXRocywgYWN0aW9uLCBzZXJ2aWNlTmFtZXMpLFxuICAgICAgICAgIHtjd2Q6IHBhdGguZGlybmFtZShmaWxlUGF0aHNbMF0pfVxuICAgICAgICApO1xuICAgICAgICBsZXQgZGF0YUhhbmRsZXIgPSAoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBzdHIgPSBkYXRhLnRvU3RyaW5nKCk7XG4gICAgICAgICAgc3RvcmUuZGlzcGF0Y2goY3JlYXRlTG9nUmVjZWl2ZWRBY3Rpb24oc3RyKSk7XG4gICAgICAgICAgaWYgKHN0ci5pbmRleE9mKCdleGl0ZWQgd2l0aCBjb2RlJykgIT0gLTEpXG4gICAgICAgICAgICB0aGlzLmV4ZWNQUygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIGRhdGFIYW5kbGVyKTtcbiAgICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgZGF0YUhhbmRsZXIpO1xuICAgICAgICBjaGlsZC5vbignZXhpdCcsIChjb2RlKSA9PiB7XG4gICAgICAgICAgaWYgKGNvZGUgPT0gMClcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBleGVjUFM6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZXhlY0NvbXBvc2VDb21tYW5kKCdwcycsIFtdLCB0cnVlKVxuICAgICAgLnRoZW4oKHN0ZG91dCkgPT4gdGhpcy5oYW5kbGVQU091dHB1dChzdGRvdXQpKVxuICAgICAgLmNhdGNoKCgpID0+IHt9KTtcbiAgfSxcblxuICBoYW5kbGVQU091dHB1dDogZnVuY3Rpb24ob3V0cHV0KSB7XG4gICAgbGV0IGxpbmVzID0gb3V0cHV0LnNwbGl0KCdcXG4nKS5zbGljZSgyKTtcbiAgICBsZXQgc2VydmljZXMgPSBmcm9tSlMoc3RvcmUuZ2V0U3RhdGUoKS5jb21wb3NlKVxuICAgICAgICAgICAgICAgICAgICAubWFwKGNvbmZpZyA9PiBjb25maWcuZ2V0KCdzZXJ2aWNlcycpKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChyZWR1Y3Rpb24sIHZhbHVlKSA9PiByZWR1Y3Rpb24uY29uY2F0KHZhbHVlKSwgZnJvbUpTKFtdKSlcbiAgICAgICAgICAgICAgICAgICAgLnRvSlMoKTtcblxuICAgIGxldCByZWZyZXNoZWRTZXJ2aWNlcyA9IHNlcnZpY2VzLm1hcChcbiAgICAgIHNlcnZpY2UgPT4ge1xuICAgICAgICBsZXQgbiA9IHNlcnZpY2UuY29udGFpbmVyX25hbWUgfHwgc2VydmljZS5uYW1lO1xuXG4gICAgICAgIGxldCBsaW5lID0gbGluZXMuZmluZChsaW5lID0+IHtcbiAgICAgICAgICByZXR1cm4gbGluZS5zcGxpdCgnICcpWzBdLmluZGV4T2YobikgIT0gLTE7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbmFtZTogbixcbiAgICAgICAgICB1cDogbGluZSAmJiAobGluZS5pbmRleE9mKCcgVXAgJykgIT0gLTEpID8gJ3VwJyA6ICdkb3duJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICk7XG5cbiAgICBjb25zb2xlLmxvZyhyZWZyZXNoZWRTZXJ2aWNlcyk7XG4gICAgc3RvcmUuZGlzcGF0Y2goY3JlYXRlU2VydmljZVN0YXRlQ2hhbmdlZEFjdGlvbihyZWZyZXNoZWRTZXJ2aWNlcykpO1xuICAgIHRoaXMucmVuZGVyU2VydmljZUxpc3QoKTtcbiAgfSxcblxuICBwdXNoSW1hZ2U6IGZ1bmN0aW9uKHRhZywgcmVtb3RlVGFnKSB7XG4gICAgZXhlYyhgZG9ja2VyIHRhZyAke3RhZ30gJHtyZW1vdGVUYWd9YCwge30sIChlcnIsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgSW1wb3NzaWJsZSB0byB0YWcgJHt0YWd9IHdpdGggJHtyZW1vdGVUYWd9YCwge2Rpc21pc3NhYmxlOiB0cnVlLCBkZXRhaWw6IHN0ZGVycn0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhgVGFnZ2VkICR7dGFnfSB3aXRoICR7cmVtb3RlVGFnfSBzdWNjZXNzZnVsbHksIHB1c2hpbmcgLi4uYCk7XG4gICAgICAgIGV4ZWMoYGRvY2tlciBwdXNoICR7cmVtb3RlVGFnfWAsIHt9LCAoZXJyb3IsIHB1c2hTdGRvdXQsIHB1c2hTdGRlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgSW1wb3NzaWJsZSB0byBwdXNoICR7cmVtb3RlVGFnfWAsIHtkaXNtaXNzYWJsZTogdHJ1ZSwgZGV0YWlsOiBwdXNoU3RkZXJyfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKGBQdXNoZWQgJHtyZW1vdGVUYWd9IHN1Y2Nlc3NmdWxseWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgb25QdXNoOiBmdW5jdGlvbihzZXJ2aWNlTmFtZXMpIHtcbiAgICBsZXQgdGFnID0gZnJvbUpTKHN0b3JlLmdldFN0YXRlKCkuY29tcG9zZSlcbiAgICAgICAgICAgICAgLm1hcChjb25mID0+IGNvbmYuc2VydmljZXMpXG4gICAgICAgICAgICAgIC5yZWR1Y2UoKHJlZHVjdGlvbiwgdmFsdWUpID0+IHJlZHVjdGlvbi5jb25jYXQodmFsdWUpLCBmcm9tSlMoW10pKVxuICAgICAgICAgICAgICAuZmluZChzZXJ2aWNlID0+IHNlcnZpY2UuZ2V0KCduYW1lJykgPT0gc2VydmljZU5hbWVzWzBdKVxuICAgICAgICAgICAgICAuZ2V0KCd0YWcnKTtcbiAgICBsZXQgcHJvbXB0ID0gUmVhY3RET00ucmVuZGVyKDxSZW1vdGVJbmZvc1Byb21wdCAvPiwgdGhpcy5tb2RhbFZpZXcpO1xuXG4gICAgdGhpcy5tb2RhbFZpZXcub25rZXlkb3duID0gKGUpID0+IHtcbiAgICAgIHZhciBjdHJsRG93biA9IGUuY3RybEtleSB8fCBlLm1ldGFLZXk7XG4gICAgICBpZiAoZS53aGljaCA9PSAyNykgeyAvLyBlc2NcbiAgICAgICAgdGhpcy5tb2RhbFBhbmVsLmhpZGUoKTtcbiAgICAgIH0gZWxzZSBpZiAoZS53aGljaCA9PSAxMykgeyAvL2VudGVyXG4gICAgICAgIGlmIChwcm9tcHQudGV4dC52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5tb2RhbFBhbmVsLmhpZGUoKTtcbiAgICAgICAgICBsZXQgbmV3VGFnID0gcHJvbXB0LnRleHQudmFsdWU7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoYCR7dGFnfSA9PiAke25ld1RhZ31gKTtcbiAgICAgICAgICB0aGlzLnB1c2hJbWFnZSh0YWcsIG5ld1RhZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5tb2RhbFBhbmVsLnNob3coKVxuICAgIHByb21wdC50ZXh0LmZvY3VzKCk7XG4gIH0sXG5cbiAgb25Db21wb3NlQWN0aW9uOiBmdW5jdGlvbihhY3Rpb24sIHNlcnZpY2VOYW1lcykge1xuICAgIHN0b3JlLmRpc3BhdGNoKGNyZWF0ZUxvZ1JlY2VpdmVkQWN0aW9uKGBbQXRvbV0gJHthY3Rpb259Li4uYCkpO1xuICAgIGlmIChhY3Rpb24gPT0gXCJwdXNoXCIpIHtcbiAgICAgIHRoaXMub25QdXNoKHNlcnZpY2VOYW1lcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXhlY0NvbXBvc2VDb21tYW5kKGFjdGlvbiwgc2VydmljZU5hbWVzLCBhY3Rpb24gPT0gXCJwc1wiKVxuICAgICAgLnRoZW4oKHN0ZG91dCkgPT4ge1xuICAgICAgICB0aGlzLnB1c2hTdWNjZXNzVmVyYm9zZU5vdGlmaWNhdGlvbihgJHthY3Rpb259ICR7c2VydmljZU5hbWVzICYmIHNlcnZpY2VOYW1lcy5sZW5ndGggPiAwID8gc2VydmljZU5hbWVzLmpvaW4oJyAnKSA6IFwiXCJ9YCwge30pO1xuXG4gICAgICAgIGlmIChhY3Rpb24gPT0gXCJwc1wiKSB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVQU091dHB1dChzdGRvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFjdGlvbiA9PSBcInVwXCIgfHwgYWN0aW9uID09IFwicmVzdGFydFwiKSB7XG4gICAgICAgICAgdGhpcy5jb21wb3NlUGFuZWwuY29tcG9zZUxvZ3Muc2VydmljZUxhdW5jaGVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWN0aW9uID09IFwidXBcIiB8fCBhY3Rpb24gPT0gXCJyZXN0YXJ0XCIgfHwgYWN0aW9uID09IFwic3RvcFwiKSB7XG4gICAgICAgICAgdGhpcy5leGVjUFMoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoc3RkZXJyKSA9PiB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgJHthY3Rpb259ICR7c2VydmljZU5hbWVzICYmIHNlcnZpY2VOYW1lcy5sZW5ndGggPiAwID8gc2VydmljZU5hbWVzLmpvaW4oJyAnKSA6IFwiXCJ9YCwge1xuICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZSxcbiAgICAgICAgICBkZXRhaWw6IHN0ZGVyclxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXJTZXJ2aWNlTGlzdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jb21wb3NlUGFuZWwgPSBSZWFjdERPTS5yZW5kZXIoXG4gICAgICA8Q29tcG9zZVBhbmVsXG4gICAgICAgIG9uQWN0aW9uPXt0aGlzLm9uQ29tcG9zZUFjdGlvbi5iaW5kKHRoaXMpfVxuICAgICAgICBjb21wb3NlRmlsZVBhdGhzPXtzdG9yZS5nZXRTdGF0ZSgpLmNvbXBvc2UubWFwKGNvbmYgPT4gY29uZi5maWxlUGF0aCl9XG4gICAgICAvPixcbiAgICAgIHRoaXMuZG9ja2VyVmlld1xuICAgICk7XG4gIH0sXG5cbiAgdG9nZ2xlKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmJvdHRvbVBhbmVsLmlzVmlzaWJsZSgpID9cbiAgICAgIHRoaXMuYm90dG9tUGFuZWwuaGlkZSgpIDpcbiAgICAgIHRoaXMuYm90dG9tUGFuZWwuc2hvdygpXG4gICAgKTtcbiAgfVxufTtcbiJdfQ==
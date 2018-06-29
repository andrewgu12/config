Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _reactForAtom = require('react-for-atom');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _ServiceLogs = require('./ServiceLogs');

var _ServiceLogs2 = _interopRequireDefault(_ServiceLogs);

var _reduxStore = require('../redux/store');

var _reduxStore2 = _interopRequireDefault(_reduxStore);

var _reduxActionsLog = require('../redux/actions/log');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _docker = require('../docker');

var _docker2 = _interopRequireDefault(_docker);

var _immutable = require('immutable');

'use babel';

exports['default'] = _reactForAtom.React.createClass({
  displayName: 'ComposeLogsConnecter',

  getInitialState: function getInitialState() {
    return {
      commandRunning: false,
      output: _reduxStore2['default'].getState().output
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      composeFilePaths: []
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    this.unsubscribe = _reduxStore2['default'].subscribe(this.onCacheChanged);
    this.trotthledUpdate = _lodash2['default'].throttle(function () {
      _this.forceUpdate();
    }, 200);
    this.exec();
  },
  componentWillUnmount: function componentWillUnmount() {
    this.kill();
    this.unsubscribe();
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (prevProps.composeFilePaths.join(' ') != this.props.composeFilePaths.join(' ')) {
      this.reload();
    }
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    return this.props.filters != nextProps.filters || this.props.composeFilePaths != nextProps.composeFilePaths || this.state.commandRunning != nextState.commandRunning;
  },
  onCacheChanged: function onCacheChanged() {
    if (_reduxStore2['default'].getState().output != this.state.output) {
      this.setState((0, _reactForAtom.update)(this.state, {
        output: { $set: _reduxStore2['default'].getState().output }
      }), this.trotthledUpdate);
    }
  },
  exec: function exec() {
    var _this2 = this;

    if (this.props.composeFilePaths.join(' ') == "" || this.state.commandRunning == true) return;
    this.command = _child_process2['default'].spawn('docker-compose', [].concat(_toConsumableArray((0, _immutable.fromJS)(this.props.composeFilePaths).map(function (p) {
      return (0, _immutable.fromJS)(["-f", p]);
    }).reduce(function (reduction, v) {
      return v.concat(reduction);
    }, (0, _immutable.fromJS)([])).toJS()), ['logs', '-f', '--tail', '40']));
    var dataHandler = function dataHandler(output) {
      var str = output.toString();
      _this2.dispatchNewOutput(str);
      if (str.indexOf('exited with code') != -1) {
        _docker2['default'].execPS();
      }
    };
    this.command.stdout.on('data', dataHandler);
    this.command.stderr.on('data', dataHandler);
    this.setState((0, _reactForAtom.update)(this.state, {
      commandRunning: { $set: true }
    }));
    this.command.on('exit', function () {
      _this2.setState((0, _reactForAtom.update)(_this2.state, {
        commandRunning: { $set: false }
      }));
    });
  },
  dispatchNewOutput: function dispatchNewOutput(output) {
    _reduxStore2['default'].dispatch((0, _reduxActionsLog.createLogReceivedAction)(output));
  },
  serviceLaunched: function serviceLaunched() {
    if (this.state.commandRunning == false) this.exec();
  },
  kill: function kill() {
    this.command && this.command.kill();
  },
  reload: function reload() {
    this.kill();
    this.clear();
    this.exec();
  },
  clear: function clear() {
    _reduxStore2['default'].dispatch((0, _reduxActionsLog.createLogResetAction)());
  },
  render: function render() {
    return _reactForAtom.React.createElement(_ServiceLogs2['default'], _extends({}, this.props, { output: this.state.output, attached: this.state.commandRunning, reload: this.reload, stop: this.kill, clear: this.clear }));
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9Db21wb3NlTG9nc0Nvbm5lY3Rlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzRCQUU0QixnQkFBZ0I7OzZCQUNsQixlQUFlOzs7OzJCQUNqQixlQUFlOzs7OzBCQUNyQixnQkFBZ0I7Ozs7K0JBQzBCLHNCQUFzQjs7c0JBQ3BFLFFBQVE7Ozs7c0JBQ0gsV0FBVzs7Ozt5QkFDVCxXQUFXOztBQVRoQyxXQUFXLENBQUM7O3FCQVdHLG9CQUFNLFdBQVcsQ0FBQzs7O0FBQy9CLGlCQUFlLEVBQUUsMkJBQVc7QUFDMUIsV0FBTztBQUNMLG9CQUFjLEVBQUUsS0FBSztBQUNyQixZQUFNLEVBQUUsd0JBQU0sUUFBUSxFQUFFLENBQUMsTUFBTTtLQUNoQyxDQUFDO0dBQ0g7QUFDRCxpQkFBZSxFQUFFLDJCQUFXO0FBQzFCLFdBQU87QUFDTCxzQkFBZ0IsRUFBRSxFQUFFO0tBQ3JCLENBQUM7R0FDSDtBQUNELG1CQUFpQixFQUFFLDZCQUFXOzs7QUFDNUIsUUFBSSxDQUFDLFdBQVcsR0FBRyx3QkFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3hELFFBQUksQ0FBQyxlQUFlLEdBQUcsb0JBQUUsUUFBUSxDQUFDLFlBQU07QUFBQyxZQUFLLFdBQVcsRUFBRSxDQUFBO0tBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuRSxRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDYjtBQUNELHNCQUFvQixFQUFFLGdDQUFXO0FBQy9CLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUNwQjtBQUNELG9CQUFrQixFQUFFLDRCQUFTLFNBQVMsRUFBRTtBQUN0QyxRQUFJLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFD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akQ7QUFDRCxpQkFBZSxFQUFFLDJCQUFXO0FBQzFCLFFBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLElBQUksS0FBSyxFQUNwQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDZjtBQUNELE1BQUksRUFBRSxnQkFBVztBQUNmLFFBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNyQztBQUNELFFBQU0sRUFBRSxrQkFBVztBQUNqQixRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixRQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDYixRQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDYjtBQUNELE9BQUssRUFBRSxpQkFBVztBQUNoQiw0QkFBTSxRQUFRLENBQUMsNENBQXNCLENBQUMsQ0FBQztHQUN4QztBQUNELFFBQU0sRUFBRSxrQkFBVztBQUNqQixXQUFRLHlFQUFpQixJQUFJLENBQUMsS0FBSyxJQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQUFBQyxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxBQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEFBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQUFBQyxJQUFFLENBQUM7R0FDaks7Q0FDRixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9Db21wb3NlTG9nc0Nvbm5lY3Rlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQge1JlYWN0LCB1cGRhdGV9IGZyb20gJ3JlYWN0LWZvci1hdG9tJztcbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IFNlcnZpY2VMb2dzIGZyb20gJy4vU2VydmljZUxvZ3MnO1xuaW1wb3J0IHN0b3JlIGZyb20gJy4uL3JlZHV4L3N0b3JlJztcbmltcG9ydCB7Y3JlYXRlTG9nUmVjZWl2ZWRBY3Rpb24sIGNyZWF0ZUxvZ1Jlc2V0QWN0aW9ufSBmcm9tICcuLi9yZWR1eC9hY3Rpb25zL2xvZyc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGRvY2tlciBmcm9tICcuLi9kb2NrZXInO1xuaW1wb3J0IHtmcm9tSlN9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29tbWFuZFJ1bm5pbmc6IGZhbHNlLFxuICAgICAgb3V0cHV0OiBzdG9yZS5nZXRTdGF0ZSgpLm91dHB1dFxuICAgIH07XG4gIH0sXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbXBvc2VGaWxlUGF0aHM6IFtdXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudW5zdWJzY3JpYmUgPSBzdG9yZS5zdWJzY3JpYmUodGhpcy5vbkNhY2hlQ2hhbmdlZCk7XG4gICAgdGhpcy50cm90dGhsZWRVcGRhdGUgPSBfLnRocm90dGxlKCgpID0+IHt0aGlzLmZvcmNlVXBkYXRlKCl9LCAyMDApO1xuICAgIHRoaXMuZXhlYygpO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5raWxsKCk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKHByZXZQcm9wcykge1xuICAgIGlmIChwcmV2UHJvcHMuY29tcG9zZUZpbGVQYXRocy5qb2luKCcgJykgIT0gdGhpcy5wcm9wcy5jb21wb3NlRmlsZVBhdGhzLmpvaW4oJyAnKSkge1xuICAgICAgdGhpcy5yZWxvYWQoKTtcbiAgICB9XG4gIH0sXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZTogZnVuY3Rpb24obmV4dFByb3BzLCBuZXh0U3RhdGUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5wcm9wcy5maWx0ZXJzICE9IG5leHRQcm9wcy5maWx0ZXJzIHx8XG4gICAgICB0aGlzLnByb3BzLmNvbXBvc2VGaWxlUGF0aHMgIT0gbmV4dFByb3BzLmNvbXBvc2VGaWxlUGF0aHMgfHxcbiAgICAgIHRoaXMuc3RhdGUuY29tbWFuZFJ1bm5pbmcgIT0gbmV4dFN0YXRlLmNvbW1hbmRSdW5uaW5nXG4gICAgKTtcbiAgfSxcbiAgb25DYWNoZUNoYW5nZWQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzdG9yZS5nZXRTdGF0ZSgpLm91dHB1dCAhPSB0aGlzLnN0YXRlLm91dHB1dCl7XG4gICAgICB0aGlzLnNldFN0YXRlKHVwZGF0ZSh0aGlzLnN0YXRlLCB7XG4gICAgICAgIG91dHB1dDogeyRzZXQ6IHN0b3JlLmdldFN0YXRlKCkub3V0cHV0fVxuICAgICAgfSksIHRoaXMudHJvdHRobGVkVXBkYXRlKTtcbiAgICB9XG4gIH0sXG4gIGV4ZWM6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNvbXBvc2VGaWxlUGF0aHMuam9pbignICcpID09IFwiXCIgfHwgdGhpcy5zdGF0ZS5jb21tYW5kUnVubmluZyA9PSB0cnVlKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuY29tbWFuZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oJ2RvY2tlci1jb21wb3NlJywgWy4uLmZyb21KUyh0aGlzLnByb3BzLmNvbXBvc2VGaWxlUGF0aHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocCA9PiBmcm9tSlMoW1wiLWZcIiwgcF0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChyZWR1Y3Rpb24sIHYpID0+IHYuY29uY2F0KHJlZHVjdGlvbiksIGZyb21KUyhbXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50b0pTKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2xvZ3MnLCAnLWYnLCAnLS10YWlsJywgJzQwJ10pO1xuICAgIGxldCBkYXRhSGFuZGxlciA9IChvdXRwdXQpID0+IHtcbiAgICAgIGxldCBzdHIgPSBvdXRwdXQudG9TdHJpbmcoKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hOZXdPdXRwdXQoc3RyKTtcbiAgICAgIGlmIChzdHIuaW5kZXhPZignZXhpdGVkIHdpdGggY29kZScpICE9IC0xKSB7XG4gICAgICAgIGRvY2tlci5leGVjUFMoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb21tYW5kLnN0ZG91dC5vbignZGF0YScsIGRhdGFIYW5kbGVyKTtcbiAgICB0aGlzLmNvbW1hbmQuc3RkZXJyLm9uKCdkYXRhJywgZGF0YUhhbmRsZXIpO1xuICAgIHRoaXMuc2V0U3RhdGUodXBkYXRlKHRoaXMuc3RhdGUsIHtcbiAgICAgIGNvbW1hbmRSdW5uaW5nOiB7JHNldDogdHJ1ZX1cbiAgICB9KSk7XG4gICAgdGhpcy5jb21tYW5kLm9uKCdleGl0JywgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh1cGRhdGUodGhpcy5zdGF0ZSwge1xuICAgICAgICBjb21tYW5kUnVubmluZzogeyRzZXQ6IGZhbHNlfVxuICAgICAgfSkpO1xuICAgIH0pO1xuICB9LFxuICBkaXNwYXRjaE5ld091dHB1dDogZnVuY3Rpb24ob3V0cHV0KSB7XG4gICAgc3RvcmUuZGlzcGF0Y2goY3JlYXRlTG9nUmVjZWl2ZWRBY3Rpb24ob3V0cHV0KSk7XG4gIH0sXG4gIHNlcnZpY2VMYXVuY2hlZDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuY29tbWFuZFJ1bm5pbmcgPT0gZmFsc2UpXG4gICAgICB0aGlzLmV4ZWMoKTtcbiAgfSxcbiAga2lsbDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jb21tYW5kICYmIHRoaXMuY29tbWFuZC5raWxsKCk7XG4gIH0sXG4gIHJlbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5raWxsKCk7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMuZXhlYygpO1xuICB9LFxuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgc3RvcmUuZGlzcGF0Y2goY3JlYXRlTG9nUmVzZXRBY3Rpb24oKSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICg8U2VydmljZUxvZ3Mgey4uLnRoaXMucHJvcHN9IG91dHB1dD17dGhpcy5zdGF0ZS5vdXRwdXR9IGF0dGFjaGVkPXt0aGlzLnN0YXRlLmNvbW1hbmRSdW5uaW5nfSByZWxvYWQ9e3RoaXMucmVsb2FkfSBzdG9wPXt0aGlzLmtpbGx9IGNsZWFyPXt0aGlzLmNsZWFyfS8+KVxuICB9XG59KTtcbiJdfQ==
Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactForAtom = require('react-for-atom');

var _ServiceControls = require('./ServiceControls');

var _ServiceControls2 = _interopRequireDefault(_ServiceControls);

'use babel';

exports['default'] = _reactForAtom.React.createClass({
  displayName: 'ServiceItem',

  getDefaultProps: function getDefaultProps() {
    return {
      name: "error",
      up: "unknown",
      onFilterChange: function onFilterChange() {},
      onAction: function onAction(action, serviceName) {}
    };
  },
  render: function render() {
    var _this = this;

    return _reactForAtom.React.createElement(_ServiceControls2['default'], {
      up: this.props.up,
      name: this.props.container_name || this.props.name,
      onFilterChange: this.props.onFilterChange,
      selected: this.props.selected,
      onUpClick: function () {
        return _this.props.onAction("up", _this.props.name);
      },
      onBuildClick: function () {
        return _this.props.onAction("build", _this.props.name);
      },
      onRestartClick: function () {
        return _this.props.onAction("restart", _this.props.name);
      },
      onStopClick: function () {
        return _this.props.onAction("stop", _this.props.name);
      },
      onRmClick: function () {
        return _this.props.onAction("rm", _this.props.name);
      },
      onPushClick: this.props.tag ? function () {
        return _this.props.onAction('push', _this.props.name);
      } : undefined
    });
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9TZXJ2aWNlSXRlbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7NEJBRW9CLGdCQUFnQjs7K0JBQ1IsbUJBQW1COzs7O0FBSC9DLFdBQVcsQ0FBQTs7cUJBS0ksb0JBQU0sV0FBVyxDQUFDOzs7QUFDL0IsaUJBQWUsRUFBRSwyQkFBVztBQUMxQixXQUFPO0FBQ0wsVUFBSSxFQUFFLE9BQU87QUFDYixRQUFFLEVBQUUsU0FBUztBQUNiLG9CQUFjLEVBQUUsMEJBQVcsRUFFMUI7QUFDRCxjQUFRLEVBQUUsa0JBQVMsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUV2QztLQUNGLENBQUM7R0FDSDtBQUNELFFBQU0sRUFBRSxrQkFBVzs7O0FBQ2pCLFdBQ0U7QUFDRSxRQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEFBQUM7QUFDbEIsVUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxBQUFDO0FBQ25ELG9CQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEFBQUM7QUFDMUMsY0FBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxBQUFDO0FBQzlCLGVBQVMsRUFBRTtlQUFNLE1BQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBSyxLQUFLLENBQUMsSUFBSSxDQUFDO09BQUEsQUFBQztBQUM1RCxrQkFBWSxFQUFFO2VBQU0sTUFBSyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxNQUFLLEtBQUssQ0FBQyxJQUFJLENBQUM7T0FBQSxBQUFDO0FBQ2xFLG9CQUFjLEVBQUU7ZUFBTSxNQUFLLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLE1BQUssS0FBSyxDQUFDLElBQUksQ0FBQztPQUFBLEFBQUM7QUFDdEUsaUJBQVcsRUFBRTtlQUFNLE1BQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBSyxLQUFLLENBQUMsSUFBSSxDQUFDO09BQUEsQUFBQztBQUNoRSxlQUFTLEVBQUU7ZUFBTSxNQUFLLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQUssS0FBSyxDQUFDLElBQUksQ0FBQztPQUFBLEFBQUM7QUFDNUQsaUJBQVcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRztlQUFNLE1BQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBSyxLQUFLLENBQUMsSUFBSSxDQUFDO09BQUEsR0FBRyxTQUFTLEFBQUM7TUFDN0YsQ0FDRjtHQUNIO0NBQ0YsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbWluZ2JvL2NvbmZpZy8uYXRvbS9wYWNrYWdlcy9kb2NrZXIvbGliL2NvbXBvbmVudHMvU2VydmljZUl0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge1JlYWN0fSBmcm9tICdyZWFjdC1mb3ItYXRvbSc7XG5pbXBvcnQgU2VydmljZUNvbnRyb2xzIGZyb20gJy4vU2VydmljZUNvbnRyb2xzJztcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBcImVycm9yXCIsXG4gICAgICB1cDogXCJ1bmtub3duXCIsXG4gICAgICBvbkZpbHRlckNoYW5nZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgIH0sXG4gICAgICBvbkFjdGlvbjogZnVuY3Rpb24oYWN0aW9uLCBzZXJ2aWNlTmFtZSkge1xuXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFNlcnZpY2VDb250cm9sc1xuICAgICAgICB1cD17dGhpcy5wcm9wcy51cH1cbiAgICAgICAgbmFtZT17dGhpcy5wcm9wcy5jb250YWluZXJfbmFtZSB8fCB0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgIG9uRmlsdGVyQ2hhbmdlPXt0aGlzLnByb3BzLm9uRmlsdGVyQ2hhbmdlfVxuICAgICAgICBzZWxlY3RlZD17dGhpcy5wcm9wcy5zZWxlY3RlZH1cbiAgICAgICAgb25VcENsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9uQWN0aW9uKFwidXBcIiwgdGhpcy5wcm9wcy5uYW1lKX1cbiAgICAgICAgb25CdWlsZENsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9uQWN0aW9uKFwiYnVpbGRcIiwgdGhpcy5wcm9wcy5uYW1lKX1cbiAgICAgICAgb25SZXN0YXJ0Q2xpY2s9eygpID0+IHRoaXMucHJvcHMub25BY3Rpb24oXCJyZXN0YXJ0XCIsIHRoaXMucHJvcHMubmFtZSl9XG4gICAgICAgIG9uU3RvcENsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9uQWN0aW9uKFwic3RvcFwiLCB0aGlzLnByb3BzLm5hbWUpfVxuICAgICAgICBvblJtQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub25BY3Rpb24oXCJybVwiLCB0aGlzLnByb3BzLm5hbWUpfVxuICAgICAgICBvblB1c2hDbGljaz17dGhpcy5wcm9wcy50YWcgPyAoKSA9PiB0aGlzLnByb3BzLm9uQWN0aW9uKCdwdXNoJywgdGhpcy5wcm9wcy5uYW1lKSA6IHVuZGVmaW5lZH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufSk7XG4iXX0=
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactForAtom = require('react-for-atom');

var _ServiceItem = require('./ServiceItem');

var _ServiceItem2 = _interopRequireDefault(_ServiceItem);

var _ServiceControls = require('./ServiceControls');

var _ServiceControls2 = _interopRequireDefault(_ServiceControls);

var _immutable = require('immutable');

'use babel';

exports['default'] = _reactForAtom.React.createClass({
  displayName: 'ServiceList',

  getInitialState: function getInitialState() {
    return {
      filters: []
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      services: [],
      onFiltersChange: function onFiltersChange() {},
      onAction: function onAction(action, serviceNames) {}
    };
  },
  onFilterChange: function onFilterChange(serviceName) {
    var _this = this;

    return function (selected) {
      var newFilters = undefined;
      if (serviceName != "all") {
        if (selected) {
          newFilters = (0, _immutable.fromJS)(_this.state.filters).push(serviceName).toJS();
        } else {
          newFilters = _this.state.filters.filter(function (service) {
            return service != serviceName;
          });
        }
      } else {
        if (selected) {
          newFilters = _this.props.services.map(function (service) {
            return service.container_name || service.name;
          });
        } else {
          newFilters = [];
        }
      }
      _this.setState({ filters: newFilters }, function () {
        _this.props.onFiltersChange(newFilters);
      });
    };
  },
  render: function render() {
    var _this2 = this;

    return _reactForAtom.React.createElement(
      'table',
      { className: 'services' },
      _reactForAtom.React.createElement(
        'thead',
        null,
        _reactForAtom.React.createElement(
          'tr',
          null,
          _reactForAtom.React.createElement(
            'td',
            null,
            'Container'
          ),
          _reactForAtom.React.createElement(
            'td',
            null,
            'Push'
          ),
          _reactForAtom.React.createElement(
            'td',
            null,
            'Refresh'
          ),
          _reactForAtom.React.createElement(
            'td',
            null,
            'Start'
          ),
          _reactForAtom.React.createElement(
            'td',
            null,
            'Build'
          ),
          _reactForAtom.React.createElement(
            'td',
            null,
            'Restart'
          ),
          _reactForAtom.React.createElement(
            'td',
            null,
            'Stop'
          ),
          _reactForAtom.React.createElement(
            'td',
            null,
            'Remove'
          ),
          _reactForAtom.React.createElement(
            'td',
            null,
            'Show output'
          )
        ),
        _reactForAtom.React.createElement(_ServiceControls2['default'], {
          applyToAll: true,
          onFilterChange: this.onFilterChange("all"),
          selected: this.state.filters.length == this.props.services.length,
          onUpClick: function () {
            return _this2.props.onAction("up");
          },
          onBuildClick: function () {
            return _this2.props.onAction("build");
          },
          onRestartClick: function () {
            return _this2.props.onAction("restart");
          },
          onStopClick: function () {
            return _this2.props.onAction("stop");
          },
          onRmClick: function () {
            return _this2.props.onAction("rm");
          },
          onPSClick: function () {
            return _this2.props.onAction('ps');
          }
        })
      ),
      _reactForAtom.React.createElement(
        'tbody',
        null,
        this.props.services.map(function (service, i) {
          return _reactForAtom.React.createElement(_ServiceItem2['default'], _extends({
            key: 'service' + i,
            onFilterChange: _this2.onFilterChange(service.name),
            selected: _this2.state.filters.find(function (filter) {
              return filter == (service.container_name || service.name);
            }) !== undefined,
            onAction: function (action, serviceName) {
              return _this2.props.onAction(action, [serviceName]);
            }
          }, service));
        })
      )
    );
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9TZXJ2aWNlTGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs0QkFFb0IsZ0JBQWdCOzsyQkFDWixlQUFlOzs7OytCQUNYLG1CQUFtQjs7Ozt5QkFDMUIsV0FBVzs7QUFMaEMsV0FBVyxDQUFBOztxQkFPSSxvQkFBTSxXQUFXLENBQUM7OztBQUMvQixpQkFBZSxFQUFFLDJCQUFXO0FBQzFCLFdBQU87QUFDTCxhQUFPLEVBQUUsRUFBRTtLQUNaLENBQUM7R0FDSDtBQUNELGlCQUFlLEVBQUUsMkJBQVc7QUFDMUIsV0FBTztBQUNMLGNBQVEsRUFBRSxFQUFFO0FBQ1oscUJBQWUsRUFBRSwyQkFBVyxFQUUzQjtBQUNELGNBQVEsRUFBRSxrQkFBUyxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBRXhDO0tBQ0YsQ0FBQztHQUNIO0FBQ0QsZ0JBQWMsRUFBRSx3QkFBUyxXQUFXLEVBQUU7OztBQUNwQyxXQUFPLFVBQUMsUUFBUSxFQUFLO0FBQ25CLFVBQUksVUFBVSxZQUFBLENBQUM7QUFDZixVQUFJLFdBQVcsSUFBSSxLQUFLLEVBQUU7QUFDeEIsWUFBSSxRQUFRLEVBQUU7QUFDWixvQkFBVSxHQUFHLHVCQUFPLE1BQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNsRSxNQUFNO0FBQ0wsb0JBQVUsR0FBRyxNQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsT0FBTzttQkFBSSxPQUFPLElBQUksV0FBVztXQUFBLENBQUMsQ0FBQztTQUMzRTtPQUNGLE1BQU07QUFDTCxZQUFJLFFBQVEsRUFBRTtBQUNaLG9CQUFVLEdBQUcsTUFBSyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUM5QyxtQkFBTyxPQUFPLENBQUMsY0FBYyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUM7V0FDL0MsQ0FBQyxDQUFDO1NBQ0osTUFBTTtBQUNMLG9CQUFVLEdBQUcsRUFBRSxDQUFDO1NBQ2pCO09BQ0Y7QUFDRCxZQUFLLFFBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUMsRUFBRSxZQUFNO0FBQUMsY0FBSyxLQUFLLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQUMsQ0FBQyxDQUFDO0tBQ3RGLENBQUM7R0FDSDtBQUNELFFBQU0sRUFBRSxrQkFBVzs7O0FBQ2pCLFdBQ0U7O1FBQU8sU0FBUyxFQUFDLFVBQVU7TUFDekI7OztRQUNFOzs7VUFDRTs7OztXQUFrQjtVQUNsQjs7OztXQUFhO1VBQ2I7Ozs7V0FBZ0I7VUFDaEI7Ozs7V0FBYztVQUNkOzs7O1dBQWM7VUFDZDs7OztXQUFnQjtVQUNoQjs7OztXQUFhO1VBQ2I7Ozs7V0FBZTtVQUNmOzs7O1dBQW9CO1NBQ2pCO1FBQ0w7QUFDRSxvQkFBVSxFQUFFLElBQUksQUFBQztBQUNqQix3QkFBYyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEFBQUM7QUFDM0Msa0JBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxBQUFDO0FBQ2xFLG1CQUFTLEVBQUU7bUJBQU0sT0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztXQUFBLEFBQUM7QUFDM0Msc0JBQVksRUFBRTttQkFBTSxPQUFLLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1dBQUEsQUFBQztBQUNqRCx3QkFBYyxFQUFFO21CQUFNLE9BQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7V0FBQSxBQUFDO0FBQ3JELHFCQUFXLEVBQUU7bUJBQU0sT0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztXQUFBLEFBQUM7QUFDL0MsbUJBQVMsRUFBRTttQkFBTSxPQUFLLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1dBQUEsQUFBQztBQUMzQyxtQkFBUyxFQUFFO21CQUFNLE9BQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7V0FBQSxBQUFDO1VBQzNDO09BQ0k7TUFDUjs7O1FBQ0csSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBTyxFQUFFLENBQUM7aUJBQ2xDO0FBQ0UsZUFBRyxjQUFZLENBQUMsQUFBRztBQUNuQiwwQkFBYyxFQUFFLE9BQUssY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQUFBQztBQUNsRCxvQkFBUSxFQUFFLE9BQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO3FCQUFJLE1BQU0sS0FBSyxPQUFPLENBQUMsY0FBYyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUEsQUFBQzthQUFBLENBQUMsS0FBSyxTQUFTLEFBQUM7QUFDOUcsb0JBQVEsRUFBRSxVQUFDLE1BQU0sRUFBRSxXQUFXO3FCQUFLLE9BQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUFBLEFBQUM7YUFDMUUsT0FBTyxFQUNYO1NBQ0gsQ0FBQztPQUNJO0tBQ0YsQ0FDUjtHQUNIO0NBQ0YsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbWluZ2JvL2NvbmZpZy8uYXRvbS9wYWNrYWdlcy9kb2NrZXIvbGliL2NvbXBvbmVudHMvU2VydmljZUxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge1JlYWN0fSBmcm9tICdyZWFjdC1mb3ItYXRvbSc7XG5pbXBvcnQgU2VydmljZUl0ZW0gZnJvbSAnLi9TZXJ2aWNlSXRlbSc7XG5pbXBvcnQgU2VydmljZUNvbnRyb2xzIGZyb20gJy4vU2VydmljZUNvbnRyb2xzJztcbmltcG9ydCB7ZnJvbUpTfSBmcm9tICdpbW11dGFibGUnO1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlcnM6IFtdXG4gICAgfTtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2VydmljZXM6IFtdLFxuICAgICAgb25GaWx0ZXJzQ2hhbmdlOiBmdW5jdGlvbigpIHtcblxuICAgICAgfSxcbiAgICAgIG9uQWN0aW9uOiBmdW5jdGlvbihhY3Rpb24sIHNlcnZpY2VOYW1lcykge1xuXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgb25GaWx0ZXJDaGFuZ2U6IGZ1bmN0aW9uKHNlcnZpY2VOYW1lKSB7XG4gICAgcmV0dXJuIChzZWxlY3RlZCkgPT4ge1xuICAgICAgbGV0IG5ld0ZpbHRlcnM7XG4gICAgICBpZiAoc2VydmljZU5hbWUgIT0gXCJhbGxcIikge1xuICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgICBuZXdGaWx0ZXJzID0gZnJvbUpTKHRoaXMuc3RhdGUuZmlsdGVycykucHVzaChzZXJ2aWNlTmFtZSkudG9KUygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0ZpbHRlcnMgPSB0aGlzLnN0YXRlLmZpbHRlcnMuZmlsdGVyKHNlcnZpY2UgPT4gc2VydmljZSAhPSBzZXJ2aWNlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICAgIG5ld0ZpbHRlcnMgPSB0aGlzLnByb3BzLnNlcnZpY2VzLm1hcChzZXJ2aWNlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBzZXJ2aWNlLmNvbnRhaW5lcl9uYW1lIHx8IHNlcnZpY2UubmFtZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdGaWx0ZXJzID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2ZpbHRlcnM6IG5ld0ZpbHRlcnN9LCAoKSA9PiB7dGhpcy5wcm9wcy5vbkZpbHRlcnNDaGFuZ2UobmV3RmlsdGVycyl9KTtcbiAgICB9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8dGFibGUgY2xhc3NOYW1lPVwic2VydmljZXNcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0ZD5Db250YWluZXI8L3RkPlxuICAgICAgICAgICAgPHRkPlB1c2g8L3RkPlxuICAgICAgICAgICAgPHRkPlJlZnJlc2g8L3RkPlxuICAgICAgICAgICAgPHRkPlN0YXJ0PC90ZD5cbiAgICAgICAgICAgIDx0ZD5CdWlsZDwvdGQ+XG4gICAgICAgICAgICA8dGQ+UmVzdGFydDwvdGQ+XG4gICAgICAgICAgICA8dGQ+U3RvcDwvdGQ+XG4gICAgICAgICAgICA8dGQ+UmVtb3ZlPC90ZD5cbiAgICAgICAgICAgIDx0ZD5TaG93IG91dHB1dDwvdGQ+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgICA8U2VydmljZUNvbnRyb2xzXG4gICAgICAgICAgICBhcHBseVRvQWxsPXt0cnVlfVxuICAgICAgICAgICAgb25GaWx0ZXJDaGFuZ2U9e3RoaXMub25GaWx0ZXJDaGFuZ2UoXCJhbGxcIil9XG4gICAgICAgICAgICBzZWxlY3RlZD17dGhpcy5zdGF0ZS5maWx0ZXJzLmxlbmd0aCA9PSB0aGlzLnByb3BzLnNlcnZpY2VzLmxlbmd0aH1cbiAgICAgICAgICAgIG9uVXBDbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vbkFjdGlvbihcInVwXCIpfVxuICAgICAgICAgICAgb25CdWlsZENsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9uQWN0aW9uKFwiYnVpbGRcIil9XG4gICAgICAgICAgICBvblJlc3RhcnRDbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vbkFjdGlvbihcInJlc3RhcnRcIil9XG4gICAgICAgICAgICBvblN0b3BDbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vbkFjdGlvbihcInN0b3BcIil9XG4gICAgICAgICAgICBvblJtQ2xpY2s9eygpID0+IHRoaXMucHJvcHMub25BY3Rpb24oXCJybVwiKX1cbiAgICAgICAgICAgIG9uUFNDbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vbkFjdGlvbigncHMnKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgICAge3RoaXMucHJvcHMuc2VydmljZXMubWFwKChzZXJ2aWNlLCBpKSA9PiAoXG4gICAgICAgICAgICA8U2VydmljZUl0ZW1cbiAgICAgICAgICAgICAga2V5PXtgc2VydmljZSR7aX1gfVxuICAgICAgICAgICAgICBvbkZpbHRlckNoYW5nZT17dGhpcy5vbkZpbHRlckNoYW5nZShzZXJ2aWNlLm5hbWUpfVxuICAgICAgICAgICAgICBzZWxlY3RlZD17dGhpcy5zdGF0ZS5maWx0ZXJzLmZpbmQoZmlsdGVyID0+IGZpbHRlciA9PSAoc2VydmljZS5jb250YWluZXJfbmFtZSB8fCBzZXJ2aWNlLm5hbWUpKSAhPT0gdW5kZWZpbmVkfVxuICAgICAgICAgICAgICBvbkFjdGlvbj17KGFjdGlvbiwgc2VydmljZU5hbWUpID0+IHRoaXMucHJvcHMub25BY3Rpb24oYWN0aW9uLCBbc2VydmljZU5hbWVdKX1cbiAgICAgICAgICAgICAgey4uLnNlcnZpY2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICApO1xuICB9XG59KVxuIl19
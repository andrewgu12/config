Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactForAtom = require('react-for-atom');

var _ServiceList = require('./ServiceList');

var _ServiceList2 = _interopRequireDefault(_ServiceList);

var _ComposeLogsConnecter = require('./ComposeLogsConnecter');

var _ComposeLogsConnecter2 = _interopRequireDefault(_ComposeLogsConnecter);

var _ComposeServicesConnecter = require('./ComposeServicesConnecter');

var _ComposeServicesConnecter2 = _interopRequireDefault(_ComposeServicesConnecter);

'use babel';

exports['default'] = _reactForAtom.React.createClass({
  displayName: 'ComposePanel',

  getInitialState: function getInitialState() {
    return {
      filters: []
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      composeFilePaths: [],
      onAction: function onAction(action, serviceNames) {}
    };
  },
  render: function render() {
    var _this = this;

    return _reactForAtom.React.createElement(
      'div',
      { className: 'compose-panel' },
      _reactForAtom.React.createElement(
        _ComposeServicesConnecter2['default'],
        null,
        _reactForAtom.React.createElement(_ServiceList2['default'], { onFiltersChange: function (newFilters) {
            return _this.setState({ filters: newFilters });
          }, onAction: this.props.onAction })
      ),
      _reactForAtom.React.createElement(_ComposeLogsConnecter2['default'], { filters: this.state.filters, composeFilePaths: this.props.composeFilePaths, ref: function (connecter) {
          return _this.composeLogs = connecter;
        } })
    );
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9Db21wb3NlUGFuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OzRCQUVvQixnQkFBZ0I7OzJCQUNaLGVBQWU7Ozs7b0NBQ04sd0JBQXdCOzs7O3dDQUNwQiw0QkFBNEI7Ozs7QUFMakUsV0FBVyxDQUFBOztxQkFPSSxvQkFBTSxXQUFXLENBQUM7OztBQUMvQixpQkFBZSxFQUFFLDJCQUFXO0FBQzFCLFdBQU87QUFDTCxhQUFPLEVBQUUsRUFBRTtLQUNaLENBQUM7R0FDSDtBQUNELGlCQUFlLEVBQUUsMkJBQVc7QUFDMUIsV0FBTztBQUNMLHNCQUFnQixFQUFFLEVBQUU7QUFDcEIsY0FBUSxFQUFFLGtCQUFTLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFFeEM7S0FDRixDQUFDO0dBQ0g7QUFDRCxRQUFNLEVBQUUsa0JBQVc7OztBQUNqQixXQUNFOztRQUFLLFNBQVMsRUFBQyxlQUFlO01BQzVCOzs7UUFDRSw4REFBYSxlQUFlLEVBQUUsVUFBQyxVQUFVO21CQUFLLE1BQUssUUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBQyxDQUFDO1dBQUEsQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQyxHQUFFO09BQzNGO01BQzNCLHVFQUFzQixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEFBQUMsRUFBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixBQUFDLEVBQUMsR0FBRyxFQUFFLFVBQUMsU0FBUztpQkFBSyxNQUFLLFdBQVcsR0FBRyxTQUFTO1NBQUEsQUFBQyxHQUFFO0tBQ2pKLENBQ047R0FDSDtDQUNGLENBQUMiLCJmaWxlIjoiL1VzZXJzL21pbmdiby9jb25maWcvLmF0b20vcGFja2FnZXMvZG9ja2VyL2xpYi9jb21wb25lbnRzL0NvbXBvc2VQYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7UmVhY3R9IGZyb20gJ3JlYWN0LWZvci1hdG9tJztcbmltcG9ydCBTZXJ2aWNlTGlzdCBmcm9tICcuL1NlcnZpY2VMaXN0JztcbmltcG9ydCBDb21wb3NlTG9nc0Nvbm5lY3RlciBmcm9tICcuL0NvbXBvc2VMb2dzQ29ubmVjdGVyJztcbmltcG9ydCBDb21wb3NlU2VydmljZXNDb25uZWN0ZXIgZnJvbSAnLi9Db21wb3NlU2VydmljZXNDb25uZWN0ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlcnM6IFtdXG4gICAgfTtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29tcG9zZUZpbGVQYXRoczogW10sXG4gICAgICBvbkFjdGlvbjogZnVuY3Rpb24oYWN0aW9uLCBzZXJ2aWNlTmFtZXMpIHtcblxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29tcG9zZS1wYW5lbFwiPlxuICAgICAgICA8Q29tcG9zZVNlcnZpY2VzQ29ubmVjdGVyPlxuICAgICAgICAgIDxTZXJ2aWNlTGlzdCBvbkZpbHRlcnNDaGFuZ2U9eyhuZXdGaWx0ZXJzKSA9PiB0aGlzLnNldFN0YXRlKHtmaWx0ZXJzOiBuZXdGaWx0ZXJzfSl9IG9uQWN0aW9uPXt0aGlzLnByb3BzLm9uQWN0aW9ufS8+XG4gICAgICAgIDwvQ29tcG9zZVNlcnZpY2VzQ29ubmVjdGVyPlxuICAgICAgICA8Q29tcG9zZUxvZ3NDb25uZWN0ZXIgZmlsdGVycz17dGhpcy5zdGF0ZS5maWx0ZXJzfSBjb21wb3NlRmlsZVBhdGhzPXt0aGlzLnByb3BzLmNvbXBvc2VGaWxlUGF0aHN9IHJlZj17KGNvbm5lY3RlcikgPT4gdGhpcy5jb21wb3NlTG9ncyA9IGNvbm5lY3Rlcn0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG4iXX0=
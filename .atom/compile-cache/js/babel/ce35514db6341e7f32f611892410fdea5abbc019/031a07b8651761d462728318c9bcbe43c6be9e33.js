Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

//  weak

var _reactForAtom = require('react-for-atom');

var _immutable = require('immutable');

var _reduxStore = require('../redux/store');

var _reduxStore2 = _interopRequireDefault(_reduxStore);

'use babel';exports['default'] = _reactForAtom.React.createClass({
  displayName: 'ComposeServicesConnecter',

  getInitialState: function getInitialState() {
    return this.getUpdatedState();
  },
  getDefaultProps: function getDefaultProps() {
    return {};
  },
  componentDidMount: function componentDidMount() {
    this.unsubscribe = _reduxStore2['default'].subscribe(this.updateState);
  },
  componentWillUnmount: function componentWillUnmount() {
    this.unsubscribe();
  },
  getUpdatedState: function getUpdatedState() {
    return {
      services: (0, _immutable.fromJS)(_reduxStore2['default'].getState().compose).map(function (config) {
        return config.get('services');
      }, (0, _immutable.fromJS)([])).reduce(function (reduction, value) {
        return reduction.concat(value);
      }, (0, _immutable.fromJS)([])).toJS()
    };
  },
  updateState: function updateState() {
    this.setState(this.getUpdatedState());
  },
  render: function render() {
    return _reactForAtom.React.cloneElement(this.props.children, {
      services: this.state.services
    });
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9Db21wb3NlU2VydmljZXNDb25uZWN0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7NEJBR29CLGdCQUFnQjs7eUJBQ2YsV0FBVzs7MEJBRWQsZ0JBQWdCOzs7O0FBTmxDLFdBQVcsQ0FBQSxxQkFRSSxvQkFBTSxXQUFXLENBQUM7OztBQUMvQixpQkFBZSxFQUFFLDJCQUFXO0FBQzFCLFdBQU8sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0dBQy9CO0FBQ0QsaUJBQWUsRUFBRSwyQkFBVztBQUMxQixXQUFPLEVBQUUsQ0FBQztHQUNYO0FBQ0QsbUJBQWlCLEVBQUUsNkJBQVc7QUFDNUIsUUFBSSxDQUFDLFdBQVcsR0FBRyx3QkFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0dBQ3REO0FBQ0Qsc0JBQW9CLEVBQUUsZ0NBQVc7QUFDL0IsUUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0dBQ3BCO0FBQ0QsaUJBQWUsRUFBRSwyQkFBVztBQUMxQixXQUFPO0FBQ0wsY0FBUSxFQUFFLHVCQUFPLHdCQUFNLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUM3QixHQUFHLENBQUMsVUFBQSxNQUFNO2VBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7T0FBQSxFQUFFLHVCQUFPLEVBQUUsQ0FBQyxDQUFDLENBQ2pELE1BQU0sQ0FBQyxVQUFDLFNBQVMsRUFBRSxLQUFLO2VBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7T0FBQSxFQUFFLHVCQUFPLEVBQUUsQ0FBQyxDQUFDLENBQ2pFLElBQUksRUFBRTtLQUNwQixDQUFDO0dBQ0g7QUFDRCxhQUFXLEVBQUUsdUJBQVc7QUFDdEIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztHQUN2QztBQUNELFFBQU0sRUFBRSxrQkFBVztBQUNqQixXQUNFLG9CQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtBQUN0QyxjQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO0tBQzlCLENBQUMsQ0FDRjtHQUNIO0NBQ0YsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbWluZ2JvL2NvbmZpZy8uYXRvbS9wYWNrYWdlcy9kb2NrZXIvbGliL2NvbXBvbmVudHMvQ29tcG9zZVNlcnZpY2VzQ29ubmVjdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcbi8vIEBmbG93IHdlYWtcblxuaW1wb3J0IHtSZWFjdH0gZnJvbSAncmVhY3QtZm9yLWF0b20nO1xuaW1wb3J0IHtmcm9tSlN9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbmltcG9ydCBzdG9yZSBmcm9tICcuLi9yZWR1eC9zdG9yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRVcGRhdGVkU3RhdGUoKTtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnVuc3Vic2NyaWJlID0gc3RvcmUuc3Vic2NyaWJlKHRoaXMudXBkYXRlU3RhdGUpO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9LFxuICBnZXRVcGRhdGVkU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzZXJ2aWNlczogZnJvbUpTKHN0b3JlLmdldFN0YXRlKCkuY29tcG9zZSlcbiAgICAgICAgICAgICAgICAgIC5tYXAoY29uZmlnID0+IGNvbmZpZy5nZXQoJ3NlcnZpY2VzJyksIGZyb21KUyhbXSkpXG4gICAgICAgICAgICAgICAgICAucmVkdWNlKChyZWR1Y3Rpb24sIHZhbHVlKSA9PiByZWR1Y3Rpb24uY29uY2F0KHZhbHVlKSwgZnJvbUpTKFtdKSlcbiAgICAgICAgICAgICAgICAgIC50b0pTKClcbiAgICB9O1xuICB9LFxuICB1cGRhdGVTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFVwZGF0ZWRTdGF0ZSgpKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY2xvbmVFbGVtZW50KHRoaXMucHJvcHMuY2hpbGRyZW4sIHtcbiAgICAgICAgc2VydmljZXM6IHRoaXMuc3RhdGUuc2VydmljZXMsXG4gICAgICB9KVxuICAgICk7XG4gIH1cbn0pO1xuIl19
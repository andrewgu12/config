Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactForAtom = require('react-for-atom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

'use babel';

exports['default'] = _reactForAtom.React.createClass({
  displayName: 'ServiceControls',

  getDefaultProps: function getDefaultProps() {
    return {
      onFilterChange: function onFilterChange() {},
      onUpClick: function onUpClick() {},
      onBuildClick: function onBuildClick() {},
      onRestartClick: function onRestartClick() {},
      onStopClick: function onStopClick() {},
      onRmClick: function onRmClick() {}
    };
  },
  render: function render() {
    var _this = this;

    return _reactForAtom.React.createElement(
      'tr',
      { className: 'service-item' },
      _reactForAtom.React.createElement(
        'td',
        { className: (0, _classnames2['default'])("service-name", {
            "up": this.props.up == "up",
            "down": this.props.up == "down"
          }) },
        this.props.name
      ),
      _reactForAtom.React.createElement(
        'td',
        null,
        this.props.onPushClick ? _reactForAtom.React.createElement('button', { className: 'compose-control icon icon-docker-push', type: 'button', onClick: this.props.onPushClick }) : undefined
      ),
      _reactForAtom.React.createElement(
        'td',
        null,
        this.props.onPSClick ? _reactForAtom.React.createElement('button', { className: 'compose-control icon icon-docker-ps', type: 'button', onClick: this.props.onPSClick }) : undefined
      ),
      _reactForAtom.React.createElement(
        'td',
        null,
        this.props.up != "up" || this.props.applyToAll ? _reactForAtom.React.createElement('button', { className: 'compose-control icon icon-docker-up', type: 'button', onClick: this.props.onUpClick }) : undefined
      ),
      _reactForAtom.React.createElement(
        'td',
        null,
        _reactForAtom.React.createElement('button', { className: 'compose-control icon icon-docker-build', type: 'button', onClick: this.props.onBuildClick })
      ),
      _reactForAtom.React.createElement(
        'td',
        null,
        _reactForAtom.React.createElement('button', { className: 'compose-control icon icon-docker-restart', type: 'button', onClick: this.props.onRestartClick })
      ),
      _reactForAtom.React.createElement(
        'td',
        null,
        this.props.up == "up" || this.props.applyToAll ? _reactForAtom.React.createElement('button', { className: 'compose-control icon icon-docker-stop', type: 'button', onClick: this.props.onStopClick }) : undefined
      ),
      _reactForAtom.React.createElement(
        'td',
        null,
        _reactForAtom.React.createElement('button', { className: 'compose-control icon icon-docker-rm', type: 'button', onClick: this.props.onRmClick })
      ),
      _reactForAtom.React.createElement(
        'td',
        null,
        _reactForAtom.React.createElement('input', { type: 'checkbox', className: 'compose-control', checked: this.props.selected, onChange: function (event) {
            _this.props.onFilterChange(event.target.checked);
          } })
      )
    );
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9TZXJ2aWNlQ29udHJvbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OzRCQUVvQixnQkFBZ0I7OzBCQUNiLFlBQVk7Ozs7QUFIbkMsV0FBVyxDQUFBOztxQkFLSSxvQkFBTSxXQUFXLENBQUM7OztBQUMvQixpQkFBZSxFQUFFLDJCQUFXO0FBQzFCLFdBQU87QUFDTCxvQkFBYyxFQUFFLDBCQUFXLEVBRTFCO0FBQ0QsZUFBUyxFQUFFLHFCQUFXLEVBRXJCO0FBQ0Qsa0JBQVksRUFBRSx3QkFBVyxFQUV4QjtBQUNELG9CQUFjLEVBQUUsMEJBQVcsRUFFMUI7QUFDRCxpQkFBVyxFQUFFLHVCQUFXLEVBRXZCO0FBQ0QsZUFBUyxFQUFFLHFCQUFXLEVBRXJCO0tBQ0YsQ0FBQTtHQUNGO0FBQ0QsUUFBTSxFQUFFLGtCQUFXOzs7QUFDakIsV0FDRTs7UUFBSSxTQUFTLEVBQUMsY0FBYztNQUMxQjs7VUFBSSxTQUFTLEVBQUUsNkJBQVcsY0FBYyxFQUFFO0FBQ3hDLGdCQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksSUFBSTtBQUMzQixrQkFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLE1BQU07V0FDaEMsQ0FBQyxBQUFDO1FBQ0EsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO09BQ2I7TUFDTDs7O1FBRUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBRWxCLDhDQUFRLFNBQVMsRUFBQyx1Q0FBdUMsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQUFBQyxHQUFVLEdBR3BILFNBQVM7T0FFUjtNQUNMOzs7UUFFRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FFaEIsOENBQVEsU0FBUyxFQUFDLHFDQUFxQyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxBQUFDLEdBQVUsR0FHaEgsU0FBUztPQUVSO01BQ0w7OztRQUVFLEFBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUUzQyw4Q0FBUSxTQUFTLEVBQUMscUNBQXFDLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEFBQUMsR0FBVSxHQUdoSCxTQUFTO09BRVI7TUFDTDs7O1FBQ0UsOENBQVEsU0FBUyxFQUFDLHdDQUF3QyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxBQUFDLEdBQVU7T0FDakg7TUFDTDs7O1FBQ0UsOENBQVEsU0FBUyxFQUFDLDBDQUEwQyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxBQUFDLEdBQVU7T0FDckg7TUFDTDs7O1FBRUUsQUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBRTNDLDhDQUFRLFNBQVMsRUFBQyx1Q0FBdUMsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQUFBQyxHQUFVLEdBR3BILFNBQVM7T0FFUjtNQUNMOzs7UUFDRSw4Q0FBUSxTQUFTLEVBQUMscUNBQXFDLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEFBQUMsR0FBVTtPQUMzRztNQUNMOzs7UUFDRSw2Q0FBTyxJQUFJLEVBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEFBQUMsRUFBQyxRQUFRLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFBQyxrQkFBSyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7V0FBQyxBQUFDLEdBQUU7T0FDdko7S0FDRixDQUNMO0dBQ0g7Q0FDRixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9TZXJ2aWNlQ29udHJvbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge1JlYWN0fSBmcm9tICdyZWFjdC1mb3ItYXRvbSc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvbkZpbHRlckNoYW5nZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgIH0sXG4gICAgICBvblVwQ2xpY2s6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB9LFxuICAgICAgb25CdWlsZENsaWNrOiBmdW5jdGlvbigpIHtcblxuICAgICAgfSxcbiAgICAgIG9uUmVzdGFydENsaWNrOiBmdW5jdGlvbigpIHtcblxuICAgICAgfSxcbiAgICAgIG9uU3RvcENsaWNrOiBmdW5jdGlvbigpIHtcblxuICAgICAgfSxcbiAgICAgIG9uUm1DbGljazogZnVuY3Rpb24oKSB7XG5cbiAgICAgIH0sXG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8dHIgY2xhc3NOYW1lPVwic2VydmljZS1pdGVtXCI+XG4gICAgICAgIDx0ZCBjbGFzc05hbWU9e2NsYXNzTmFtZXMoXCJzZXJ2aWNlLW5hbWVcIiwge1xuICAgICAgICAgIFwidXBcIjogdGhpcy5wcm9wcy51cCA9PSBcInVwXCIsXG4gICAgICAgICAgXCJkb3duXCI6IHRoaXMucHJvcHMudXAgPT0gXCJkb3duXCJcbiAgICAgICAgfSl9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLm5hbWV9XG4gICAgICAgIDwvdGQ+XG4gICAgICAgIDx0ZD5cbiAgICAgICAge1xuICAgICAgICAgIHRoaXMucHJvcHMub25QdXNoQ2xpY2sgP1xuICAgICAgICAgICAgKFxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImNvbXBvc2UtY29udHJvbCBpY29uIGljb24tZG9ja2VyLXB1c2hcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5wcm9wcy5vblB1c2hDbGlja30+PC9idXR0b24+XG4gICAgICAgICAgICApXG4gICAgICAgICAgOlxuICAgICAgICAgICAgdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgICAgPC90ZD5cbiAgICAgICAgPHRkPlxuICAgICAgICB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5vblBTQ2xpY2sgP1xuICAgICAgICAgICAgKFxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImNvbXBvc2UtY29udHJvbCBpY29uIGljb24tZG9ja2VyLXBzXCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMucHJvcHMub25QU0NsaWNrfT48L2J1dHRvbj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICA6XG4gICAgICAgICAgICB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgICAgICA8L3RkPlxuICAgICAgICA8dGQ+XG4gICAgICAgIHtcbiAgICAgICAgICAodGhpcy5wcm9wcy51cCAhPSBcInVwXCIgfHwgdGhpcy5wcm9wcy5hcHBseVRvQWxsKSA/XG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiY29tcG9zZS1jb250cm9sIGljb24gaWNvbi1kb2NrZXItdXBcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5wcm9wcy5vblVwQ2xpY2t9PjwvYnV0dG9uPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIDpcbiAgICAgICAgICAgIHVuZGVmaW5lZFxuICAgICAgICB9XG4gICAgICAgIDwvdGQ+XG4gICAgICAgIDx0ZD5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImNvbXBvc2UtY29udHJvbCBpY29uIGljb24tZG9ja2VyLWJ1aWxkXCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMucHJvcHMub25CdWlsZENsaWNrfT48L2J1dHRvbj5cbiAgICAgICAgPC90ZD5cbiAgICAgICAgPHRkPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiY29tcG9zZS1jb250cm9sIGljb24gaWNvbi1kb2NrZXItcmVzdGFydFwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLnByb3BzLm9uUmVzdGFydENsaWNrfT48L2J1dHRvbj5cbiAgICAgICAgPC90ZD5cbiAgICAgICAgPHRkPlxuICAgICAgICB7XG4gICAgICAgICAgKHRoaXMucHJvcHMudXAgPT0gXCJ1cFwiIHx8IHRoaXMucHJvcHMuYXBwbHlUb0FsbCkgP1xuICAgICAgICAgICAgKFxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImNvbXBvc2UtY29udHJvbCBpY29uIGljb24tZG9ja2VyLXN0b3BcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5wcm9wcy5vblN0b3BDbGlja30+PC9idXR0b24+XG4gICAgICAgICAgICApXG4gICAgICAgICAgOlxuICAgICAgICAgICAgdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgICAgPC90ZD5cbiAgICAgICAgPHRkPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiY29tcG9zZS1jb250cm9sIGljb24gaWNvbi1kb2NrZXItcm1cIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5wcm9wcy5vblJtQ2xpY2t9PjwvYnV0dG9uPlxuICAgICAgICA8L3RkPlxuICAgICAgICA8dGQ+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzTmFtZT1cImNvbXBvc2UtY29udHJvbFwiIGNoZWNrZWQ9e3RoaXMucHJvcHMuc2VsZWN0ZWR9IG9uQ2hhbmdlPXsoZXZlbnQpID0+IHt0aGlzLnByb3BzLm9uRmlsdGVyQ2hhbmdlKGV2ZW50LnRhcmdldC5jaGVja2VkKX19Lz5cbiAgICAgICAgPC90ZD5cbiAgICAgIDwvdHI+XG4gICAgKTtcbiAgfVxufSk7XG4iXX0=
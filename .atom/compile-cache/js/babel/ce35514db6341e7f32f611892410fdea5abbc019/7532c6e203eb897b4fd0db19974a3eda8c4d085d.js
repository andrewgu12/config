Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactForAtom = require('react-for-atom');

var _ansiToHtml = require('ansi-to-html');

var _ansiToHtml2 = _interopRequireDefault(_ansiToHtml);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _immutable = require('immutable');

'use babel';

exports['default'] = _reactForAtom.React.createClass({
  displayName: 'ServiceLogs',

  getInitialState: function getInitialState() {
    return {};
  },
  getDefaultProps: function getDefaultProps() {
    return {
      output: [],
      filters: [],
      reload: function reload() {},
      stop: function stop() {},
      clear: function clear() {}
    };
  },
  componentDidMount: function componentDidMount() {},
  componentDidUpdate: function componentDidUpdate(prevProps) {
    var _this = this;

    if (prevProps.filters != this.props.filters) {
      this.forceUpdate(function () {
        _this.scrollDown();
      });
    } else {
      this.manageScroll();
    }
  },
  componentWillUpdate: function componentWillUpdate() {
    this.scrolledDown = this.isScrolledDown();
  },
  isFiltered: function isFiltered(line) {
    var _this2 = this;

    if (this.props.filters.length == 0) return true;else {
      var splitedLine = line.substring(0, 40).split('|');
      if (splitedLine.length > 1) {
        var _ret = (function () {
          var service = splitedLine[0];
          return {
            v: _this2.props.filters.some(function (filter) {
              return service.indexOf(filter) != -1;
            })
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      } else {
        return true;
      }
    }
  },
  isScrolledDown: function isScrolledDown() {
    return this.logsContainer.scrollHeight - this.logsContainer.clientHeight == this.logsContainer.scrollTop;
  },
  scrollDown: function scrollDown() {
    this.logsContainer.scrollTop = this.logsContainer.scrollHeight - this.logsContainer.clientHeight;
  },
  manageScroll: function manageScroll() {
    if (this.scrolledDown) this.scrollDown();
  },
  getHTMLOutput: function getHTMLOutput(output) {
    var convert = new _ansiToHtml2['default']();
    return output.filter(this.isFiltered).map(function (str) {
      return convert.toHtml(str);
    }).join('<br>').concat('<br>');
  },
  render: function render() {
    var _this3 = this;

    return _reactForAtom.React.createElement(
      'div',
      { className: 'service-logs', style: { flexGrow: "1", padding: "15px", display: "flex", flexDirection: "column", flex: "2", position: 'relative' } },
      _reactForAtom.React.createElement('div', { style: { overflowY: "scroll", flexGrow: "1", paddingRight: "5px", whiteSpace: "nowrap" }, ref: function (ref) {
          return _this3.logsContainer = ref;
        }, dangerouslySetInnerHTML: { __html: this.getHTMLOutput(this.props.output) } }),
      _reactForAtom.React.createElement(
        'div',
        { style: { position: 'absolute', top: '5', right: '5' } },
        _reactForAtom.React.createElement(
          'button',
          { type: 'button', className: 'compose-control text', onClick: this.props.clear },
          'Clear'
        ),
        _reactForAtom.React.createElement(
          'button',
          { type: 'button', className: 'compose-control text', onClick: this.props.reload },
          'Reattach'
        ),
        _reactForAtom.React.createElement(
          'button',
          { type: 'button', className: 'compose-control text', onClick: this.props.stop },
          'Detach'
        )
      )
    );
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9TZXJ2aWNlTG9ncy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7NEJBRW9CLGdCQUFnQjs7MEJBQ2hCLGNBQWM7Ozs7NkJBQ1IsZUFBZTs7Ozt5QkFDcEIsV0FBVzs7QUFMaEMsV0FBVyxDQUFBOztxQkFPSSxvQkFBTSxXQUFXLENBQUM7OztBQUMvQixpQkFBZSxFQUFFLDJCQUFXO0FBQzFCLFdBQU8sRUFBRSxDQUFDO0dBQ1g7QUFDRCxpQkFBZSxFQUFFLDJCQUFXO0FBQzFCLFdBQU87QUFDTCxZQUFNLEVBQUUsRUFBRTtBQUNWLGFBQU8sRUFBRSxFQUFFO0FBQ1gsWUFBTSxFQUFFLGtCQUFXLEVBRWxCO0FBQ0QsVUFBSSxFQUFFLGdCQUFXLEVBRWhCO0FBQ0QsV0FBSyxFQUFFLGlCQUFXLEVBRWpCO0tBQ0YsQ0FBQztHQUNIO0FBQ0QsbUJBQWlCLEVBQUUsNkJBQVcsRUFFN0I7QUFDRCxvQkFBa0IsRUFBRSw0QkFBUyxTQUFTLEVBQUU7OztBQUN0QyxRQUFJLFNBQVMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7QUFDM0MsVUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQ3JCLGNBQUssVUFBVSxFQUFFLENBQUM7T0FDbkIsQ0FBQyxDQUFDO0tBQ0osTUFBTTtBQUNMLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQUNyQjtHQUNGO0FBQ0QscUJBQW1CLEVBQUUsK0JBQVc7QUFDOUIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7R0FDM0M7QUFDRCxZQUFVLEVBQUUsb0JBQVMsSUFBSSxFQUFFOzs7QUFDekIsUUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUNoQyxPQUFPLElBQUksQ0FBQyxLQUNUO0FBQ0gsVUFBSSxX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O0dBQ0g7Q0FDRixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9TZXJ2aWNlTG9ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7UmVhY3R9IGZyb20gJ3JlYWN0LWZvci1hdG9tJztcbmltcG9ydCBDb252ZXJ0IGZyb20gJ2Fuc2ktdG8taHRtbCc7XG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7ZnJvbUpTfSBmcm9tICdpbW11dGFibGUnO1xuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBvdXRwdXQ6IFtdLFxuICAgICAgZmlsdGVyczogW10sXG4gICAgICByZWxvYWQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB9LFxuICAgICAgc3RvcDogZnVuY3Rpb24oKSB7XG5cbiAgICAgIH0sXG4gICAgICBjbGVhcjogZnVuY3Rpb24oKSB7XG5cbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuXG4gIH0sXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24ocHJldlByb3BzKSB7XG4gICAgaWYgKHByZXZQcm9wcy5maWx0ZXJzICE9IHRoaXMucHJvcHMuZmlsdGVycykge1xuICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2Nyb2xsRG93bigpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWFuYWdlU2Nyb2xsKCk7XG4gICAgfVxuICB9LFxuICBjb21wb25lbnRXaWxsVXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNjcm9sbGVkRG93biA9IHRoaXMuaXNTY3JvbGxlZERvd24oKTtcbiAgfSxcbiAgaXNGaWx0ZXJlZDogZnVuY3Rpb24obGluZSkge1xuICAgIGlmICh0aGlzLnByb3BzLmZpbHRlcnMubGVuZ3RoID09IDApXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBlbHNlIHtcbiAgICAgIGxldCBzcGxpdGVkTGluZSA9IGxpbmUuc3Vic3RyaW5nKDAsIDQwKS5zcGxpdCgnfCcpO1xuICAgICAgaWYgKHNwbGl0ZWRMaW5lLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbGV0IHNlcnZpY2UgPSBzcGxpdGVkTGluZVswXTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZmlsdGVycy5zb21lKGZpbHRlciA9PiBzZXJ2aWNlLmluZGV4T2YoZmlsdGVyKSAhPSAtMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGlzU2Nyb2xsZWREb3duOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5sb2dzQ29udGFpbmVyLnNjcm9sbEhlaWdodCAtIHRoaXMubG9nc0NvbnRhaW5lci5jbGllbnRIZWlnaHQgPT0gdGhpcy5sb2dzQ29udGFpbmVyLnNjcm9sbFRvcDtcbiAgfSxcbiAgc2Nyb2xsRG93bjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2dzQ29udGFpbmVyLnNjcm9sbFRvcCA9IHRoaXMubG9nc0NvbnRhaW5lci5zY3JvbGxIZWlnaHQgLSB0aGlzLmxvZ3NDb250YWluZXIuY2xpZW50SGVpZ2h0O1xuICB9LFxuICBtYW5hZ2VTY3JvbGw6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNjcm9sbGVkRG93bilcbiAgICAgIHRoaXMuc2Nyb2xsRG93bigpO1xuICB9LFxuICBnZXRIVE1MT3V0cHV0OiBmdW5jdGlvbihvdXRwdXQpIHtcbiAgICB2YXIgY29udmVydCA9IG5ldyBDb252ZXJ0KCk7XG4gICAgcmV0dXJuIG91dHB1dFxuICAgICAgICAgICAgLmZpbHRlcih0aGlzLmlzRmlsdGVyZWQpXG4gICAgICAgICAgICAubWFwKChzdHIpID0+IGNvbnZlcnQudG9IdG1sKHN0cikpXG4gICAgICAgICAgICAuam9pbignPGJyPicpXG4gICAgICAgICAgICAuY29uY2F0KCc8YnI+Jyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VydmljZS1sb2dzXCIgc3R5bGU9e3tmbGV4R3JvdzogXCIxXCIsIHBhZGRpbmc6IFwiMTVweFwiLCBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgZmxleDogXCIyXCIsIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tvdmVyZmxvd1k6IFwic2Nyb2xsXCIsIGZsZXhHcm93OiBcIjFcIiwgcGFkZGluZ1JpZ2h0OiBcIjVweFwiLCB3aGl0ZVNwYWNlOiBcIm5vd3JhcFwifX0gcmVmPXsocmVmKSA9PiB0aGlzLmxvZ3NDb250YWluZXIgPSByZWZ9IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7X19odG1sOiB0aGlzLmdldEhUTUxPdXRwdXQodGhpcy5wcm9wcy5vdXRwdXQpfX0+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnNScsIHJpZ2h0OiAnNSd9fT5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjb21wb3NlLWNvbnRyb2wgdGV4dFwiIG9uQ2xpY2s9e3RoaXMucHJvcHMuY2xlYXJ9PkNsZWFyPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY29tcG9zZS1jb250cm9sIHRleHRcIiBvbkNsaWNrPXt0aGlzLnByb3BzLnJlbG9hZH0+UmVhdHRhY2g8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjb21wb3NlLWNvbnRyb2wgdGV4dFwiIG9uQ2xpY2s9e3RoaXMucHJvcHMuc3RvcH0+RGV0YWNoPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG4iXX0=
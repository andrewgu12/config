'use babel';

var _require = require('react-for-atom');

var React = _require.React;

var styles = {
  inputText: {
    width: "100%"
  }
};

module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    var _this = this;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        { className: 'title' },
        'Remote Tag'
      ),
      React.createElement('input', { type: 'text', ref: function (elem) {
          return _this.text = elem;
        }, className: 'native-key-bindings', style: styles.inputText, placeholder: 'Commit Message' })
    );
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9SZW1vdGVJbmZvc1Byb21wdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7O2VBQ0csT0FBTyxDQUFDLGdCQUFnQixDQUFDOztJQUFsQyxLQUFLLFlBQUwsS0FBSzs7QUFFVixJQUFJLE1BQU0sR0FBRztBQUNYLFdBQVMsRUFBRTtBQUNULFNBQUssRUFBRSxNQUFNO0dBQ2Q7Q0FDRixDQUFDOztBQUdGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBQ2pDLFFBQU0sRUFBRSxrQkFBVzs7O0FBQ2pCLFdBQ0U7OztNQUNFOztVQUFNLFNBQVMsRUFBQyxPQUFPOztPQUFrQjtNQUN6QywrQkFBTyxJQUFJLEVBQUMsTUFBTSxFQUFDLEdBQUcsRUFBRSxVQUFBLElBQUk7aUJBQUksTUFBSyxJQUFJLEdBQUcsSUFBSTtTQUFBLEFBQUMsRUFBQyxTQUFTLEVBQUMscUJBQXFCLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEFBQUMsRUFBQyxXQUFXLEVBQUMsZ0JBQWdCLEdBQUU7S0FDckksQ0FDTjtHQUNIO0NBQ0YsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2RvY2tlci9saWIvY29tcG9uZW50cy9SZW1vdGVJbmZvc1Byb21wdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG52YXIge1JlYWN0fSA9IHJlcXVpcmUoJ3JlYWN0LWZvci1hdG9tJyk7XG5cbnZhciBzdHlsZXMgPSB7XG4gIGlucHV0VGV4dDoge1xuICAgIHdpZHRoOiBcIjEwMCVcIlxuICB9LFxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGl0bGVcIj5SZW1vdGUgVGFnPC9zcGFuPlxuICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiByZWY9e2VsZW0gPT4gdGhpcy50ZXh0ID0gZWxlbX0gY2xhc3NOYW1lPVwibmF0aXZlLWtleS1iaW5kaW5nc1wiIHN0eWxlPXtzdHlsZXMuaW5wdXRUZXh0fSBwbGFjZWhvbGRlcj1cIkNvbW1pdCBNZXNzYWdlXCIvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG4iXX0=
/** @babel */

module.exports = {
	getGuideColumn: function getGuideColumn() {
		var editor = this.editor;
		var maxLineLength = this.editorconfig.settings.max_line_length;

		if (maxLineLength === 'auto') {
			return this.getNativeGuideColumn(editor.getPath(), editor.getGrammar().scopeName);
		}
		return maxLineLength;
	}
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9saWIvd3JhcGd1aWRlLWludGVyY2VwdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNoQixlQUFjLEVBQUEsMEJBQUc7QUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMzQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUM7O0FBRWpFLE1BQUksYUFBYSxLQUFLLE1BQU0sRUFBRTtBQUM3QixVQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ2xGO0FBQ0QsU0FBTyxhQUFhLENBQUM7RUFDckI7Q0FDRCxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9taW5nYm8vY29uZmlnLy5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9saWIvd3JhcGd1aWRlLWludGVyY2VwdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Z2V0R3VpZGVDb2x1bW4oKSB7XG5cdFx0Y29uc3QgZWRpdG9yID0gdGhpcy5lZGl0b3I7XG5cdFx0Y29uc3QgbWF4TGluZUxlbmd0aCA9IHRoaXMuZWRpdG9yY29uZmlnLnNldHRpbmdzLm1heF9saW5lX2xlbmd0aDtcblxuXHRcdGlmIChtYXhMaW5lTGVuZ3RoID09PSAnYXV0bycpIHtcblx0XHRcdHJldHVybiB0aGlzLmdldE5hdGl2ZUd1aWRlQ29sdW1uKGVkaXRvci5nZXRQYXRoKCksIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKTtcblx0XHR9XG5cdFx0cmV0dXJuIG1heExpbmVMZW5ndGg7XG5cdH1cbn07XG4iXX0=
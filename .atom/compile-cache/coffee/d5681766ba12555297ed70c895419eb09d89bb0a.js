(function() {
  var root, showTabBarInTreeView, tabsInTreeView;

  root = document.documentElement;

  tabsInTreeView = root.querySelector('.list-inline.tab-bar.inset-panel');

  module.exports = {
    activate: function(state) {
      return atom.config.observe('city-lights-ui.showTabsInTreeView', function(newValue) {
        return showTabBarInTreeView(newValue);
      });
    }
  };

  showTabBarInTreeView = function(boolean) {
    if (boolean) {
      return tabsInTreeView.style.display = 'flex';
    } else {
      return tabsInTreeView.style.display = 'none';
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL21pbmdiby9jb25maWcvLmF0b20vcGFja2FnZXMvY2l0eS1saWdodHMtdWkvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDOztFQUNoQixjQUFBLEdBQWlCLElBQUksQ0FBQyxhQUFMLENBQW1CLGtDQUFuQjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7YUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsbUNBQXBCLEVBQXlELFNBQUMsUUFBRDtlQUN2RCxvQkFBQSxDQUFxQixRQUFyQjtNQUR1RCxDQUF6RDtJQURRLENBQVY7OztFQUlGLG9CQUFBLEdBQXVCLFNBQUMsT0FBRDtJQUNyQixJQUFHLE9BQUg7YUFDRSxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQXJCLEdBQStCLE9BRGpDO0tBQUEsTUFBQTthQUdFLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBckIsR0FBK0IsT0FIakM7O0VBRHFCO0FBUnZCIiwic291cmNlc0NvbnRlbnQiOlsicm9vdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxudGFic0luVHJlZVZpZXcgPSByb290LnF1ZXJ5U2VsZWN0b3IgJy5saXN0LWlubGluZS50YWItYmFyLmluc2V0LXBhbmVsJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnY2l0eS1saWdodHMtdWkuc2hvd1RhYnNJblRyZWVWaWV3JywgKG5ld1ZhbHVlKSAtPlxuICAgICAgc2hvd1RhYkJhckluVHJlZVZpZXcobmV3VmFsdWUpXG5cbnNob3dUYWJCYXJJblRyZWVWaWV3ID0gKGJvb2xlYW4pIC0+XG4gIGlmIGJvb2xlYW5cbiAgICB0YWJzSW5UcmVlVmlldy5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnXG4gIGVsc2VcbiAgICB0YWJzSW5UcmVlVmlldy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnXG4iXX0=

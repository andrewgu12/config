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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL21pbmdiby8uYXRvbS9wYWNrYWdlcy9jaXR5LWxpZ2h0cy11aS9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxRQUFRLENBQUM7O0VBQ2hCLGNBQUEsR0FBaUIsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsa0NBQW5COztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDthQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixtQ0FBcEIsRUFBeUQsU0FBQyxRQUFEO2VBQ3ZELG9CQUFBLENBQXFCLFFBQXJCO01BRHVELENBQXpEO0lBRFEsQ0FBVjs7O0VBSUYsb0JBQUEsR0FBdUIsU0FBQyxPQUFEO0lBQ3JCLElBQUcsT0FBSDthQUNFLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBckIsR0FBK0IsT0FEakM7S0FBQSxNQUFBO2FBR0UsY0FBYyxDQUFDLEtBQUssQ0FBQyxPQUFyQixHQUErQixPQUhqQzs7RUFEcUI7QUFSdkIiLCJzb3VyY2VzQ29udGVudCI6WyJyb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG50YWJzSW5UcmVlVmlldyA9IHJvb3QucXVlcnlTZWxlY3RvciAnLmxpc3QtaW5saW5lLnRhYi1iYXIuaW5zZXQtcGFuZWwnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICdjaXR5LWxpZ2h0cy11aS5zaG93VGFic0luVHJlZVZpZXcnLCAobmV3VmFsdWUpIC0+XG4gICAgICBzaG93VGFiQmFySW5UcmVlVmlldyhuZXdWYWx1ZSlcblxuc2hvd1RhYkJhckluVHJlZVZpZXcgPSAoYm9vbGVhbikgLT5cbiAgaWYgYm9vbGVhblxuICAgIHRhYnNJblRyZWVWaWV3LnN0eWxlLmRpc3BsYXkgPSAnZmxleCdcbiAgZWxzZVxuICAgIHRhYnNJblRyZWVWaWV3LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSdcbiJdfQ==

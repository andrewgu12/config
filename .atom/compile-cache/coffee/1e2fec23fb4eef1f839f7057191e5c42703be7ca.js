(function() {
  var ColorScanner, countLines;

  countLines = null;

  module.exports = ColorScanner = (function() {
    function ColorScanner(arg) {
      this.context = (arg != null ? arg : {}).context;
      this.parser = this.context.parser;
      this.registry = this.context.registry;
    }

    ColorScanner.prototype.getRegExp = function() {
      return new RegExp(this.registry.getRegExp(), 'g');
    };

    ColorScanner.prototype.getRegExpForScope = function(scope) {
      return new RegExp(this.registry.getRegExpForScope(scope), 'g');
    };

    ColorScanner.prototype.search = function(text, scope, start) {
      var color, index, lastIndex, match, matchText, regexp;
      if (start == null) {
        start = 0;
      }
      if (countLines == null) {
        countLines = require('./utils').countLines;
      }
      regexp = this.getRegExpForScope(scope);
      regexp.lastIndex = start;
      if (match = regexp.exec(text)) {
        matchText = match[0];
        lastIndex = regexp.lastIndex;
        color = this.parser.parse(matchText, scope);
        if ((index = matchText.indexOf(color.colorExpression)) > 0) {
          lastIndex += -matchText.length + index + color.colorExpression.length;
          matchText = color.colorExpression;
        }
        return {
          color: color,
          match: matchText,
          lastIndex: lastIndex,
          range: [lastIndex - matchText.length, lastIndex],
          line: countLines(text.slice(0, +(lastIndex - matchText.length) + 1 || 9e9)) - 1
        };
      }
    };

    return ColorScanner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL21pbmdiby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3Itc2Nhbm5lci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFVBQUEsR0FBYTs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1Msc0JBQUMsR0FBRDtNQUFFLElBQUMsQ0FBQSx5QkFBRixNQUFXLElBQVQ7TUFDZCxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUM7TUFDbkIsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsT0FBTyxDQUFDO0lBRlY7OzJCQUliLFNBQUEsR0FBVyxTQUFBO2FBQ1QsSUFBSSxNQUFKLENBQVcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLENBQUEsQ0FBWCxFQUFrQyxHQUFsQztJQURTOzsyQkFHWCxpQkFBQSxHQUFtQixTQUFDLEtBQUQ7YUFDakIsSUFBSSxNQUFKLENBQVcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxpQkFBVixDQUE0QixLQUE1QixDQUFYLEVBQStDLEdBQS9DO0lBRGlCOzsyQkFHbkIsTUFBQSxHQUFRLFNBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYyxLQUFkO0FBQ04sVUFBQTs7UUFEb0IsUUFBTTs7TUFDMUIsSUFBd0Msa0JBQXhDO1FBQUMsYUFBYyxPQUFBLENBQVEsU0FBUixhQUFmOztNQUVBLE1BQUEsR0FBUyxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsS0FBbkI7TUFDVCxNQUFNLENBQUMsU0FBUCxHQUFtQjtNQUVuQixJQUFHLEtBQUEsR0FBUSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBWDtRQUNHLFlBQWE7UUFDYixZQUFhO1FBRWQsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFjLFNBQWQsRUFBeUIsS0FBekI7UUFJUixJQUFHLENBQUMsS0FBQSxHQUFRLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEtBQUssQ0FBQyxlQUF4QixDQUFULENBQUEsR0FBcUQsQ0FBeEQ7VUFDRSxTQUFBLElBQWEsQ0FBQyxTQUFTLENBQUMsTUFBWCxHQUFvQixLQUFwQixHQUE0QixLQUFLLENBQUMsZUFBZSxDQUFDO1VBQy9ELFNBQUEsR0FBWSxLQUFLLENBQUMsZ0JBRnBCOztlQUlBO1VBQUEsS0FBQSxFQUFPLEtBQVA7VUFDQSxLQUFBLEVBQU8sU0FEUDtVQUVBLFNBQUEsRUFBVyxTQUZYO1VBR0EsS0FBQSxFQUFPLENBQ0wsU0FBQSxHQUFZLFNBQVMsQ0FBQyxNQURqQixFQUVMLFNBRkssQ0FIUDtVQU9BLElBQUEsRUFBTSxVQUFBLENBQVcsSUFBSyxxREFBaEIsQ0FBQSxHQUFvRCxDQVAxRDtVQVpGOztJQU5NOzs7OztBQWRWIiwic291cmNlc0NvbnRlbnQiOlsiY291bnRMaW5lcyA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ29sb3JTY2FubmVyXG4gIGNvbnN0cnVjdG9yOiAoe0Bjb250ZXh0fT17fSkgLT5cbiAgICBAcGFyc2VyID0gQGNvbnRleHQucGFyc2VyXG4gICAgQHJlZ2lzdHJ5ID0gQGNvbnRleHQucmVnaXN0cnlcblxuICBnZXRSZWdFeHA6IC0+XG4gICAgbmV3IFJlZ0V4cChAcmVnaXN0cnkuZ2V0UmVnRXhwKCksICdnJylcblxuICBnZXRSZWdFeHBGb3JTY29wZTogKHNjb3BlKSAtPlxuICAgIG5ldyBSZWdFeHAoQHJlZ2lzdHJ5LmdldFJlZ0V4cEZvclNjb3BlKHNjb3BlKSwgJ2cnKVxuXG4gIHNlYXJjaDogKHRleHQsIHNjb3BlLCBzdGFydD0wKSAtPlxuICAgIHtjb3VudExpbmVzfSA9IHJlcXVpcmUgJy4vdXRpbHMnIHVubGVzcyBjb3VudExpbmVzP1xuXG4gICAgcmVnZXhwID0gQGdldFJlZ0V4cEZvclNjb3BlKHNjb3BlKVxuICAgIHJlZ2V4cC5sYXN0SW5kZXggPSBzdGFydFxuXG4gICAgaWYgbWF0Y2ggPSByZWdleHAuZXhlYyh0ZXh0KVxuICAgICAgW21hdGNoVGV4dF0gPSBtYXRjaFxuICAgICAge2xhc3RJbmRleH0gPSByZWdleHBcblxuICAgICAgY29sb3IgPSBAcGFyc2VyLnBhcnNlKG1hdGNoVGV4dCwgc2NvcGUpXG5cbiAgICAgICMgcmV0dXJuIHVubGVzcyBjb2xvcj9cblxuICAgICAgaWYgKGluZGV4ID0gbWF0Y2hUZXh0LmluZGV4T2YoY29sb3IuY29sb3JFeHByZXNzaW9uKSkgPiAwXG4gICAgICAgIGxhc3RJbmRleCArPSAtbWF0Y2hUZXh0Lmxlbmd0aCArIGluZGV4ICsgY29sb3IuY29sb3JFeHByZXNzaW9uLmxlbmd0aFxuICAgICAgICBtYXRjaFRleHQgPSBjb2xvci5jb2xvckV4cHJlc3Npb25cblxuICAgICAgY29sb3I6IGNvbG9yXG4gICAgICBtYXRjaDogbWF0Y2hUZXh0XG4gICAgICBsYXN0SW5kZXg6IGxhc3RJbmRleFxuICAgICAgcmFuZ2U6IFtcbiAgICAgICAgbGFzdEluZGV4IC0gbWF0Y2hUZXh0Lmxlbmd0aFxuICAgICAgICBsYXN0SW5kZXhcbiAgICAgIF1cbiAgICAgIGxpbmU6IGNvdW50TGluZXModGV4dFswLi5sYXN0SW5kZXggLSBtYXRjaFRleHQubGVuZ3RoXSkgLSAxXG4iXX0=

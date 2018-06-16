(function() {
  var ExpressionsRegistry, PathScanner, VariableExpression, VariableScanner, async, fs;

  async = require('async');

  fs = require('fs');

  VariableScanner = require('../variable-scanner');

  VariableExpression = require('../variable-expression');

  ExpressionsRegistry = require('../expressions-registry');

  PathScanner = (function() {
    function PathScanner(filePath, scope, registry) {
      this.filePath = filePath;
      this.scanner = new VariableScanner({
        registry: registry,
        scope: scope
      });
    }

    PathScanner.prototype.load = function(done) {
      var currentChunk, currentLine, currentOffset, lastIndex, line, readStream, results;
      currentChunk = '';
      currentLine = 0;
      currentOffset = 0;
      lastIndex = 0;
      line = 0;
      results = [];
      readStream = fs.createReadStream(this.filePath);
      readStream.on('data', (function(_this) {
        return function(chunk) {
          var i, index, lastLine, len, result, v;
          currentChunk += chunk.toString();
          index = lastIndex;
          while (result = _this.scanner.search(currentChunk, lastIndex)) {
            result.range[0] += index;
            result.range[1] += index;
            for (i = 0, len = result.length; i < len; i++) {
              v = result[i];
              v.path = _this.filePath;
              v.range[0] += index;
              v.range[1] += index;
              v.definitionRange = result.range;
              v.line += line;
              lastLine = v.line;
            }
            results = results.concat(result);
            lastIndex = result.lastIndex;
          }
          if (result != null) {
            currentChunk = currentChunk.slice(lastIndex);
            line = lastLine;
            return lastIndex = 0;
          }
        };
      })(this));
      return readStream.on('end', function() {
        emit('scan-paths:path-scanned', results);
        return done();
      });
    };

    return PathScanner;

  })();

  module.exports = function(arg) {
    var paths, registry;
    paths = arg[0], registry = arg[1];
    registry = ExpressionsRegistry.deserialize(registry, VariableExpression);
    return async.each(paths, function(arg1, next) {
      var p, s;
      p = arg1[0], s = arg1[1];
      return new PathScanner(p, s, registry).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL21pbmdiby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdGFza3Mvc2Nhbi1wYXRocy1oYW5kbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztFQUNSLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUjs7RUFDbEIsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSOztFQUNyQixtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVI7O0VBRWhCO0lBQ1MscUJBQUMsUUFBRCxFQUFZLEtBQVosRUFBbUIsUUFBbkI7TUFBQyxJQUFDLENBQUEsV0FBRDtNQUNaLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxlQUFKLENBQW9CO1FBQUMsVUFBQSxRQUFEO1FBQVcsT0FBQSxLQUFYO09BQXBCO0lBREE7OzBCQUdiLElBQUEsR0FBTSxTQUFDLElBQUQ7QUFDSixVQUFBO01BQUEsWUFBQSxHQUFlO01BQ2YsV0FBQSxHQUFjO01BQ2QsYUFBQSxHQUFnQjtNQUNoQixTQUFBLEdBQVk7TUFDWixJQUFBLEdBQU87TUFDUCxPQUFBLEdBQVU7TUFFVixVQUFBLEdBQWEsRUFBRSxDQUFDLGdCQUFILENBQW9CLElBQUMsQ0FBQSxRQUFyQjtNQUViLFVBQVUsQ0FBQyxFQUFYLENBQWMsTUFBZCxFQUFzQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtBQUNwQixjQUFBO1VBQUEsWUFBQSxJQUFnQixLQUFLLENBQUMsUUFBTixDQUFBO1VBRWhCLEtBQUEsR0FBUTtBQUVSLGlCQUFNLE1BQUEsR0FBUyxLQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsWUFBaEIsRUFBOEIsU0FBOUIsQ0FBZjtZQUNFLE1BQU0sQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFiLElBQW1CO1lBQ25CLE1BQU0sQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFiLElBQW1CO0FBRW5CLGlCQUFBLHdDQUFBOztjQUNFLENBQUMsQ0FBQyxJQUFGLEdBQVMsS0FBQyxDQUFBO2NBQ1YsQ0FBQyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQVIsSUFBYztjQUNkLENBQUMsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFSLElBQWM7Y0FDZCxDQUFDLENBQUMsZUFBRixHQUFvQixNQUFNLENBQUM7Y0FDM0IsQ0FBQyxDQUFDLElBQUYsSUFBVTtjQUNWLFFBQUEsR0FBVyxDQUFDLENBQUM7QUFOZjtZQVFBLE9BQUEsR0FBVSxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWY7WUFDVCxZQUFhO1VBYmhCO1VBZUEsSUFBRyxjQUFIO1lBQ0UsWUFBQSxHQUFlLFlBQWE7WUFDNUIsSUFBQSxHQUFPO21CQUNQLFNBQUEsR0FBWSxFQUhkOztRQXBCb0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCO2FBeUJBLFVBQVUsQ0FBQyxFQUFYLENBQWMsS0FBZCxFQUFxQixTQUFBO1FBQ25CLElBQUEsQ0FBSyx5QkFBTCxFQUFnQyxPQUFoQztlQUNBLElBQUEsQ0FBQTtNQUZtQixDQUFyQjtJQW5DSTs7Ozs7O0VBdUNSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsR0FBRDtBQUNmLFFBQUE7SUFEaUIsZ0JBQU87SUFDeEIsUUFBQSxHQUFXLG1CQUFtQixDQUFDLFdBQXBCLENBQWdDLFFBQWhDLEVBQTBDLGtCQUExQztXQUNYLEtBQUssQ0FBQyxJQUFOLENBQ0UsS0FERixFQUVFLFNBQUMsSUFBRCxFQUFTLElBQVQ7QUFDRSxVQUFBO01BREEsYUFBRzthQUNILElBQUksV0FBSixDQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixRQUF0QixDQUErQixDQUFDLElBQWhDLENBQXFDLElBQXJDO0lBREYsQ0FGRixFQUlFLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FKRjtFQUZlO0FBakRqQiIsInNvdXJjZXNDb250ZW50IjpbImFzeW5jID0gcmVxdWlyZSAnYXN5bmMnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xuVmFyaWFibGVTY2FubmVyID0gcmVxdWlyZSAnLi4vdmFyaWFibGUtc2Nhbm5lcidcblZhcmlhYmxlRXhwcmVzc2lvbiA9IHJlcXVpcmUgJy4uL3ZhcmlhYmxlLWV4cHJlc3Npb24nXG5FeHByZXNzaW9uc1JlZ2lzdHJ5ID0gcmVxdWlyZSAnLi4vZXhwcmVzc2lvbnMtcmVnaXN0cnknXG5cbmNsYXNzIFBhdGhTY2FubmVyXG4gIGNvbnN0cnVjdG9yOiAoQGZpbGVQYXRoLCBzY29wZSwgcmVnaXN0cnkpIC0+XG4gICAgQHNjYW5uZXIgPSBuZXcgVmFyaWFibGVTY2FubmVyKHtyZWdpc3RyeSwgc2NvcGV9KVxuXG4gIGxvYWQ6IChkb25lKSAtPlxuICAgIGN1cnJlbnRDaHVuayA9ICcnXG4gICAgY3VycmVudExpbmUgPSAwXG4gICAgY3VycmVudE9mZnNldCA9IDBcbiAgICBsYXN0SW5kZXggPSAwXG4gICAgbGluZSA9IDBcbiAgICByZXN1bHRzID0gW11cblxuICAgIHJlYWRTdHJlYW0gPSBmcy5jcmVhdGVSZWFkU3RyZWFtKEBmaWxlUGF0aClcblxuICAgIHJlYWRTdHJlYW0ub24gJ2RhdGEnLCAoY2h1bmspID0+XG4gICAgICBjdXJyZW50Q2h1bmsgKz0gY2h1bmsudG9TdHJpbmcoKVxuXG4gICAgICBpbmRleCA9IGxhc3RJbmRleFxuXG4gICAgICB3aGlsZSByZXN1bHQgPSBAc2Nhbm5lci5zZWFyY2goY3VycmVudENodW5rLCBsYXN0SW5kZXgpXG4gICAgICAgIHJlc3VsdC5yYW5nZVswXSArPSBpbmRleFxuICAgICAgICByZXN1bHQucmFuZ2VbMV0gKz0gaW5kZXhcblxuICAgICAgICBmb3IgdiBpbiByZXN1bHRcbiAgICAgICAgICB2LnBhdGggPSBAZmlsZVBhdGhcbiAgICAgICAgICB2LnJhbmdlWzBdICs9IGluZGV4XG4gICAgICAgICAgdi5yYW5nZVsxXSArPSBpbmRleFxuICAgICAgICAgIHYuZGVmaW5pdGlvblJhbmdlID0gcmVzdWx0LnJhbmdlXG4gICAgICAgICAgdi5saW5lICs9IGxpbmVcbiAgICAgICAgICBsYXN0TGluZSA9IHYubGluZVxuXG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdChyZXN1bHQpXG4gICAgICAgIHtsYXN0SW5kZXh9ID0gcmVzdWx0XG5cbiAgICAgIGlmIHJlc3VsdD9cbiAgICAgICAgY3VycmVudENodW5rID0gY3VycmVudENodW5rW2xhc3RJbmRleC4uLTFdXG4gICAgICAgIGxpbmUgPSBsYXN0TGluZVxuICAgICAgICBsYXN0SW5kZXggPSAwXG5cbiAgICByZWFkU3RyZWFtLm9uICdlbmQnLCAtPlxuICAgICAgZW1pdCgnc2Nhbi1wYXRoczpwYXRoLXNjYW5uZWQnLCByZXN1bHRzKVxuICAgICAgZG9uZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gKFtwYXRocywgcmVnaXN0cnldKSAtPlxuICByZWdpc3RyeSA9IEV4cHJlc3Npb25zUmVnaXN0cnkuZGVzZXJpYWxpemUocmVnaXN0cnksIFZhcmlhYmxlRXhwcmVzc2lvbilcbiAgYXN5bmMuZWFjaChcbiAgICBwYXRocyxcbiAgICAoW3AsIHNdLCBuZXh0KSAtPlxuICAgICAgbmV3IFBhdGhTY2FubmVyKHAsIHMsIHJlZ2lzdHJ5KS5sb2FkKG5leHQpXG4gICAgQGFzeW5jKClcbiAgKVxuIl19

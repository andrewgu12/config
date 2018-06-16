(function() {
  var Emitter, ExpressionsRegistry, ref, vm,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], Emitter = ref[0], vm = ref[1];

  module.exports = ExpressionsRegistry = (function() {
    ExpressionsRegistry.deserialize = function(serializedData, expressionsType) {
      var data, handle, name, ref1, registry;
      if (vm == null) {
        vm = require('vm');
      }
      registry = new ExpressionsRegistry(expressionsType);
      ref1 = serializedData.expressions;
      for (name in ref1) {
        data = ref1[name];
        handle = vm.runInNewContext(data.handle.replace('function', "handle = function"), {
          console: console,
          require: require
        });
        registry.createExpression(name, data.regexpString, data.priority, data.scopes, handle);
      }
      registry.regexpStrings['none'] = serializedData.regexpString;
      return registry;
    };

    function ExpressionsRegistry(expressionsType1) {
      this.expressionsType = expressionsType1;
      if (Emitter == null) {
        Emitter = require('event-kit').Emitter;
      }
      this.colorExpressions = {};
      this.emitter = new Emitter;
      this.regexpStrings = {};
    }

    ExpressionsRegistry.prototype.dispose = function() {
      return this.emitter.dispose();
    };

    ExpressionsRegistry.prototype.onDidAddExpression = function(callback) {
      return this.emitter.on('did-add-expression', callback);
    };

    ExpressionsRegistry.prototype.onDidRemoveExpression = function(callback) {
      return this.emitter.on('did-remove-expression', callback);
    };

    ExpressionsRegistry.prototype.onDidUpdateExpressions = function(callback) {
      return this.emitter.on('did-update-expressions', callback);
    };

    ExpressionsRegistry.prototype.getExpressions = function() {
      var e, k;
      return ((function() {
        var ref1, results;
        ref1 = this.colorExpressions;
        results = [];
        for (k in ref1) {
          e = ref1[k];
          results.push(e);
        }
        return results;
      }).call(this)).sort(function(a, b) {
        return b.priority - a.priority;
      });
    };

    ExpressionsRegistry.prototype.getExpressionsForScope = function(scope) {
      var expressions, matchScope;
      expressions = this.getExpressions();
      if (scope === '*') {
        return expressions;
      }
      matchScope = function(a) {
        return function(b) {
          var aa, ab, ba, bb, ref1, ref2;
          ref1 = a.split(':'), aa = ref1[0], ab = ref1[1];
          ref2 = b.split(':'), ba = ref2[0], bb = ref2[1];
          return aa === ba && ((ab == null) || (bb == null) || ab === bb);
        };
      };
      return expressions.filter(function(e) {
        return indexOf.call(e.scopes, '*') >= 0 || e.scopes.some(matchScope(scope));
      });
    };

    ExpressionsRegistry.prototype.getExpression = function(name) {
      return this.colorExpressions[name];
    };

    ExpressionsRegistry.prototype.getRegExp = function() {
      var base;
      return (base = this.regexpStrings)['none'] != null ? base['none'] : base['none'] = this.getExpressions().map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.getRegExpForScope = function(scope) {
      var base;
      return (base = this.regexpStrings)[scope] != null ? base[scope] : base[scope] = this.getExpressionsForScope(scope).map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.createExpression = function(name, regexpString, priority, scopes, handle) {
      var newExpression;
      if (priority == null) {
        priority = 0;
      }
      if (scopes == null) {
        scopes = ['*'];
      }
      if (typeof priority === 'function') {
        handle = priority;
        scopes = ['*'];
        priority = 0;
      } else if (typeof priority === 'object') {
        if (typeof scopes === 'function') {
          handle = scopes;
        }
        scopes = priority;
        priority = 0;
      }
      if (!(scopes.length === 1 && scopes[0] === '*')) {
        scopes.push('pigments');
      }
      newExpression = new this.expressionsType({
        name: name,
        regexpString: regexpString,
        scopes: scopes,
        priority: priority,
        handle: handle
      });
      return this.addExpression(newExpression);
    };

    ExpressionsRegistry.prototype.addExpression = function(expression, batch) {
      if (batch == null) {
        batch = false;
      }
      this.regexpStrings = {};
      this.colorExpressions[expression.name] = expression;
      if (!batch) {
        this.emitter.emit('did-add-expression', {
          name: expression.name,
          registry: this
        });
        this.emitter.emit('did-update-expressions', {
          name: expression.name,
          registry: this
        });
      }
      return expression;
    };

    ExpressionsRegistry.prototype.createExpressions = function(expressions) {
      return this.addExpressions(expressions.map((function(_this) {
        return function(e) {
          var expression, handle, name, priority, regexpString, scopes;
          name = e.name, regexpString = e.regexpString, handle = e.handle, priority = e.priority, scopes = e.scopes;
          if (priority == null) {
            priority = 0;
          }
          expression = new _this.expressionsType({
            name: name,
            regexpString: regexpString,
            scopes: scopes,
            handle: handle
          });
          expression.priority = priority;
          return expression;
        };
      })(this)));
    };

    ExpressionsRegistry.prototype.addExpressions = function(expressions) {
      var expression, i, len;
      for (i = 0, len = expressions.length; i < len; i++) {
        expression = expressions[i];
        this.addExpression(expression, true);
        this.emitter.emit('did-add-expression', {
          name: expression.name,
          registry: this
        });
      }
      return this.emitter.emit('did-update-expressions', {
        registry: this
      });
    };

    ExpressionsRegistry.prototype.removeExpression = function(name) {
      delete this.colorExpressions[name];
      this.regexpStrings = {};
      this.emitter.emit('did-remove-expression', {
        name: name,
        registry: this
      });
      return this.emitter.emit('did-update-expressions', {
        name: name,
        registry: this
      });
    };

    ExpressionsRegistry.prototype.serialize = function() {
      var expression, key, out, ref1, ref2;
      out = {
        regexpString: this.getRegExp(),
        expressions: {}
      };
      ref1 = this.colorExpressions;
      for (key in ref1) {
        expression = ref1[key];
        out.expressions[key] = {
          name: expression.name,
          regexpString: expression.regexpString,
          priority: expression.priority,
          scopes: expression.scopes,
          handle: (ref2 = expression.handle) != null ? ref2.toString() : void 0
        };
      }
      return out;
    };

    return ExpressionsRegistry;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL21pbmdiby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvZXhwcmVzc2lvbnMtcmVnaXN0cnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxxQ0FBQTtJQUFBOztFQUFBLE1BQWdCLEVBQWhCLEVBQUMsZ0JBQUQsRUFBVTs7RUFFVixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ0osbUJBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxjQUFELEVBQWlCLGVBQWpCO0FBQ1osVUFBQTs7UUFBQSxLQUFNLE9BQUEsQ0FBUSxJQUFSOztNQUVOLFFBQUEsR0FBVyxJQUFJLG1CQUFKLENBQXdCLGVBQXhCO0FBRVg7QUFBQSxXQUFBLFlBQUE7O1FBQ0UsTUFBQSxHQUFTLEVBQUUsQ0FBQyxlQUFILENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixVQUFwQixFQUFnQyxtQkFBaEMsQ0FBbkIsRUFBeUU7VUFBQyxTQUFBLE9BQUQ7VUFBVSxTQUFBLE9BQVY7U0FBekU7UUFDVCxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsSUFBMUIsRUFBZ0MsSUFBSSxDQUFDLFlBQXJDLEVBQW1ELElBQUksQ0FBQyxRQUF4RCxFQUFrRSxJQUFJLENBQUMsTUFBdkUsRUFBK0UsTUFBL0U7QUFGRjtNQUlBLFFBQVEsQ0FBQyxhQUFjLENBQUEsTUFBQSxDQUF2QixHQUFpQyxjQUFjLENBQUM7YUFFaEQ7SUFYWTs7SUFjRCw2QkFBQyxnQkFBRDtNQUFDLElBQUMsQ0FBQSxrQkFBRDs7UUFDWixVQUFXLE9BQUEsQ0FBUSxXQUFSLENBQW9CLENBQUM7O01BRWhDLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtNQUNwQixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFDZixJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUxOOztrQ0FPYixPQUFBLEdBQVMsU0FBQTthQUNQLElBQUMsQ0FBQSxPQUFPLENB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VSxDQUFDLElBQWpCO1VBQ0EsWUFBQSxFQUFjLFVBQVUsQ0FBQyxZQUR6QjtVQUVBLFFBQUEsRUFBVSxVQUFVLENBQUMsUUFGckI7VUFHQSxNQUFBLEVBQVEsVUFBVSxDQUFDLE1BSG5CO1VBSUEsTUFBQSwyQ0FBeUIsQ0FBRSxRQUFuQixDQUFBLFVBSlI7O0FBRko7YUFRQTtJQWJTOzs7OztBQTVHYiIsInNvdXJjZXNDb250ZW50IjpbIltFbWl0dGVyLCB2bV0gPSBbXVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBFeHByZXNzaW9uc1JlZ2lzdHJ5XG4gIEBkZXNlcmlhbGl6ZTogKHNlcmlhbGl6ZWREYXRhLCBleHByZXNzaW9uc1R5cGUpIC0+XG4gICAgdm0gPz0gcmVxdWlyZSAndm0nXG5cbiAgICByZWdpc3RyeSA9IG5ldyBFeHByZXNzaW9uc1JlZ2lzdHJ5KGV4cHJlc3Npb25zVHlwZSlcblxuICAgIGZvciBuYW1lLCBkYXRhIG9mIHNlcmlhbGl6ZWREYXRhLmV4cHJlc3Npb25zXG4gICAgICBoYW5kbGUgPSB2bS5ydW5Jbk5ld0NvbnRleHQoZGF0YS5oYW5kbGUucmVwbGFjZSgnZnVuY3Rpb24nLCBcImhhbmRsZSA9IGZ1bmN0aW9uXCIpLCB7Y29uc29sZSwgcmVxdWlyZX0pXG4gICAgICByZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uKG5hbWUsIGRhdGEucmVnZXhwU3RyaW5nLCBkYXRhLnByaW9yaXR5LCBkYXRhLnNjb3BlcywgaGFuZGxlKVxuXG4gICAgcmVnaXN0cnkucmVnZXhwU3RyaW5nc1snbm9uZSddID0gc2VyaWFsaXplZERhdGEucmVnZXhwU3RyaW5nXG5cbiAgICByZWdpc3RyeVxuXG4gICMgVGhlIHtPYmplY3R9IHdoZXJlIGNvbG9yIGV4cHJlc3Npb24gaGFuZGxlcnMgYXJlIHN0b3JlZFxuICBjb25zdHJ1Y3RvcjogKEBleHByZXNzaW9uc1R5cGUpIC0+XG4gICAgRW1pdHRlciA/PSByZXF1aXJlKCdldmVudC1raXQnKS5FbWl0dGVyXG5cbiAgICBAY29sb3JFeHByZXNzaW9ucyA9IHt9XG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEByZWdleHBTdHJpbmdzID0ge31cblxuICBkaXNwb3NlOiAtPlxuICAgIEBlbWl0dGVyLmRpc3Bvc2UoKVxuXG4gIG9uRGlkQWRkRXhwcmVzc2lvbjogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtYWRkLWV4cHJlc3Npb24nLCBjYWxsYmFja1xuXG4gIG9uRGlkUmVtb3ZlRXhwcmVzc2lvbjogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtcmVtb3ZlLWV4cHJlc3Npb24nLCBjYWxsYmFja1xuXG4gIG9uRGlkVXBkYXRlRXhwcmVzc2lvbnM6IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIGNhbGxiYWNrXG5cbiAgZ2V0RXhwcmVzc2lvbnM6IC0+XG4gICAgKGUgZm9yIGssZSBvZiBAY29sb3JFeHByZXNzaW9ucykuc29ydCgoYSxiKSAtPiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eSlcblxuICBnZXRFeHByZXNzaW9uc0ZvclNjb3BlOiAoc2NvcGUpIC0+XG4gICAgZXhwcmVzc2lvbnMgPSBAZ2V0RXhwcmVzc2lvbnMoKVxuXG4gICAgcmV0dXJuIGV4cHJlc3Npb25zIGlmIHNjb3BlIGlzICcqJ1xuXG4gICAgbWF0Y2hTY29wZSA9IChhKSAtPiAoYikgLT5cbiAgICAgIFthYSwgYWJdID0gYS5zcGxpdCgnOicpXG4gICAgICBbYmEsIGJiXSA9IGIuc3BsaXQoJzonKVxuXG4gICAgICBhYSBpcyBiYSBhbmQgKG5vdCBhYj8gb3Igbm90IGJiPyBvciBhYiBpcyBiYilcblxuICAgIGV4cHJlc3Npb25zLmZpbHRlciAoZSkgLT5cbiAgICAgICcqJyBpbiBlLnNjb3BlcyBvciBlLnNjb3Blcy5zb21lKG1hdGNoU2NvcGUoc2NvcGUpKVxuXG4gIGdldEV4cHJlc3Npb246IChuYW1lKSAtPiBAY29sb3JFeHByZXNzaW9uc1tuYW1lXVxuXG4gIGdldFJlZ0V4cDogLT5cbiAgICBAcmVnZXhwU3RyaW5nc1snbm9uZSddID89IEBnZXRFeHByZXNzaW9ucygpLm1hcCgoZSkgLT5cbiAgICAgIFwiKCN7ZS5yZWdleHBTdHJpbmd9KVwiKS5qb2luKCd8JylcblxuICBnZXRSZWdFeHBGb3JTY29wZTogKHNjb3BlKSAtPlxuICAgIEByZWdleHBTdHJpbmdzW3Njb3BlXSA/PSBAZ2V0RXhwcmVzc2lvbnNGb3JTY29wZShzY29wZSkubWFwKChlKSAtPlxuICAgICAgXCIoI3tlLnJlZ2V4cFN0cmluZ30pXCIpLmpvaW4oJ3wnKVxuXG4gIGNyZWF0ZUV4cHJlc3Npb246IChuYW1lLCByZWdleHBTdHJpbmcsIHByaW9yaXR5PTAsIHNjb3Blcz1bJyonXSwgaGFuZGxlKSAtPlxuICAgIGlmIHR5cGVvZiBwcmlvcml0eSBpcyAnZnVuY3Rpb24nXG4gICAgICBoYW5kbGUgPSBwcmlvcml0eVxuICAgICAgc2NvcGVzID0gWycqJ11cbiAgICAgIHByaW9yaXR5ID0gMFxuICAgIGVsc2UgaWYgdHlwZW9mIHByaW9yaXR5IGlzICdvYmplY3QnXG4gICAgICBoYW5kbGUgPSBzY29wZXMgaWYgdHlwZW9mIHNjb3BlcyBpcyAnZnVuY3Rpb24nXG4gICAgICBzY29wZXMgPSBwcmlvcml0eVxuICAgICAgcHJpb3JpdHkgPSAwXG5cbiAgICBzY29wZXMucHVzaCgncGlnbWVudHMnKSB1bmxlc3Mgc2NvcGVzLmxlbmd0aCBpcyAxIGFuZCBzY29wZXNbMF0gaXMgJyonXG5cbiAgICBuZXdFeHByZXNzaW9uID0gbmV3IEBleHByZXNzaW9uc1R5cGUoe25hbWUsIHJlZ2V4cFN0cmluZywgc2NvcGVzLCBwcmlvcml0eSwgaGFuZGxlfSlcbiAgICBAYWRkRXhwcmVzc2lvbiBuZXdFeHByZXNzaW9uXG5cbiAgYWRkRXhwcmVzc2lvbjogKGV4cHJlc3Npb24sIGJhdGNoPWZhbHNlKSAtPlxuICAgIEByZWdleHBTdHJpbmdzID0ge31cbiAgICBAY29sb3JFeHByZXNzaW9uc1tleHByZXNzaW9uLm5hbWVdID0gZXhwcmVzc2lvblxuXG4gICAgdW5sZXNzIGJhdGNoXG4gICAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLWV4cHJlc3Npb24nLCB7bmFtZTogZXhwcmVzc2lvbi5uYW1lLCByZWdpc3RyeTogdGhpc31cbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC11cGRhdGUtZXhwcmVzc2lvbnMnLCB7bmFtZTogZXhwcmVzc2lvbi5uYW1lLCByZWdpc3RyeTogdGhpc31cbiAgICBleHByZXNzaW9uXG5cbiAgY3JlYXRlRXhwcmVzc2lvbnM6IChleHByZXNzaW9ucykgLT5cbiAgICBAYWRkRXhwcmVzc2lvbnMgZXhwcmVzc2lvbnMubWFwIChlKSA9PlxuICAgICAge25hbWUsIHJlZ2V4cFN0cmluZywgaGFuZGxlLCBwcmlvcml0eSwgc2NvcGVzfSA9IGVcbiAgICAgIHByaW9yaXR5ID89IDBcbiAgICAgIGV4cHJlc3Npb24gPSBuZXcgQGV4cHJlc3Npb25zVHlwZSh7bmFtZSwgcmVnZXhwU3RyaW5nLCBzY29wZXMsIGhhbmRsZX0pXG4gICAgICBleHByZXNzaW9uLnByaW9yaXR5ID0gcHJpb3JpdHlcbiAgICAgIGV4cHJlc3Npb25cblxuICBhZGRFeHByZXNzaW9uczogKGV4cHJlc3Npb25zKSAtPlxuICAgIGZvciBleHByZXNzaW9uIGluIGV4cHJlc3Npb25zXG4gICAgICBAYWRkRXhwcmVzc2lvbihleHByZXNzaW9uLCB0cnVlKVxuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC1leHByZXNzaW9uJywge25hbWU6IGV4cHJlc3Npb24ubmFtZSwgcmVnaXN0cnk6IHRoaXN9XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1leHByZXNzaW9ucycsIHtyZWdpc3RyeTogdGhpc31cblxuICByZW1vdmVFeHByZXNzaW9uOiAobmFtZSkgLT5cbiAgICBkZWxldGUgQGNvbG9yRXhwcmVzc2lvbnNbbmFtZV1cbiAgICBAcmVnZXhwU3RyaW5ncyA9IHt9XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXJlbW92ZS1leHByZXNzaW9uJywge25hbWUsIHJlZ2lzdHJ5OiB0aGlzfVxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC11cGRhdGUtZXhwcmVzc2lvbnMnLCB7bmFtZSwgcmVnaXN0cnk6IHRoaXN9XG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIG91dCA9XG4gICAgICByZWdleHBTdHJpbmc6IEBnZXRSZWdFeHAoKVxuICAgICAgZXhwcmVzc2lvbnM6IHt9XG5cbiAgICBmb3Iga2V5LCBleHByZXNzaW9uIG9mIEBjb2xvckV4cHJlc3Npb25zXG4gICAgICBvdXQuZXhwcmVzc2lvbnNba2V5XSA9XG4gICAgICAgIG5hbWU6IGV4cHJlc3Npb24ubmFtZVxuICAgICAgICByZWdleHBTdHJpbmc6IGV4cHJlc3Npb24ucmVnZXhwU3RyaW5nXG4gICAgICAgIHByaW9yaXR5OiBleHByZXNzaW9uLnByaW9yaXR5XG4gICAgICAgIHNjb3BlczogZXhwcmVzc2lvbi5zY29wZXNcbiAgICAgICAgaGFuZGxlOiBleHByZXNzaW9uLmhhbmRsZT8udG9TdHJpbmcoKVxuXG4gICAgb3V0XG4iXX0=

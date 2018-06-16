(function() {
  var Color, ColorBuffer, ColorMarker, CompositeDisposable, Emitter, Range, Task, VariablesCollection, fs, ref,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = [], Color = ref[0], ColorMarker = ref[1], VariablesCollection = ref[2], Emitter = ref[3], CompositeDisposable = ref[4], Task = ref[5], Range = ref[6], fs = ref[7];

  module.exports = ColorBuffer = (function() {
    function ColorBuffer(params) {
      var colorMarkers, ref1, saveSubscription, tokenized;
      if (params == null) {
        params = {};
      }
      if (Emitter == null) {
        ref1 = require('atom'), Emitter = ref1.Emitter, CompositeDisposable = ref1.CompositeDisposable, Task = ref1.Task, Range = ref1.Range;
      }
      this.editor = params.editor, this.project = params.project, colorMarkers = params.colorMarkers;
      this.id = this.editor.id;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.ignoredScopes = [];
      this.colorMarkersByMarkerId = {};
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      tokenized = (function(_this) {
        return function() {
          var ref2;
          return (ref2 = _this.getColorMarkers()) != null ? ref2.forEach(function(marker) {
            return marker.checkMarkerScope(true);
          }) : void 0;
        };
      })(this);
      if (this.editor.onDidTokenize != null) {
        this.subscriptions.add(this.editor.onDidTokenize(tokenized));
      } else {
        this.subscriptions.add(this.editor.displayBuffer.onDidTokenize(tokenized));
      }
      this.subscriptions.add(this.editor.onDidChange((function(_this) {
        return function() {
          if (_this.initialized && _this.variableInitialized) {
            _this.terminateRunningTask();
          }
          if (_this.timeout != null) {
            return clearTimeout(_this.timeout);
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.delayBeforeScan === 0) {
            return _this.update();
          } else {
            if (_this.timeout != null) {
              clearTimeout(_this.timeout);
            }
            return _this.timeout = setTimeout(function() {
              _this.update();
              return _this.timeout = null;
            }, _this.delayBeforeScan);
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangePath((function(_this) {
        return function(path) {
          if (_this.isVariablesSource()) {
            _this.project.appendPath(path);
          }
          return _this.update();
        };
      })(this)));
      if ((this.project.getPaths() != null) && this.isVariablesSource() && !this.project.hasPath(this.editor.getPath())) {
        if (fs == null) {
          fs = require('fs');
        }
        if (fs.existsSync(this.editor.getPath())) {
          this.project.appendPath(this.editor.getPath());
        } else {
          saveSubscription = this.editor.onDidSave((function(_this) {
            return function(arg) {
              var path;
              path = arg.path;
              _this.project.appendPath(path);
              _this.update();
              saveSubscription.dispose();
              return _this.subscriptions.remove(saveSubscription);
            };
          })(this));
          this.subscriptions.add(saveSubscription);
        }
      }
      this.subscriptions.add(this.project.onDidUpdateVariables((function(_this) {
        return function() {
          if (!_this.variableInitialized) {
            return;
          }
          return _this.scanBufferForColors().then(function(results) {
            return _this.updateColorMarkers(results);
          });
        };
      })(this)));
      this.subscriptions.add(this.project.onDidChangeIgnoredScopes((function(_this) {
        return function() {
          return _this.updateIgnoredScopes();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.delayBeforeScan', (function(_this) {
        return function(delayBeforeScan) {
          _this.delayBeforeScan = delayBeforeScan != null ? delayBeforeScan : 0;
        };
      })(this)));
      if (this.editor.addMarkerLayer != null) {
        this.markerLayer = this.editor.addMarkerLayer();
      } else {
        this.markerLayer = this.editor;
      }
      if (colorMarkers != null) {
        this.restoreMarkersState(colorMarkers);
        this.cleanUnusedTextEditorMarkers();
      }
      this.updateIgnoredScopes();
      this.initialize();
    }

    ColorBuffer.prototype.onDidUpdateColorMarkers = function(callback) {
      return this.emitter.on('did-update-color-markers', callback);
    };

    ColorBuffer.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    ColorBuffer.prototype.initialize = function() {
      if (this.colorMarkers != null) {
        return Promise.resolve();
      }
      if (this.initializePromise != null) {
        return this.initializePromise;
      }
      this.updateVariableRanges();
      this.initializePromise = this.scanBufferForColors().then((function(_this) {
        return function(results) {
          return _this.createColorMarkers(results);
        };
      })(this)).then((function(_this) {
        return function(results) {
          _this.colorMarkers = results;
          return _this.initialized = true;
        };
      })(this));
      this.initializePromise.then((function(_this) {
        return function() {
          return _this.variablesAvailable();
        };
      })(this));
      return this.initializePromise;
    };

    ColorBuffer.prototype.restoreMarkersState = function(colorMarkers) {
      if (Color == null) {
        Color = require('./color');
      }
      if (ColorMarker == null) {
        ColorMarker = require('./color-marker');
      }
      this.updateVariableRanges();
      return this.colorMarkers = colorMarkers.filter(function(state) {
        return state != null;
      }).map((function(_this) {
        return function(state) {
          var color, marker, ref1;
          marker = (ref1 = _this.editor.getMarker(state.markerId)) != null ? ref1 : _this.markerLayer.markBufferRange(state.bufferRange, {
            invalidate: 'touch'
          });
          color = new Color(state.color);
          color.variables = state.variables;
          color.invalid = state.invalid;
          return _this.colorMarkersByMarkerId[marker.id] = new ColorMarker({
            marker: marker,
            color: color,
            text: state.text,
            colorBuffer: _this
          });
        };
      })(this));
    };

    ColorBuffer.prototype.cleanUnusedTextEditorMarkers = function() {
      return this.markerLayer.findMarkers().forEach((function(_this) {
        return function(m) {
          if (_this.colorMarkersByMarkerId[m.id] == null) {
            return m.destroy();
          }
        };
      })(this));
    };

    ColorBuffer.prototype.variablesAvailable = function() {
      if (this.variablesPromise != null) {
        return this.variablesPromise;
      }
      return this.variablesPromise = this.project.initialize().then((function(_this) {
        return function(results) {
          if (_this.destroyed) {
            return;
          }
          if (results == null) {
            return;
          }
          if (_this.isIgnored() && _this.isVariablesSource()) {
            return _this.scanBufferForVariables();
          }
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.scanBufferForColors({
            variables: results
          });
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.updateColorMarkers(results);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.variableInitialized = true;
        };
      })(this))["catch"](function(reason) {
        return console.log(reason);
      });
    };

    ColorBuffer.prototype.update = function() {
      var promise;
      this.terminateRunningTask();
      promise = this.isIgnored() ? this.scanBufferForVariables() : !this.isVariablesSource() ? Promise.resolve([]) : this.project.reloadVariablesForPath(this.editor.getPath());
      return promise.then((function(_this) {
        return function(results) {
          return _this.scanBufferForColors({
            variables: results
          });
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.updateColorMarkers(results);
        };
      })(this))["catch"](function(reason) {
        return console.log(reason);
      });
    };

    ColorBuffer.prototype.terminateRunningTask = function() {
      var ref1;
      return (ref1 = this.task) != null ? ref1.terminate() : void 0;
    };

    ColorBuffer.prototype.destroy = function() {
      var ref1;
      if (this.destroyed) {
        return;
      }
      this.terminateRunningTask();
      this.subscriptions.dispose();
      if ((ref1 = this.colorMarkers) != null) {
        ref1.forEach(function(marker) {
          return marker.destroy();
        });
      }
      this.destroyed = true;
      this.emitter.emit('did-destroy');
      return this.emitter.dispose();
    };

    ColorBuffer.prototype.isVariablesSource = function() {
      return this.project.isVariablesSourcePath(this.editor.getPath());
    };

    ColorBuffer.prototype.isIgnored = function() {
      var p;
      p = this.editor.getPath();
      return this.project.isIgnoredPath(p) || !atom.project.contains(p);
    };

    ColorBuffer.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    ColorBuffer.prototype.getPath = function() {
      return this.editor.getPath();
    };

    ColorBuffer.prototype.getScope = function() {
      return this.project.scopeFromFileName(this.getPath());
    };

    ColorBuffer.prototype.updateIgnoredScopes = function() {
      var ref1;
      this.ignoredScopes = this.project.getIgnoredScopes().map(function(scope) {
        try {
          return new RegExp(scope);
        } catch (error) {}
      }).filter(function(re) {
        return re != null;
      });
      if ((ref1 = this.getColorMarkers()) != null) {
        ref1.forEach(function(marker) {
          return marker.checkMarkerScope(true);
        });
      }
      return this.emitter.emit('did-update-color-markers', {
        created: [],
        destroyed: []
      });
    };

    ColorBuffer.prototype.updateVariableRanges = function() {
      var variablesForBuffer;
      variablesForBuffer = this.project.getVariablesForPath(this.editor.getPath());
      return variablesForBuffer.forEach((function(_this) {
        return function(variable) {
          return variable.bufferRange != null ? variable.bufferRange : variable.bufferRange = Range.fromObject([_this.editor.getBuffer().positionForCharacterIndex(variable.range[0]), _this.editor.getBuffer().positionForCharacterIndex(variable.range[1])]);
        };
      })(this));
    };

    ColorBuffer.prototype.scanBufferForVariables = function() {
      var buffer, config, editor, results, taskPath;
      if (this.destroyed) {
        return Promise.reject("This ColorBuffer is already destroyed");
      }
      if (!this.editor.getPath()) {
        return Promise.resolve([]);
      }
      results = [];
      taskPath = require.resolve('./tasks/scan-buffer-variables-handler');
      editor = this.editor;
      buffer = this.editor.getBuffer();
      config = {
        buffer: this.editor.getText(),
        registry: this.project.getVariableExpressionsRegistry().serialize(),
        scope: this.getScope()
      };
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this.task = Task.once(taskPath, config, function() {
            _this.task = null;
            return resolve(results);
          });
          return _this.task.on('scan-buffer:variables-found', function(variables) {
            return results = results.concat(variables.map(function(variable) {
              variable.path = editor.getPath();
              variable.bufferRange = Range.fromObject([buffer.positionForCharacterIndex(variable.range[0]), buffer.positionForCharacterIndex(variable.range[1])]);
              return variable;
            }));
          });
        };
      })(this));
    };

    ColorBuffer.prototype.getMarkerLayer = function() {
      return this.markerLayer;
    };

    ColorBuffer.prototype.getColorMarkers = function() {
      return this.colorMarkers;
    };

    ColorBuffer.prototype.getValidColorMarkers = function() {
      var ref1, ref2;
      return (ref1 = (ref2 = this.getColorMarkers()) != null ? ref2.filter(function(m) {
        var ref3;
        return ((ref3 = m.color) != null ? ref3.isValid() : void 0) && !m.isIgnored();
      }) : void 0) != null ? ref1 : [];
    };

    ColorBuffer.prototype.getColorMarkerAtBufferPosition = function(bufferPosition) {
      var i, len, marker, markers;
      markers = this.markerLayer.findMarkers({
        containsBufferPosition: bufferPosition
      });
      for (i = 0, len = markers.length; i < len; i++) {
        marker = markers[i];
        if (this.colorMarkersByMarkerId[marker.id] != null) {
          return this.colorMarkersByMarkerId[marker.id];
        }
      }
    };

    ColorBuffer.prototype.createColorMarkers = function(results) {
      if (this.destroyed) {
        return Promise.resolve([]);
      }
      if (ColorMarker == null) {
        ColorMarker = require('./color-marker');
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var newResults, processResults;
          newResults = [];
          processResults = function() {
            var marker, result, startDate;
            startDate = new Date;
            if (_this.editor.isDestroyed()) {
              return resolve([]);
            }
            while (results.length) {
              result = results.shift();
              marker = _this.markerLayer.markBufferRange(result.bufferRange, {
                invalidate: 'touch'
              });
              newResults.push(_this.colorMarkersByMarkerId[marker.id] = new ColorMarker({
                marker: marker,
                color: result.color,
                text: result.match,
                colorBuffer: _this
              }));
              if (new Date() - startDate > 10) {
                requestAnimationFrame(processResults);
                return;
              }
            }
            return resolve(newResults);
          };
          return processResults();
        };
      })(this));
    };

    ColorBuffer.prototype.findExistingMarkers = function(results) {
      var newMarkers, toCreate;
      newMarkers = [];
      toCreate = [];
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var processResults;
          processResults = function() {
            var marker, result, startDate;
            startDate = new Date;
            while (results.length) {
              result = results.shift();
              if (marker = _this.findColorMarker(result)) {
                newMarkers.push(marker);
              } else {
                toCreate.push(result);
              }
              if (new Date() - startDate > 10) {
                requestAnimationFrame(processResults);
                return;
              }
            }
            return resolve({
              newMarkers: newMarkers,
              toCreate: toCreate
            });
          };
          return processResults();
        };
      })(this));
    };

    ColorBuffer.prototype.updateColorMarkers = function(results) {
      var createdMarkers, newMarkers;
      newMarkers = null;
      createdMarkers = null;
      return this.findExistingMarkers(results).then((function(_this) {
        return function(arg) {
          var markers, toCreate;
          markers = arg.newMarkers, toCreate = arg.toCreate;
          newMarkers = markers;
          return _this.createColorMarkers(toCreate);
        };
      })(this)).then((function(_this) {
        return function(results) {
          var toDestroy;
          createdMarkers = results;
          newMarkers = newMarkers.concat(results);
          if (_this.colorMarkers != null) {
            toDestroy = _this.colorMarkers.filter(function(marker) {
              return indexOf.call(newMarkers, marker) < 0;
            });
            toDestroy.forEach(function(marker) {
              delete _this.colorMarkersByMarkerId[marker.id];
              return marker.destroy();
            });
          } else {
            toDestroy = [];
          }
          _this.colorMarkers = newMarkers;
          return _this.emitter.emit('did-update-color-markers', {
            created: createdMarkers,
            destroyed: toDestroy
          });
        };
      })(this));
    };

    ColorBuffer.prototype.findColorMarker = function(properties) {
      var i, len, marker, ref1;
      if (properties == null) {
        properties = {};
      }
      if (this.colorMarkers == null) {
        return;
      }
      ref1 = this.colorMarkers;
      for (i = 0, len = ref1.length; i < len; i++) {
        marker = ref1[i];
        if (marker != null ? marker.match(properties) : void 0) {
          return marker;
        }
      }
    };

    ColorBuffer.prototype.findColorMarkers = function(properties) {
      var markers;
      if (properties == null) {
        properties = {};
      }
      markers = this.markerLayer.findMarkers(properties);
      return markers.map((function(_this) {
        return function(marker) {
          return _this.colorMarkersByMarkerId[marker.id];
        };
      })(this)).filter(function(marker) {
        return marker != null;
      });
    };

    ColorBuffer.prototype.findValidColorMarkers = function(properties) {
      return this.findColorMarkers(properties).filter((function(_this) {
        return function(marker) {
          var ref1;
          return (marker != null) && ((ref1 = marker.color) != null ? ref1.isValid() : void 0) && !(marker != null ? marker.isIgnored() : void 0);
        };
      })(this));
    };

    ColorBuffer.prototype.selectColorMarkerAndOpenPicker = function(colorMarker) {
      var ref1;
      if (this.destroyed) {
        return;
      }
      this.editor.setSelectedBufferRange(colorMarker.marker.getBufferRange());
      if (!((ref1 = this.editor.getSelectedText()) != null ? ref1.match(/^#[0-9a-fA-F]{3,8}$/) : void 0)) {
        return;
      }
      if (this.project.colorPickerAPI != null) {
        return this.project.colorPickerAPI.open(this.editor, this.editor.getLastCursor());
      }
    };

    ColorBuffer.prototype.scanBufferForColors = function(options) {
      var buffer, collection, config, ref1, ref2, ref3, ref4, ref5, registry, results, taskPath, variables;
      if (options == null) {
        options = {};
      }
      if (this.destroyed) {
        return Promise.reject("This ColorBuffer is already destroyed");
      }
      if (Color == null) {
        Color = require('./color');
      }
      results = [];
      taskPath = require.resolve('./tasks/scan-buffer-colors-handler');
      buffer = this.editor.getBuffer();
      registry = this.project.getColorExpressionsRegistry().serialize();
      if (options.variables != null) {
        if (VariablesCollection == null) {
          VariablesCollection = require('./variables-collection');
        }
        collection = new VariablesCollection();
        collection.addMany(options.variables);
        options.variables = collection;
      }
      variables = this.isVariablesSource() ? ((ref2 = (ref3 = options.variables) != null ? ref3.getVariables() : void 0) != null ? ref2 : []).concat((ref1 = this.project.getVariables()) != null ? ref1 : []) : (ref4 = (ref5 = options.variables) != null ? ref5.getVariables() : void 0) != null ? ref4 : [];
      delete registry.expressions['pigments:variables'];
      delete registry.regexpString;
      config = {
        buffer: this.editor.getText(),
        bufferPath: this.getPath(),
        scope: this.getScope(),
        variables: variables,
        colorVariables: variables.filter(function(v) {
          return v.isColor;
        }),
        registry: registry
      };
      return new Promise((function(_this) {
        return function(resolve, reject) {
          _this.task = Task.once(taskPath, config, function() {
            _this.task = null;
            return resolve(results);
          });
          return _this.task.on('scan-buffer:colors-found', function(colors) {
            return results = results.concat(colors.map(function(res) {
              res.color = new Color(res.color);
              res.bufferRange = Range.fromObject([buffer.positionForCharacterIndex(res.range[0]), buffer.positionForCharacterIndex(res.range[1])]);
              return res;
            }));
          });
        };
      })(this));
    };

    ColorBuffer.prototype.serialize = function() {
      var ref1;
      return {
        id: this.id,
        path: this.editor.getPath(),
        colorMarkers: (ref1 = this.colorMarkers) != null ? ref1.map(function(marker) {
          return marker.serialize();
        }) : void 0
      };
    };

    return ColorBuffer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL21pbmdiby8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItYnVmZmVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsd0dBQUE7SUFBQTs7RUFBQSxNQUlJLEVBSkosRUFDRSxjQURGLEVBQ1Msb0JBRFQsRUFDc0IsNEJBRHRCLEVBRUUsZ0JBRkYsRUFFVyw0QkFGWCxFQUVnQyxhQUZoQyxFQUVzQyxjQUZ0QyxFQUdFOztFQUdGLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxxQkFBQyxNQUFEO0FBQ1gsVUFBQTs7UUFEWSxTQUFPOztNQUNuQixJQUFPLGVBQVA7UUFDRSxPQUE4QyxPQUFBLENBQVEsTUFBUixDQUE5QyxFQUFDLHNCQUFELEVBQVUsOENBQVYsRUFBK0IsZ0JBQS9CLEVBQXFDLG1CQUR2Qzs7TUFHQyxJQUFDLENBQUEsZ0JBQUEsTUFBRixFQUFVLElBQUMsQ0FBQSxpQkFBQSxPQUFYLEVBQW9CO01BQ25CLElBQUMsQ0FBQSxLQUFNLElBQUMsQ0FBQSxPQUFQO01BQ0YsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsYUFBRCxHQUFlO01BRWYsSUFBQyxDQUFBLHNCQUFELEdBQTBCO01BRTFCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxPQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckIsQ0FBbkI7TUFFQSxTQUFBLEdBQVksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ1YsY0FBQTtnRUFBa0IsQ0FBRSxPQUFwQixDQUE0QixTQUFDLE1BQUQ7bUJBQzFCLE1BQU0sQ0FBQyxnQkFB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QVI7VUFGRixDQUhNO2lCQVFSLEtBQUMsQ0FBQSxJQUFJLENBQUMsRUFBTixDQUFTLDBCQUFULEVBQXFDLFNBQUMsTUFBRDttQkFDbkMsT0FBQSxHQUFVLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBTSxDQUFDLEdBQVAsQ0FBVyxTQUFDLEdBQUQ7Y0FDbEMsR0FBRyxDQUFDLEtBQUosR0FBWSxJQUFJLEtBQUosQ0FBVSxHQUFHLENBQUMsS0FBZDtjQUNaLEdBQUcsQ0FBQyxXQUFKLEdBQWtCLEtBQUssQ0FBQyxVQUFOLENBQWlCLENBQ2pDLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxHQUFHLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBM0MsQ0FEaUMsRUFFakMsTUFBTSxDQUFDLHlCQUFQLENBQWlDLEdBQUcsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUEzQyxDQUZpQyxDQUFqQjtxQkFJbEI7WUFOa0MsQ0FBWCxDQUFmO1VBRHlCLENBQXJDO1FBVFU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVo7SUF0Q21COzswQkF3RHJCLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTthQUFBO1FBQ0csSUFBRCxJQUFDLENBQUEsRUFESDtRQUVFLElBQUEsRUFBTSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxDQUZSO1FBR0UsWUFBQSwyQ0FBMkIsQ0FBRSxHQUFmLENBQW1CLFNBQUMsTUFBRDtpQkFDL0IsTUFBTSxDQUFDLFNBQVAsQ0FBQTtRQUQrQixDQUFuQixVQUhoQjs7SUFEUzs7Ozs7QUF6YmIiLCJzb3VyY2VzQ29udGVudCI6WyJbXG4gIENvbG9yLCBDb2xvck1hcmtlciwgVmFyaWFibGVzQ29sbGVjdGlvbixcbiAgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgVGFzaywgUmFuZ2UsXG4gIGZzXG5dID0gW11cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ29sb3JCdWZmZXJcbiAgY29uc3RydWN0b3I6IChwYXJhbXM9e30pIC0+XG4gICAgdW5sZXNzIEVtaXR0ZXI/XG4gICAgICB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgVGFzaywgUmFuZ2V9ID0gcmVxdWlyZSAnYXRvbSdcblxuICAgIHtAZWRpdG9yLCBAcHJvamVjdCwgY29sb3JNYXJrZXJzfSA9IHBhcmFtc1xuICAgIHtAaWR9ID0gQGVkaXRvclxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXJcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGlnbm9yZWRTY29wZXM9W11cblxuICAgIEBjb2xvck1hcmtlcnNCeU1hcmtlcklkID0ge31cblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAZWRpdG9yLm9uRGlkRGVzdHJveSA9PiBAZGVzdHJveSgpXG5cbiAgICB0b2tlbml6ZWQgPSA9PlxuICAgICAgQGdldENvbG9yTWFya2VycygpPy5mb3JFYWNoIChtYXJrZXIpIC0+XG4gICAgICAgIG1hcmtlci5jaGVja01hcmtlclNjb3BlKHRydWUpXG5cbiAgICBpZiBAZWRpdG9yLm9uRGlkVG9rZW5pemU/XG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZFRva2VuaXplKHRva2VuaXplZClcbiAgICBlbHNlXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5kaXNwbGF5QnVmZmVyLm9uRGlkVG9rZW5pemUodG9rZW5pemVkKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBlZGl0b3Iub25EaWRDaGFuZ2UgPT5cbiAgICAgIEB0ZXJtaW5hdGVSdW5uaW5nVGFzaygpIGlmIEBpbml0aWFsaXplZCBhbmQgQHZhcmlhYmxlSW5pdGlhbGl6ZWRcbiAgICAgIGNsZWFyVGltZW91dChAdGltZW91dCkgaWYgQHRpbWVvdXQ/XG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZyA9PlxuICAgICAgaWYgQGRlbGF5QmVmb3JlU2NhbiBpcyAwXG4gICAgICAgIEB1cGRhdGUoKVxuICAgICAgZWxzZVxuICAgICAgICBjbGVhclRpbWVvdXQoQHRpbWVvdXQpIGlmIEB0aW1lb3V0P1xuICAgICAgICBAdGltZW91dCA9IHNldFRpbWVvdXQgPT5cbiAgICAgICAgICBAdXBkYXRlKClcbiAgICAgICAgICBAdGltZW91dCA9IG51bGxcbiAgICAgICAgLCBAZGVsYXlCZWZvcmVTY2FuXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5vbkRpZENoYW5nZVBhdGggKHBhdGgpID0+XG4gICAgICBAcHJvamVjdC5hcHBlbmRQYXRoKHBhdGgpIGlmIEBpc1ZhcmlhYmxlc1NvdXJjZSgpXG4gICAgICBAdXBkYXRlKClcblxuICAgIGlmIEBwcm9qZWN0LmdldFBhdGhzKCk/IGFuZCBAaXNWYXJpYWJsZXNTb3VyY2UoKSBhbmQgIUBwcm9qZWN0Lmhhc1BhdGgoQGVkaXRvci5nZXRQYXRoKCkpXG4gICAgICBmcyA/PSByZXF1aXJlICdmcydcblxuICAgICAgaWYgZnMuZXhpc3RzU3luYyhAZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgICAgQHByb2plY3QuYXBwZW5kUGF0aChAZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgIGVsc2VcbiAgICAgICAgc2F2ZVN1YnNjcmlwdGlvbiA9IEBlZGl0b3Iub25EaWRTYXZlICh7cGF0aH0pID0+XG4gICAgICAgICAgQHByb2plY3QuYXBwZW5kUGF0aChwYXRoKVxuICAgICAgICAgIEB1cGRhdGUoKVxuICAgICAgICAgIHNhdmVTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICAgICAgQHN1YnNjcmlwdGlvbnMucmVtb3ZlKHNhdmVTdWJzY3JpcHRpb24pXG5cbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkKHNhdmVTdWJzY3JpcHRpb24pXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHByb2plY3Qub25EaWRVcGRhdGVWYXJpYWJsZXMgPT5cbiAgICAgIHJldHVybiB1bmxlc3MgQHZhcmlhYmxlSW5pdGlhbGl6ZWRcbiAgICAgIEBzY2FuQnVmZmVyRm9yQ29sb3JzKCkudGhlbiAocmVzdWx0cykgPT4gQHVwZGF0ZUNvbG9yTWFya2VycyhyZXN1bHRzKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBwcm9qZWN0Lm9uRGlkQ2hhbmdlSWdub3JlZFNjb3BlcyA9PlxuICAgICAgQHVwZGF0ZUlnbm9yZWRTY29wZXMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3BpZ21lbnRzLmRlbGF5QmVmb3JlU2NhbicsIChAZGVsYXlCZWZvcmVTY2FuPTApID0+XG5cbiAgICBpZiBAZWRpdG9yLmFkZE1hcmtlckxheWVyP1xuICAgICAgQG1hcmtlckxheWVyID0gQGVkaXRvci5hZGRNYXJrZXJMYXllcigpXG4gICAgZWxzZVxuICAgICAgQG1hcmtlckxheWVyID0gQGVkaXRvclxuXG4gICAgaWYgY29sb3JNYXJrZXJzP1xuICAgICAgQHJlc3RvcmVNYXJrZXJzU3RhdGUoY29sb3JNYXJrZXJzKVxuICAgICAgQGNsZWFuVW51c2VkVGV4dEVkaXRvck1hcmtlcnMoKVxuXG4gICAgQHVwZGF0ZUlnbm9yZWRTY29wZXMoKVxuICAgIEBpbml0aWFsaXplKClcblxuICBvbkRpZFVwZGF0ZUNvbG9yTWFya2VyczogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtdXBkYXRlLWNvbG9yLW1hcmtlcnMnLCBjYWxsYmFja1xuXG4gIG9uRGlkRGVzdHJveTogKGNhbGxiYWNrKSAtPlxuICAgIEBlbWl0dGVyLm9uICdkaWQtZGVzdHJveScsIGNhbGxiYWNrXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkgaWYgQGNvbG9yTWFya2Vycz9cbiAgICByZXR1cm4gQGluaXRpYWxpemVQcm9taXNlIGlmIEBpbml0aWFsaXplUHJvbWlzZT9cblxuICAgIEB1cGRhdGVWYXJpYWJsZVJhbmdlcygpXG5cbiAgICBAaW5pdGlhbGl6ZVByb21pc2UgPSBAc2NhbkJ1ZmZlckZvckNvbG9ycygpLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBAY3JlYXRlQ29sb3JNYXJrZXJzKHJlc3VsdHMpXG4gICAgLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBAY29sb3JNYXJrZXJzID0gcmVzdWx0c1xuICAgICAgQGluaXRpYWxpemVkID0gdHJ1ZVxuXG4gICAgQGluaXRpYWxpemVQcm9taXNlLnRoZW4gPT4gQHZhcmlhYmxlc0F2YWlsYWJsZSgpXG5cbiAgICBAaW5pdGlhbGl6ZVByb21pc2VcblxuICByZXN0b3JlTWFya2Vyc1N0YXRlOiAoY29sb3JNYXJrZXJzKSAtPlxuICAgIENvbG9yID89IHJlcXVpcmUgJy4vY29sb3InXG4gICAgQ29sb3JNYXJrZXIgPz0gcmVxdWlyZSAnLi9jb2xvci1tYXJrZXInXG5cbiAgICBAdXBkYXRlVmFyaWFibGVSYW5nZXMoKVxuXG4gICAgQGNvbG9yTWFya2VycyA9IGNvbG9yTWFya2Vyc1xuICAgIC5maWx0ZXIgKHN0YXRlKSAtPiBzdGF0ZT9cbiAgICAubWFwIChzdGF0ZSkgPT5cbiAgICAgIG1hcmtlciA9IEBlZGl0b3IuZ2V0TWFya2VyKHN0YXRlLm1hcmtlcklkKSA/IEBtYXJrZXJMYXllci5tYXJrQnVmZmVyUmFuZ2Uoc3RhdGUuYnVmZmVyUmFuZ2UsIHsgaW52YWxpZGF0ZTogJ3RvdWNoJyB9KVxuICAgICAgY29sb3IgPSBuZXcgQ29sb3Ioc3RhdGUuY29sb3IpXG4gICAgICBjb2xvci52YXJpYWJsZXMgPSBzdGF0ZS52YXJpYWJsZXNcbiAgICAgIGNvbG9yLmludmFsaWQgPSBzdGF0ZS5pbnZhbGlkXG4gICAgICBAY29sb3JNYXJrZXJzQnlNYXJrZXJJZFttYXJrZXIuaWRdID0gbmV3IENvbG9yTWFya2VyIHtcbiAgICAgICAgbWFya2VyXG4gICAgICAgIGNvbG9yXG4gICAgICAgIHRleHQ6IHN0YXRlLnRleHRcbiAgICAgICAgY29sb3JCdWZmZXI6IHRoaXNcbiAgICAgIH1cblxuICBjbGVhblVudXNlZFRleHRFZGl0b3JNYXJrZXJzOiAtPlxuICAgIEBtYXJrZXJMYXllci5maW5kTWFya2VycygpLmZvckVhY2ggKG0pID0+XG4gICAgICBtLmRlc3Ryb3koKSB1bmxlc3MgQGNvbG9yTWFya2Vyc0J5TWFya2VySWRbbS5pZF0/XG5cbiAgdmFyaWFibGVzQXZhaWxhYmxlOiAtPlxuICAgIHJldHVybiBAdmFyaWFibGVzUHJvbWlzZSBpZiBAdmFyaWFibGVzUHJvbWlzZT9cblxuICAgIEB2YXJpYWJsZXNQcm9taXNlID0gQHByb2plY3QuaW5pdGlhbGl6ZSgpXG4gICAgLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICByZXR1cm4gaWYgQGRlc3Ryb3llZFxuICAgICAgcmV0dXJuIHVubGVzcyByZXN1bHRzP1xuXG4gICAgICBAc2NhbkJ1ZmZlckZvclZhcmlhYmxlcygpIGlmIEBpc0lnbm9yZWQoKSBhbmQgQGlzVmFyaWFibGVzU291cmNlKClcbiAgICAudGhlbiAocmVzdWx0cykgPT5cbiAgICAgIEBzY2FuQnVmZmVyRm9yQ29sb3JzIHZhcmlhYmxlczogcmVzdWx0c1xuICAgIC50aGVuIChyZXN1bHRzKSA9PlxuICAgICAgQHVwZGF0ZUNvbG9yTWFya2VycyhyZXN1bHRzKVxuICAgIC50aGVuID0+XG4gICAgICBAdmFyaWFibGVJbml0aWFsaXplZCA9IHRydWVcbiAgICAuY2F0Y2ggKHJlYXNvbikgLT5cbiAgICAgIGNvbnNvbGUubG9nIHJlYXNvblxuXG4gIHVwZGF0ZTogLT5cbiAgICBAdGVybWluYXRlUnVubmluZ1Rhc2soKVxuXG4gICAgcHJvbWlzZSA9IGlmIEBpc0lnbm9yZWQoKVxuICAgICAgQHNjYW5CdWZmZXJGb3JWYXJpYWJsZXMoKVxuICAgIGVsc2UgdW5sZXNzIEBpc1ZhcmlhYmxlc1NvdXJjZSgpXG4gICAgICBQcm9taXNlLnJlc29sdmUoW10pXG4gICAgZWxzZVxuICAgICAgQHByb2plY3QucmVsb2FkVmFyaWFibGVzRm9yUGF0aChAZWRpdG9yLmdldFBhdGgoKSlcblxuICAgIHByb21pc2UudGhlbiAocmVzdWx0cykgPT5cbiAgICAgIEBzY2FuQnVmZmVyRm9yQ29sb3JzIHZhcmlhYmxlczogcmVzdWx0c1xuICAgIC50aGVuIChyZXN1bHRzKSA9PlxuICAgICAgQHVwZGF0ZUNvbG9yTWFya2VycyhyZXN1bHRzKVxuICAgIC5jYXRjaCAocmVhc29uKSAtPlxuICAgICAgY29uc29sZS5sb2cgcmVhc29uXG5cbiAgdGVybWluYXRlUnVubmluZ1Rhc2s6IC0+IEB0YXNrPy50ZXJtaW5hdGUoKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgcmV0dXJuIGlmIEBkZXN0cm95ZWRcblxuICAgIEB0ZXJtaW5hdGVSdW5uaW5nVGFzaygpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQGNvbG9yTWFya2Vycz8uZm9yRWFjaCAobWFya2VyKSAtPiBtYXJrZXIuZGVzdHJveSgpXG4gICAgQGRlc3Ryb3llZCA9IHRydWVcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtZGVzdHJveSdcbiAgICBAZW1pdHRlci5kaXNwb3NlKClcblxuICBpc1ZhcmlhYmxlc1NvdXJjZTogLT4gQHByb2plY3QuaXNWYXJpYWJsZXNTb3VyY2VQYXRoKEBlZGl0b3IuZ2V0UGF0aCgpKVxuXG4gIGlzSWdub3JlZDogLT5cbiAgICBwID0gQGVkaXRvci5nZXRQYXRoKClcbiAgICBAcHJvamVjdC5pc0lnbm9yZWRQYXRoKHApIG9yIG5vdCBhdG9tLnByb2plY3QuY29udGFpbnMocClcblxuICBpc0Rlc3Ryb3llZDogLT4gQGRlc3Ryb3llZFxuXG4gIGdldFBhdGg6IC0+IEBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgZ2V0U2NvcGU6IC0+IEBwcm9qZWN0LnNjb3BlRnJvbUZpbGVOYW1lKEBnZXRQYXRoKCkpXG5cbiAgdXBkYXRlSWdub3JlZFNjb3BlczogLT5cbiAgICBAaWdub3JlZFNjb3BlcyA9IEBwcm9qZWN0LmdldElnbm9yZWRTY29wZXMoKS5tYXAgKHNjb3BlKSAtPlxuICAgICAgdHJ5IG5ldyBSZWdFeHAoc2NvcGUpXG4gICAgLmZpbHRlciAocmUpIC0+IHJlP1xuXG4gICAgQGdldENvbG9yTWFya2VycygpPy5mb3JFYWNoIChtYXJrZXIpIC0+IG1hcmtlci5jaGVja01hcmtlclNjb3BlKHRydWUpXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1jb2xvci1tYXJrZXJzJywge2NyZWF0ZWQ6IFtdLCBkZXN0cm95ZWQ6IFtdfVxuXG5cbiAgIyMgICAgIyMgICAgICMjICAgICMjIyAgICAjIyMjIyMjIyAgICMjIyMjI1xuICAjIyAgICAjIyAgICAgIyMgICAjIyAjIyAgICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgICMjICAgIyMgICMjICAgICAjIyAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjIyMjIyMjICAgIyMjIyMjXG4gICMjICAgICAjIyAgICMjICAjIyMjIyMjIyMgIyMgICAjIyAgICAgICAgICMjXG4gICMjICAgICAgIyMgIyMgICAjIyAgICAgIyMgIyMgICAgIyMgICMjICAgICMjXG4gICMjICAgICAgICMjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICAjIyMjIyNcblxuICB1cGRhdGVWYXJpYWJsZVJhbmdlczogLT5cbiAgICB2YXJpYWJsZXNGb3JCdWZmZXIgPSBAcHJvamVjdC5nZXRWYXJpYWJsZXNGb3JQYXRoKEBlZGl0b3IuZ2V0UGF0aCgpKVxuICAgIHZhcmlhYmxlc0ZvckJ1ZmZlci5mb3JFYWNoICh2YXJpYWJsZSkgPT5cbiAgICAgIHZhcmlhYmxlLmJ1ZmZlclJhbmdlID89IFJhbmdlLmZyb21PYmplY3QgW1xuICAgICAgICBAZWRpdG9yLmdldEJ1ZmZlcigpLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgodmFyaWFibGUucmFuZ2VbMF0pXG4gICAgICAgIEBlZGl0b3IuZ2V0QnVmZmVyKCkucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleCh2YXJpYWJsZS5yYW5nZVsxXSlcbiAgICAgIF1cblxuICBzY2FuQnVmZmVyRm9yVmFyaWFibGVzOiAtPlxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIlRoaXMgQ29sb3JCdWZmZXIgaXMgYWxyZWFkeSBkZXN0cm95ZWRcIikgaWYgQGRlc3Ryb3llZFxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pIHVubGVzcyBAZWRpdG9yLmdldFBhdGgoKVxuXG4gICAgcmVzdWx0cyA9IFtdXG4gICAgdGFza1BhdGggPSByZXF1aXJlLnJlc29sdmUoJy4vdGFza3Mvc2Nhbi1idWZmZXItdmFyaWFibGVzLWhhbmRsZXInKVxuICAgIGVkaXRvciA9IEBlZGl0b3JcbiAgICBidWZmZXIgPSBAZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgY29uZmlnID1cbiAgICAgIGJ1ZmZlcjogQGVkaXRvci5nZXRUZXh0KClcbiAgICAgIHJlZ2lzdHJ5OiBAcHJvamVjdC5nZXRWYXJpYWJsZUV4cHJlc3Npb25zUmVnaXN0cnkoKS5zZXJpYWxpemUoKVxuICAgICAgc2NvcGU6IEBnZXRTY29wZSgpXG5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgQHRhc2sgPSBUYXNrLm9uY2UoXG4gICAgICAgIHRhc2tQYXRoLFxuICAgICAgICBjb25maWcsXG4gICAgICAgID0+XG4gICAgICAgICAgQHRhc2sgPSBudWxsXG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKVxuICAgICAgKVxuXG4gICAgICBAdGFzay5vbiAnc2Nhbi1idWZmZXI6dmFyaWFibGVzLWZvdW5kJywgKHZhcmlhYmxlcykgLT5cbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuY29uY2F0IHZhcmlhYmxlcy5tYXAgKHZhcmlhYmxlKSAtPlxuICAgICAgICAgIHZhcmlhYmxlLnBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgdmFyaWFibGUuYnVmZmVyUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0IFtcbiAgICAgICAgICAgIGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHZhcmlhYmxlLnJhbmdlWzBdKVxuICAgICAgICAgICAgYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgodmFyaWFibGUucmFuZ2VbMV0pXG4gICAgICAgICAgXVxuICAgICAgICAgIHZhcmlhYmxlXG5cbiAgIyMgICAgICMjIyMjIyAgICMjIyMjIyMgICMjICAgICAgICAjIyMjIyMjICAjIyMjIyMjI1xuICAjIyAgICAjIyAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICAjI1xuICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjIyMjIyMjXG4gICMjICAgICMjICAgICAgICMjICAgICAjIyAjIyAgICAgICAjIyAgICAgIyMgIyMgICAjI1xuICAjIyAgICAjIyAgICAjIyAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICMjICMjICAgICMjXG4gICMjICAgICAjIyMjIyMgICAjIyMjIyMjICAjIyMjIyMjIyAgIyMjIyMjIyAgIyMgICAgICMjXG4gICMjXG4gICMjICAgICMjICAgICAjIyAgICAjIyMgICAgIyMjIyMjIyMgICMjICAgICMjICMjIyMjIyMjICMjIyMjIyMjICAgIyMjIyMjXG4gICMjICAgICMjIyAgICMjIyAgICMjICMjICAgIyMgICAgICMjICMjICAgIyMgICMjICAgICAgICMjICAgICAjIyAjIyAgICAjI1xuICAjIyAgICAjIyMjICMjIyMgICMjICAgIyMgICMjICAgICAjIyAjIyAgIyMgICAjIyAgICAgICAjIyAgICAgIyMgIyNcbiAgIyMgICAgIyMgIyMjICMjICMjICAgICAjIyAjIyMjIyMjIyAgIyMjIyMgICAgIyMjIyMjICAgIyMjIyMjIyMgICAjIyMjIyNcbiAgIyMgICAgIyMgICAgICMjICMjIyMjIyMjIyAjIyAgICMjICAgIyMgICMjICAgIyMgICAgICAgIyMgICAjIyAgICAgICAgICMjXG4gICMjICAgICMjICAgICAjIyAjIyAgICAgIyMgIyMgICAgIyMgICMjICAgIyMgICMjICAgICAgICMjICAgICMjICAjIyAgICAjI1xuICAjIyAgICAjIyAgICAgIyMgIyMgICAgICMjICMjICAgICAjIyAjIyAgICAjIyAjIyMjIyMjIyAjIyAgICAgIyMgICMjIyMjI1xuXG4gIGdldE1hcmtlckxheWVyOiAtPiBAbWFya2VyTGF5ZXJcblxuICBnZXRDb2xvck1hcmtlcnM6IC0+IEBjb2xvck1hcmtlcnNcblxuICBnZXRWYWxpZENvbG9yTWFya2VyczogLT5cbiAgICBAZ2V0Q29sb3JNYXJrZXJzKCk/LmZpbHRlcigobSkgLT4gbS5jb2xvcj8uaXNWYWxpZCgpIGFuZCBub3QgbS5pc0lnbm9yZWQoKSkgPyBbXVxuXG4gIGdldENvbG9yTWFya2VyQXRCdWZmZXJQb3NpdGlvbjogKGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIG1hcmtlcnMgPSBAbWFya2VyTGF5ZXIuZmluZE1hcmtlcnMoe1xuICAgICAgY29udGFpbnNCdWZmZXJQb3NpdGlvbjogYnVmZmVyUG9zaXRpb25cbiAgICB9KVxuXG4gICAgZm9yIG1hcmtlciBpbiBtYXJrZXJzXG4gICAgICBpZiBAY29sb3JNYXJrZXJzQnlNYXJrZXJJZFttYXJrZXIuaWRdP1xuICAgICAgICByZXR1cm4gQGNvbG9yTWFya2Vyc0J5TWFya2VySWRbbWFya2VyLmlkXVxuXG4gIGNyZWF0ZUNvbG9yTWFya2VyczogKHJlc3VsdHMpIC0+XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSkgaWYgQGRlc3Ryb3llZFxuXG4gICAgQ29sb3JNYXJrZXIgPz0gcmVxdWlyZSAnLi9jb2xvci1tYXJrZXInXG5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgbmV3UmVzdWx0cyA9IFtdXG5cbiAgICAgIHByb2Nlc3NSZXN1bHRzID0gPT5cbiAgICAgICAgc3RhcnREYXRlID0gbmV3IERhdGVcblxuICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSkgaWYgQGVkaXRvci5pc0Rlc3Ryb3llZCgpXG5cbiAgICAgICAgd2hpbGUgcmVzdWx0cy5sZW5ndGhcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHRzLnNoaWZ0KClcblxuICAgICAgICAgIG1hcmtlciA9IEBtYXJrZXJMYXllci5tYXJrQnVmZmVyUmFuZ2UocmVzdWx0LmJ1ZmZlclJhbmdlLCB7aW52YWxpZGF0ZTogJ3RvdWNoJ30pXG4gICAgICAgICAgbmV3UmVzdWx0cy5wdXNoIEBjb2xvck1hcmtlcnNCeU1hcmtlcklkW21hcmtlci5pZF0gPSBuZXcgQ29sb3JNYXJrZXIge1xuICAgICAgICAgICAgbWFya2VyXG4gICAgICAgICAgICBjb2xvcjogcmVzdWx0LmNvbG9yXG4gICAgICAgICAgICB0ZXh0OiByZXN1bHQubWF0Y2hcbiAgICAgICAgICAgIGNvbG9yQnVmZmVyOiB0aGlzXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgbmV3IERhdGUoKSAtIHN0YXJ0RGF0ZSA+IDEwXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocHJvY2Vzc1Jlc3VsdHMpXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICByZXNvbHZlKG5ld1Jlc3VsdHMpXG5cbiAgICAgIHByb2Nlc3NSZXN1bHRzKClcblxuICBmaW5kRXhpc3RpbmdNYXJrZXJzOiAocmVzdWx0cykgLT5cbiAgICBuZXdNYXJrZXJzID0gW11cbiAgICB0b0NyZWF0ZSA9IFtdXG5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgcHJvY2Vzc1Jlc3VsdHMgPSA9PlxuICAgICAgICBzdGFydERhdGUgPSBuZXcgRGF0ZVxuXG4gICAgICAgIHdoaWxlIHJlc3VsdHMubGVuZ3RoXG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0cy5zaGlmdCgpXG5cbiAgICAgICAgICBpZiBtYXJrZXIgPSBAZmluZENvbG9yTWFya2VyKHJlc3VsdClcbiAgICAgICAgICAgIG5ld01hcmtlcnMucHVzaChtYXJrZXIpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdG9DcmVhdGUucHVzaChyZXN1bHQpXG5cbiAgICAgICAgICBpZiBuZXcgRGF0ZSgpIC0gc3RhcnREYXRlID4gMTBcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShwcm9jZXNzUmVzdWx0cylcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJlc29sdmUoe25ld01hcmtlcnMsIHRvQ3JlYXRlfSlcblxuICAgICAgcHJvY2Vzc1Jlc3VsdHMoKVxuXG4gIHVwZGF0ZUNvbG9yTWFya2VyczogKHJlc3VsdHMpIC0+XG4gICAgbmV3TWFya2VycyA9IG51bGxcbiAgICBjcmVhdGVkTWFya2VycyA9IG51bGxcblxuICAgIEBmaW5kRXhpc3RpbmdNYXJrZXJzKHJlc3VsdHMpLnRoZW4gKHtuZXdNYXJrZXJzOiBtYXJrZXJzLCB0b0NyZWF0ZX0pID0+XG4gICAgICBuZXdNYXJrZXJzID0gbWFya2Vyc1xuICAgICAgQGNyZWF0ZUNvbG9yTWFya2Vycyh0b0NyZWF0ZSlcbiAgICAudGhlbiAocmVzdWx0cykgPT5cbiAgICAgIGNyZWF0ZWRNYXJrZXJzID0gcmVzdWx0c1xuICAgICAgbmV3TWFya2VycyA9IG5ld01hcmtlcnMuY29uY2F0KHJlc3VsdHMpXG5cbiAgICAgIGlmIEBjb2xvck1hcmtlcnM/XG4gICAgICAgIHRvRGVzdHJveSA9IEBjb2xvck1hcmtlcnMuZmlsdGVyIChtYXJrZXIpIC0+IG1hcmtlciBub3QgaW4gbmV3TWFya2Vyc1xuICAgICAgICB0b0Rlc3Ryb3kuZm9yRWFjaCAobWFya2VyKSA9PlxuICAgICAgICAgIGRlbGV0ZSBAY29sb3JNYXJrZXJzQnlNYXJrZXJJZFttYXJrZXIuaWRdXG4gICAgICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgZWxzZVxuICAgICAgICB0b0Rlc3Ryb3kgPSBbXVxuXG4gICAgICBAY29sb3JNYXJrZXJzID0gbmV3TWFya2Vyc1xuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXVwZGF0ZS1jb2xvci1tYXJrZXJzJywge1xuICAgICAgICBjcmVhdGVkOiBjcmVhdGVkTWFya2Vyc1xuICAgICAgICBkZXN0cm95ZWQ6IHRvRGVzdHJveVxuICAgICAgfVxuXG4gIGZpbmRDb2xvck1hcmtlcjogKHByb3BlcnRpZXM9e30pIC0+XG4gICAgcmV0dXJuIHVubGVzcyBAY29sb3JNYXJrZXJzP1xuICAgIGZvciBtYXJrZXIgaW4gQGNvbG9yTWFya2Vyc1xuICAgICAgcmV0dXJuIG1hcmtlciBpZiBtYXJrZXI/Lm1hdGNoKHByb3BlcnRpZXMpXG5cbiAgZmluZENvbG9yTWFya2VyczogKHByb3BlcnRpZXM9e30pIC0+XG4gICAgbWFya2VycyA9IEBtYXJrZXJMYXllci5maW5kTWFya2Vycyhwcm9wZXJ0aWVzKVxuICAgIG1hcmtlcnMubWFwIChtYXJrZXIpID0+XG4gICAgICBAY29sb3JNYXJrZXJzQnlNYXJrZXJJZFttYXJrZXIuaWRdXG4gICAgLmZpbHRlciAobWFya2VyKSAtPiBtYXJrZXI/XG5cbiAgZmluZFZhbGlkQ29sb3JNYXJrZXJzOiAocHJvcGVydGllcykgLT5cbiAgICBAZmluZENvbG9yTWFya2Vycyhwcm9wZXJ0aWVzKS5maWx0ZXIgKG1hcmtlcikgPT5cbiAgICAgIG1hcmtlcj8gYW5kIG1hcmtlci5jb2xvcj8uaXNWYWxpZCgpIGFuZCBub3QgbWFya2VyPy5pc0lnbm9yZWQoKVxuXG4gIHNlbGVjdENvbG9yTWFya2VyQW5kT3BlblBpY2tlcjogKGNvbG9yTWFya2VyKSAtPlxuICAgIHJldHVybiBpZiBAZGVzdHJveWVkXG5cbiAgICBAZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoY29sb3JNYXJrZXIubWFya2VyLmdldEJ1ZmZlclJhbmdlKCkpXG5cbiAgICAjIEZvciB0aGUgbW9tZW50IGl0IHNlZW1zIG9ubHkgY29sb3JzIGluICNSUkdHQkIgZm9ybWF0IGFyZSBkZXRlY3RlZFxuICAgICMgYnkgdGhlIGNvbG9yIHBpY2tlciwgc28gd2UnbGwgZXhjbHVkZSBhbnl0aGluZyBlbHNlXG4gICAgcmV0dXJuIHVubGVzcyBAZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpPy5tYXRjaCgvXiNbMC05YS1mQS1GXXszLDh9JC8pXG5cbiAgICBpZiBAcHJvamVjdC5jb2xvclBpY2tlckFQST9cbiAgICAgIEBwcm9qZWN0LmNvbG9yUGlja2VyQVBJLm9wZW4oQGVkaXRvciwgQGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkpXG5cbiAgc2NhbkJ1ZmZlckZvckNvbG9yczogKG9wdGlvbnM9e30pIC0+XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KFwiVGhpcyBDb2xvckJ1ZmZlciBpcyBhbHJlYWR5IGRlc3Ryb3llZFwiKSBpZiBAZGVzdHJveWVkXG5cbiAgICBDb2xvciA/PSByZXF1aXJlICcuL2NvbG9yJ1xuXG4gICAgcmVzdWx0cyA9IFtdXG4gICAgdGFza1BhdGggPSByZXF1aXJlLnJlc29sdmUoJy4vdGFza3Mvc2Nhbi1idWZmZXItY29sb3JzLWhhbmRsZXInKVxuICAgIGJ1ZmZlciA9IEBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICByZWdpc3RyeSA9IEBwcm9qZWN0LmdldENvbG9yRXhwcmVzc2lvbnNSZWdpc3RyeSgpLnNlcmlhbGl6ZSgpXG5cbiAgICBpZiBvcHRpb25zLnZhcmlhYmxlcz9cbiAgICAgIFZhcmlhYmxlc0NvbGxlY3Rpb24gPz0gcmVxdWlyZSAnLi92YXJpYWJsZXMtY29sbGVjdGlvbidcblxuICAgICAgY29sbGVjdGlvbiA9IG5ldyBWYXJpYWJsZXNDb2xsZWN0aW9uKClcbiAgICAgIGNvbGxlY3Rpb24uYWRkTWFueShvcHRpb25zLnZhcmlhYmxlcylcbiAgICAgIG9wdGlvbnMudmFyaWFibGVzID0gY29sbGVjdGlvblxuXG4gICAgdmFyaWFibGVzID0gaWYgQGlzVmFyaWFibGVzU291cmNlKClcbiAgICAgICMgSW4gdGhlIGNhc2Ugb2YgZmlsZXMgY29uc2lkZXJlZCBhcyBzb3VyY2UsIHRoZSB2YXJpYWJsZXMgaW4gdGhlIHByb2plY3RcbiAgICAgICMgYXJlIG5lZWRlZCB3aGVuIHBhcnNpbmcgdGhlIGZpbGVzLlxuICAgICAgKG9wdGlvbnMudmFyaWFibGVzPy5nZXRWYXJpYWJsZXMoKSA/IFtdKS5jb25jYXQoQHByb2plY3QuZ2V0VmFyaWFibGVzKCkgPyBbXSlcbiAgICBlbHNlXG4gICAgICAjIEZpbGVzIHRoYXQgYXJlIG5vdCBwYXJ0IG9mIHRoZSBzb3VyY2VzIHdpbGwgb25seSB1c2UgdGhlIHZhcmlhYmxlc1xuICAgICAgIyBkZWZpbmVkIGluIHRoZW0gYW5kIHNvIHRoZSBnbG9iYWwgdmFyaWFibGVzIGV4cHJlc3Npb24gbXVzdCBiZVxuICAgICAgIyBkaXNjYXJkZWQgYmVmb3JlIHNlbmRpbmcgdGhlIHJlZ2lzdHJ5IHRvIHRoZSBjaGlsZCBwcm9jZXNzLlxuICAgICAgb3B0aW9ucy52YXJpYWJsZXM/LmdldFZhcmlhYmxlcygpID8gW11cblxuICAgIGRlbGV0ZSByZWdpc3RyeS5leHByZXNzaW9uc1sncGlnbWVudHM6dmFyaWFibGVzJ11cbiAgICBkZWxldGUgcmVnaXN0cnkucmVnZXhwU3RyaW5nXG5cbiAgICBjb25maWcgPVxuICAgICAgYnVmZmVyOiBAZWRpdG9yLmdldFRleHQoKVxuICAgICAgYnVmZmVyUGF0aDogQGdldFBhdGgoKVxuICAgICAgc2NvcGU6IEBnZXRTY29wZSgpXG4gICAgICB2YXJpYWJsZXM6IHZhcmlhYmxlc1xuICAgICAgY29sb3JWYXJpYWJsZXM6IHZhcmlhYmxlcy5maWx0ZXIgKHYpIC0+IHYuaXNDb2xvclxuICAgICAgcmVnaXN0cnk6IHJlZ2lzdHJ5XG5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgQHRhc2sgPSBUYXNrLm9uY2UoXG4gICAgICAgIHRhc2tQYXRoLFxuICAgICAgICBjb25maWcsXG4gICAgICAgID0+XG4gICAgICAgICAgQHRhc2sgPSBudWxsXG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKVxuICAgICAgKVxuXG4gICAgICBAdGFzay5vbiAnc2Nhbi1idWZmZXI6Y29sb3JzLWZvdW5kJywgKGNvbG9ycykgLT5cbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuY29uY2F0IGNvbG9ycy5tYXAgKHJlcykgLT5cbiAgICAgICAgICByZXMuY29sb3IgPSBuZXcgQ29sb3IocmVzLmNvbG9yKVxuICAgICAgICAgIHJlcy5idWZmZXJSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QgW1xuICAgICAgICAgICAgYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgocmVzLnJhbmdlWzBdKVxuICAgICAgICAgICAgYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgocmVzLnJhbmdlWzFdKVxuICAgICAgICAgIF1cbiAgICAgICAgICByZXNcblxuICBzZXJpYWxpemU6IC0+XG4gICAge1xuICAgICAgQGlkXG4gICAgICBwYXRoOiBAZWRpdG9yLmdldFBhdGgoKVxuICAgICAgY29sb3JNYXJrZXJzOiBAY29sb3JNYXJrZXJzPy5tYXAgKG1hcmtlcikgLT5cbiAgICAgICAgbWFya2VyLnNlcmlhbGl6ZSgpXG4gICAgfVxuIl19

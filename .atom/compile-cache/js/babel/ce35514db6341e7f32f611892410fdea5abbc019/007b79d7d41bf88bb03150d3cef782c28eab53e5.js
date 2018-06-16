Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _cryptoRandomString = require('crypto-random-string');

var _cryptoRandomString2 = _interopRequireDefault(_cryptoRandomString);

'use babel';
var WorkerHelper = (function () {
  function WorkerHelper() {
    _classCallCheck(this, WorkerHelper);

    this.workerInstance = null;
  }

  _createClass(WorkerHelper, [{
    key: 'isRunning',
    value: function isRunning() {
      return !!this.workerInstance;
    }
  }, {
    key: 'startWorker',
    value: function startWorker(config) {
      if (!this.workerInstance) {
        this.workerInstance = new _atom.Task(require.resolve('./worker.js'));
        this.workerInstance.start(config);
      }
    }
  }, {
    key: 'terminateWorker',
    value: function terminateWorker() {
      if (this.workerInstance) {
        this.workerInstance.terminate();
        this.workerInstance = null;
      }
    }
  }, {
    key: 'changeConfig',
    value: function changeConfig(key, value) {
      if (this.workerInstance) {
        this.workerInstance.send({
          messageType: 'config',
          message: { key: key, value: value }
        });
      }
    }
  }, {
    key: 'requestJob',
    value: function requestJob(jobType, textEditor) {
      var _this = this;

      if (!this.workerInstance) {
        throw new Error("Worker hasn't started");
      }

      var emitKey = (0, _cryptoRandomString2['default'])(10);

      return new Promise(function (resolve, reject) {
        var errSub = _this.workerInstance.on('task:error', function () {
          for (var _len = arguments.length, err = Array(_len), _key = 0; _key < _len; _key++) {
            err[_key] = arguments[_key];
          }

          // Re-throw errors from the task
          var error = new Error(err[0]);
          // Set the stack to the one given to us by the worker
          error.stack = err[1];

          reject(error);
        });

        var responseSub = _this.workerInstance.on(emitKey, function (data) {
          errSub.dispose();
          responseSub.dispose();
          resolve(data);
        });

        try {
          _this.workerInstance.send({
            messageType: 'job',
            message: {
              emitKey: emitKey,
              jobType: jobType,
              content: textEditor.getText(),
              filePath: textEditor.getPath()
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    }
  }]);

  return WorkerHelper;
})();

exports['default'] = WorkerHelper;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9taW5nYm8vLmF0b20vcGFja2FnZXMvbGludGVyLXRzbGludC9saWIvd29ya2VySGVscGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFHcUIsTUFBTTs7a0NBQ0ksc0JBQXNCOzs7O0FBSnJELFdBQVcsQ0FBQztJQU1TLFlBQVk7QUFDcEIsV0FEUSxZQUFZLEdBQ2pCOzBCQURLLFlBQVk7O0FBRTdCLFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0dBQzVCOztlQUhrQixZQUFZOztXQUt0QixxQkFBRztBQUNWLGFBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7S0FDOUI7OztXQUVVLHFCQUFDLE1BQU0sRUFBRTtBQUNsQixVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN4QixZQUFJLENBQUMsY0FBYyxHQUFHLGVBQVMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFlBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ25DO0tBQ0Y7OztXQUVjLDJCQUFHO0FBQ2hCLFVBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN2QixZQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hDLFlBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO09BQzVCO0tBQ0Y7OztXQUVXLHNCQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDdkIsVUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLHFCQUFXLEVBQUUsUUFBUTtBQUNyQixpQkFBTyxFQUFFLEVBQUUsR0FBRyxFQUFILEdBQUcsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFO1NBQ3hCLENBQUMsQ0FBQztPQUNKO0tBQ0Y7OztXQUVTLG9CQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUU7OztBQUM5QixVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN4QixjQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7T0FDMUM7O0FBRUQsVUFBTSxPQUFPLEdBQUcscUNBQW1CLEVBQUUsQ0FBQyxDQUFDOztBQUV2QyxhQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxZQUFNLE1BQU0sR0FBRyxNQUFLLGNBQWMsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVk7NENBQVIsR0FBRztBQUFILGVBQUc7Ozs7QUFFekQsY0FBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTdCLGVBQUssQ0FBQyxLQUFLLEdBQUksR0FBRzs7QUFDckIsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNmLENBQUMsQ0FBQzs7QUFFSCxZQUFNLFdBQVcsR0FBRyxNQUFLLGNBQWMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQzVELGdCQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakIscUJBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN0QixpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2YsQ0FBQyxDQUFDOztBQUVILFlBQUk7QUFDRixnQkFBSyxjQUFjLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLHVCQUFXLEVBQUUsS0FBSztBQUNsQixtQkFBTyxFQUFFO0FBQ1AscUJBQU8sRUFBUCxPQUFPO0FBQ1AscUJBQU8sRUFBUCxPQUFPO0FBQ1AscUJBQU8sRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFO0FBQzdCLHNCQUFRLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRTthQUMvQjtXQUNGLENBQUMsQ0FBQztTQUNKLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixnQkFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ1g7T0FDRixDQUFDLENBQUM7S0FDSjs7O1NBcEVrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvVXNlcnMvbWluZ2JvLy5hdG9tL3BhY2thZ2VzL2xpbnRlci10c2xpbnQvbGliL3dvcmtlckhlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L2V4dGVuc2lvbnMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgVGFzayB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IGNyeXB0b1JhbmRvbVN0cmluZyBmcm9tICdjcnlwdG8tcmFuZG9tLXN0cmluZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdvcmtlckhlbHBlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMud29ya2VySW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgaXNSdW5uaW5nKCkge1xuICAgIHJldHVybiAhIXRoaXMud29ya2VySW5zdGFuY2U7XG4gIH1cblxuICBzdGFydFdvcmtlcihjb25maWcpIHtcbiAgICBpZiAoIXRoaXMud29ya2VySW5zdGFuY2UpIHtcbiAgICAgIHRoaXMud29ya2VySW5zdGFuY2UgPSBuZXcgVGFzayhyZXF1aXJlLnJlc29sdmUoJy4vd29ya2VyLmpzJykpO1xuICAgICAgdGhpcy53b3JrZXJJbnN0YW5jZS5zdGFydChjb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIHRlcm1pbmF0ZVdvcmtlcigpIHtcbiAgICBpZiAodGhpcy53b3JrZXJJbnN0YW5jZSkge1xuICAgICAgdGhpcy53b3JrZXJJbnN0YW5jZS50ZXJtaW5hdGUoKTtcbiAgICAgIHRoaXMud29ya2VySW5zdGFuY2UgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGNoYW5nZUNvbmZpZyhrZXksIHZhbHVlKSB7XG4gICAgaWYgKHRoaXMud29ya2VySW5zdGFuY2UpIHtcbiAgICAgIHRoaXMud29ya2VySW5zdGFuY2Uuc2VuZCh7XG4gICAgICAgIG1lc3NhZ2VUeXBlOiAnY29uZmlnJyxcbiAgICAgICAgbWVzc2FnZTogeyBrZXksIHZhbHVlIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXF1ZXN0Sm9iKGpvYlR5cGUsIHRleHRFZGl0b3IpIHtcbiAgICBpZiAoIXRoaXMud29ya2VySW5zdGFuY2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIldvcmtlciBoYXNuJ3Qgc3RhcnRlZFwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbWl0S2V5ID0gY3J5cHRvUmFuZG9tU3RyaW5nKDEwKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBlcnJTdWIgPSB0aGlzLndvcmtlckluc3RhbmNlLm9uKCd0YXNrOmVycm9yJywgKC4uLmVycikgPT4ge1xuICAgICAgICAvLyBSZS10aHJvdyBlcnJvcnMgZnJvbSB0aGUgdGFza1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihlcnJbMF0pO1xuICAgICAgICAvLyBTZXQgdGhlIHN0YWNrIHRvIHRoZSBvbmUgZ2l2ZW4gdG8gdXMgYnkgdGhlIHdvcmtlclxuICAgICAgICBbLCBlcnJvci5zdGFja10gPSBlcnI7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcmVzcG9uc2VTdWIgPSB0aGlzLndvcmtlckluc3RhbmNlLm9uKGVtaXRLZXksIChkYXRhKSA9PiB7XG4gICAgICAgIGVyclN1Yi5kaXNwb3NlKCk7XG4gICAgICAgIHJlc3BvbnNlU3ViLmRpc3Bvc2UoKTtcbiAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgIH0pO1xuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLndvcmtlckluc3RhbmNlLnNlbmQoe1xuICAgICAgICAgIG1lc3NhZ2VUeXBlOiAnam9iJyxcbiAgICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgICBlbWl0S2V5LFxuICAgICAgICAgICAgam9iVHlwZSxcbiAgICAgICAgICAgIGNvbnRlbnQ6IHRleHRFZGl0b3IuZ2V0VGV4dCgpLFxuICAgICAgICAgICAgZmlsZVBhdGg6IHRleHRFZGl0b3IuZ2V0UGF0aCgpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
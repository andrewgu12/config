(function() {
  var BOB, CLOSERS, CompositeDisposable, EmacsCursor, KillRing, Mark, OPENERS, escapeRegExp;

  KillRing = require('./kill-ring');

  Mark = require('./mark');

  CompositeDisposable = require('atom').CompositeDisposable;

  OPENERS = {
    '(': ')',
    '[': ']',
    '{': '}',
    '\'': '\'',
    '"': '"',
    '`': '`'
  };

  CLOSERS = {
    ')': '(',
    ']': '[',
    '}': '{',
    '\'': '\'',
    '"': '"',
    '`': '`'
  };

  module.exports = EmacsCursor = (function() {
    EmacsCursor["for"] = function(cursor) {
      return cursor._atomicEmacs != null ? cursor._atomicEmacs : cursor._atomicEmacs = new EmacsCursor(cursor);
    };

    function EmacsCursor(cursor1) {
      this.cursor = cursor1;
      this.editor = this.cursor.editor;
      this._mark = null;
      this._localKillRing = null;
      this._yankMarker = null;
      this._disposable = this.cursor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
    }

    EmacsCursor.prototype.mark = function() {
      return this._mark != null ? this._mark : this._mark = new Mark(this.cursor);
    };

    EmacsCursor.prototype.killRing = function() {
      if (this.editor.hasMultipleCursors()) {
        return this.getLocalKillRing();
      } else {
        return KillRing.global;
      }
    };

    EmacsCursor.prototype.getLocalKillRing = function() {
      return this._localKillRing != null ? this._localKillRing : this._localKillRing = KillRing.global.fork();
    };

    EmacsCursor.prototype.clearLocalKillRing = function() {
      return this._localKillRing = null;
    };

    EmacsCursor.prototype.destroy = function() {
      var ref, ref1;
      this.clearLocalKillRing();
      this._disposable.dispose();
      this._disposable = null;
      if ((ref = this._yankMarker) != null) {
        ref.destroy();
      }
      if ((ref1 = this._mark) != null) {
        ref1.destroy();
      }
      return delete this.cursor._atomicEmacs;
    };

    EmacsCursor.prototype.locateBackward = function(regExp) {
      return this._locateBackwardFrom(this.cursor.getBufferPosition(), regExp);
    };

    EmacsCursor.prototype.locateForward = function(regExp) {
      return this._locateForwardFrom(this.cursor.getBufferPosition(), regExp);
    };

    EmacsCursor.prototype.locateWordCharacterBackward = function() {
      return this.locateBackward(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.locateWordCharacterForward = function() {
      return this.locateForward(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.locateNonWordCharacterBackward = function() {
      return this.locateBackward(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.locateNonWordCharacterForward = function() {
      return this.locateForward(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.goToMatchStartBackward = function(regExp) {
      var ref;
      return this._goTo((ref = this.locateBackward(regExp)) != null ? ref.start : void 0);
    };

    EmacsCursor.prototype.goToMatchStartForward = function(regExp) {
      var ref;
      return this._goTo((ref = this.locateForward(regExp)) != null ? ref.start : void 0);
    };

    EmacsCursor.prototype.goToMatchEndBackward = function(regExp) {
      var ref;
      return this._goTo((ref = this.locateBackward(regExp)) != null ? ref.end : void 0);
    };

    EmacsCursor.prototype.goToMatchEndForward = function(regExp) {
      var ref;
      return this._goTo((ref = this.locateForward(regExp)) != null ? ref.end : void 0);
    };

    EmacsCursor.prototype.skipCharactersBackward = function(characters) {
      var regexp;
      regexp = new RegExp("[^" + (escapeRegExp(characters)) + "]");
      return this.skipBackwardUntil(regexp);
    };

    EmacsCursor.prototype.skipCharactersForward = function(characters) {
      var regexp;
      regexp = new RegExp("[^" + (escapeRegExp(characters)) + "]");
      return this.skipForwardUntil(regexp);
    };

    EmacsCursor.prototype.skipWordCharactersBackward = function() {
      return this.skipBackwardUntil(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipWordCharactersForward = function() {
      return this.skipForwardUntil(this._getNonWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipNonWordCharactersBackward = function() {
      return this.skipBackwardUntil(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipNonWordCharactersForward = function() {
      return this.skipForwardUntil(this._getWordCharacterRegExp());
    };

    EmacsCursor.prototype.skipBackwardUntil = function(regexp) {
      if (!this.goToMatchEndBackward(regexp)) {
        return this._goTo(BOB);
      }
    };

    EmacsCursor.prototype.skipForwardUntil = function(regexp) {
      if (!this.goToMatchStartForward(regexp)) {
        return this._goTo(this.editor.getEofBufferPosition());
      }
    };

    EmacsCursor.prototype.insertAfter = function(text) {
      var position;
      position = this.cursor.getBufferPosition();
      this.editor.setTextInBufferRange([position, position], "\n");
      return this.cursor.setBufferPosition(position);
    };

    EmacsCursor.prototype.horizontalSpaceRange = function() {
      var end, start;
      this.skipCharactersBackward(' \t');
      start = this.cursor.getBufferPosition();
      this.skipCharactersForward(' \t');
      end = this.cursor.getBufferPosition();
      return [start, end];
    };

    EmacsCursor.prototype.deleteBlankLines = function() {
      var blankLineRe, e, eof, point, s;
      eof = this.editor.getEofBufferPosition();
      blankLineRe = /^[ \t]*$/;
      point = this.cursor.getBufferPosition();
      s = e = point.row;
      while (blankLineRe.test(this.cursor.editor.lineTextForBufferRow(e)) && e <= eof.row) {
        e += 1;
      }
      while (s > 0 && blankLineRe.test(this.cursor.editor.lineTextForBufferRow(s - 1))) {
        s -= 1;
      }
      if (s === e) {
        e += 1;
        while (blankLineRe.test(this.cursor.editor.lineTextForBufferRow(e)) && e <= eof.row) {
          e += 1;
        }
        return this.cursor.editor.setTextInBufferRange([[s + 1, 0], [e, 0]], '');
      } else if (e === s + 1) {
        this.cursor.editor.setTextInBufferRange([[s, 0], [e, 0]], '');
        return this.cursor.setBufferPosition([s, 0]);
      } else {
        this.cursor.editor.setTextInBufferRange([[s, 0], [e, 0]], '\n');
        return this.cursor.setBufferPosition([s, 0]);
      }
    };

    EmacsCursor.prototype.transformWord = function(transformer) {
      var end, range, start, text;
      this.skipNonWordCharactersForward();
      start = this.cursor.getBufferPosition();
      this.skipWordCharactersForward();
      end = this.cursor.getBufferPosition();
      range = [start, end];
      text = this.editor.getTextInBufferRange(range);
      return this.editor.setTextInBufferRange(range, transformer(text));
    };

    EmacsCursor.prototype.backwardKillWord = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var end, start;
          end = _this.cursor.getBufferPosition();
          _this.skipNonWordCharactersBackward();
          _this.skipWordCharactersBackward();
          start = _this.cursor.getBufferPosition();
          return [start, end];
        };
      })(this));
    };

    EmacsCursor.prototype.killWord = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var end, start;
          start = _this.cursor.getBufferPosition();
          _this.skipNonWordCharactersForward();
          _this.skipWordCharactersForward();
          end = _this.cursor.getBufferPosition();
          return [start, end];
        };
      })(this));
    };

    EmacsCursor.prototype.killLine = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var end, line, start;
          start = _this.cursor.getBufferPosition();
          line = _this.editor.lineTextForBufferRow(start.row);
          if (start.column === 0 && atom.config.get("atomic-emacs.killWholeLine")) {
            end = [start.row + 1, 0];
          } else {
            if (/^\s*$/.test(line.slice(start.column))) {
              end = [start.row + 1, 0];
            } else {
              end = [start.row, line.length];
            }
          }
          return [start, end];
        };
      })(this));
    };

    EmacsCursor.prototype.killRegion = function(method) {
      return this._killUnit(method, (function(_this) {
        return function() {
          var position;
          position = _this.cursor.selection.getBufferRange();
          return [position, position];
        };
      })(this));
    };

    EmacsCursor.prototype._killUnit = function(method, findRange) {
      var killRing, range, text;
      if (method == null) {
        method = 'push';
      }
      if ((this.cursor.selection != null) && !this.cursor.selection.isEmpty()) {
        range = this.cursor.selection.getBufferRange();
        this.cursor.selection.clear();
      } else {
        range = findRange();
      }
      text = this.editor.getTextInBufferRange(range);
      this.editor.setTextInBufferRange(range, '');
      killRing = this.killRing();
      killRing[method](text);
      return killRing.getCurrentEntry();
    };

    EmacsCursor.prototype.yank = function() {
      var killRing, newRange, position, range;
      killRing = this.killRing();
      if (killRing.isEmpty()) {
        return;
      }
      if (this.cursor.selection) {
        range = this.cursor.selection.getBufferRange();
        this.cursor.selection.clear();
      } else {
        position = this.cursor.getBufferPosition();
        range = [position, position];
      }
      newRange = this.editor.setTextInBufferRange(range, killRing.getCurrentEntry());
      this.cursor.setBufferPosition(newRange.end);
      if (this._yankMarker == null) {
        this._yankMarker = this.editor.markBufferPosition(this.cursor.getBufferPosition());
      }
      return this._yankMarker.setBufferRange(newRange);
    };

    EmacsCursor.prototype.rotateYank = function(n) {
      var entry, range;
      if (this._yankMarker === null) {
        return;
      }
      entry = this.killRing().rotate(n);
      if (entry !== null) {
        range = this.editor.setTextInBufferRange(this._yankMarker.getBufferRange(), entry);
        return this._yankMarker.setBufferRange(range);
      }
    };

    EmacsCursor.prototype.yankComplete = function() {
      var ref;
      if ((ref = this._yankMarker) != null) {
        ref.destroy();
      }
      return this._yankMarker = null;
    };

    EmacsCursor.prototype._nextCharacterFrom = function(position) {
      var lineLength;
      lineLength = this.editor.lineTextForBufferRow(position.row).length;
      if (position.column === lineLength) {
        if (position.row === this.editor.getLastBufferRow()) {
          return null;
        } else {
          return this.editor.getTextInBufferRange([position, [position.row + 1, 0]]);
        }
      } else {
        return this.editor.getTextInBufferRange([position, position.translate([0, 1])]);
      }
    };

    EmacsCursor.prototype._previousCharacterFrom = function(position) {
      var column;
      if (position.column === 0) {
        if (position.row === 0) {
          return null;
        } else {
          column = this.editor.lineTextForBufferRow(position.row - 1).length;
          return this.editor.getTextInBufferRange([[position.row - 1, column], position]);
        }
      } else {
        return this.editor.getTextInBufferRange([position.translate([0, -1]), position]);
      }
    };

    EmacsCursor.prototype.nextCharacter = function() {
      return this._nextCharacterFrom(this.cursor.getBufferPosition());
    };

    EmacsCursor.prototype.previousCharacter = function() {
      return this._nextCharacterFrom(this.cursor.getBufferPosition());
    };

    EmacsCursor.prototype.skipSexpForward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._sexpForwardFrom(point);
      return this.cursor.setBufferPosition(target);
    };

    EmacsCursor.prototype.skipSexpBackward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._sexpBackwardFrom(point);
      return this.cursor.setBufferPosition(target);
    };

    EmacsCursor.prototype.skipListForward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._listForwardFrom(point);
      if (target) {
        return this.cursor.setBufferPosition(target);
      }
    };

    EmacsCursor.prototype.skipListBackward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._listBackwardFrom(point);
      if (target) {
        return this.cursor.setBufferPosition(target);
      }
    };

    EmacsCursor.prototype.markSexp = function() {
      var mark, newTail, range;
      range = this.cursor.getMarker().getBufferRange();
      newTail = this._sexpForwardFrom(range.end);
      mark = this.mark().set(newTail);
      if (!mark.isActive()) {
        return mark.activate();
      }
    };

    EmacsCursor.prototype.transposeChars = function() {
      var column, line, pair, pairRange, previousLine, ref, row;
      ref = this.cursor.getBufferPosition(), row = ref.row, column = ref.column;
      if (row === 0 && column === 0) {
        return;
      }
      line = this.editor.lineTextForBufferRow(row);
      if (column === 0) {
        previousLine = this.editor.lineTextForBufferRow(row - 1);
        pairRange = [[row - 1, previousLine.length], [row, 1]];
      } else if (column === line.length) {
        pairRange = [[row, column - 2], [row, column]];
      } else {
        pairRange = [[row, column - 1], [row, column + 1]];
      }
      pair = this.editor.getTextInBufferRange(pairRange);
      return this.editor.setTextInBufferRange(pairRange, (pair[1] || '') + pair[0]);
    };

    EmacsCursor.prototype.transposeWords = function() {
      var word1Range, word2Range;
      this.skipNonWordCharactersBackward();
      word1Range = this._wordRange();
      this.skipWordCharactersForward();
      this.skipNonWordCharactersForward();
      if (this.editor.getEofBufferPosition().isEqual(this.cursor.getBufferPosition())) {
        return this.skipNonWordCharactersBackward();
      } else {
        word2Range = this._wordRange();
        return this._transposeRanges(word1Range, word2Range);
      }
    };

    EmacsCursor.prototype.transposeSexps = function() {
      var end1, end2, start1, start2;
      this.skipSexpBackward();
      start1 = this.cursor.getBufferPosition();
      this.skipSexpForward();
      end1 = this.cursor.getBufferPosition();
      this.skipSexpForward();
      end2 = this.cursor.getBufferPosition();
      this.skipSexpBackward();
      start2 = this.cursor.getBufferPosition();
      return this._transposeRanges([start1, end1], [start2, end2]);
    };

    EmacsCursor.prototype.transposeLines = function() {
      var lineRange, row, text;
      row = this.cursor.getBufferRow();
      if (row === 0) {
        this._endLineIfNecessary();
        this.cursor.moveDown();
        row += 1;
      }
      this._endLineIfNecessary();
      lineRange = [[row, 0], [row + 1, 0]];
      text = this.editor.getTextInBufferRange(lineRange);
      this.editor.setTextInBufferRange(lineRange, '');
      return this.editor.setTextInBufferRange([[row - 1, 0], [row - 1, 0]], text);
    };

    EmacsCursor.prototype._wordRange = function() {
      var range, wordEnd, wordStart;
      this.skipWordCharactersBackward();
      range = this.locateNonWordCharacterBackward();
      wordStart = range ? range.end : [0, 0];
      range = this.locateNonWordCharacterForward();
      wordEnd = range ? range.start : this.editor.getEofBufferPosition();
      return [wordStart, wordEnd];
    };

    EmacsCursor.prototype._endLineIfNecessary = function() {
      var length, row;
      row = this.cursor.getBufferPosition().row;
      if (row === this.editor.getLineCount() - 1) {
        length = this.cursor.getCurrentBufferLine().length;
        return this.editor.setTextInBufferRange([[row, length], [row, length]], "\n");
      }
    };

    EmacsCursor.prototype._transposeRanges = function(range1, range2) {
      var text1, text2;
      text1 = this.editor.getTextInBufferRange(range1);
      text2 = this.editor.getTextInBufferRange(range2);
      this.editor.setTextInBufferRange(range2, text1);
      this.editor.setTextInBufferRange(range1, text2);
      return this.cursor.setBufferPosition(range2[1]);
    };

    EmacsCursor.prototype._sexpForwardFrom = function(point) {
      var character, eob, eof, quotes, re, ref, ref1, result, stack;
      eob = this.editor.getEofBufferPosition();
      point = ((ref = this._locateForwardFrom(point, /[\w()[\]{}'"]/i)) != null ? ref.start : void 0) || eob;
      character = this._nextCharacterFrom(point);
      if (OPENERS.hasOwnProperty(character) || CLOSERS.hasOwnProperty(character)) {
        result = null;
        stack = [];
        quotes = 0;
        eof = this.editor.getEofBufferPosition();
        re = /[^()[\]{}"'`\\]+|\\.|[()[\]{}"'`]/g;
        this.editor.scanInBufferRange(re, [point, eof], (function(_this) {
          return function(hit) {
            var closer;
            if (hit.matchText === stack[stack.length - 1]) {
              stack.pop();
              if (stack.length === 0) {
                result = hit.range.end;
                return hit.stop();
              } else if (/^["'`]$/.test(hit.matchText)) {
                return quotes -= 1;
              }
            } else if ((closer = OPENERS[hit.matchText])) {
              if (!(/^["'`]$/.test(closer) && quotes > 0)) {
                stack.push(closer);
                if (/^["'`]$/.test(closer)) {
                  return quotes += 1;
                }
              }
            } else if (CLOSERS[hit.matchText]) {
              if (stack.length === 0) {
                return hit.stop();
              }
            }
          };
        })(this));
        return result || point;
      } else {
        return ((ref1 = this._locateForwardFrom(point, /[\W\n]/i)) != null ? ref1.start : void 0) || eob;
      }
    };

    EmacsCursor.prototype._sexpBackwardFrom = function(point) {
      var character, quotes, re, ref, ref1, result, stack;
      point = ((ref = this._locateBackwardFrom(point, /[\w()[\]{}'"]/i)) != null ? ref.end : void 0) || BOB;
      character = this._previousCharacterFrom(point);
      if (OPENERS.hasOwnProperty(character) || CLOSERS.hasOwnProperty(character)) {
        result = null;
        stack = [];
        quotes = 0;
        re = /[^()[\]{}"'`\\]+|\\.|[()[\]{}"'`]/g;
        this.editor.backwardsScanInBufferRange(re, [BOB, point], (function(_this) {
          return function(hit) {
            var opener;
            if (hit.matchText === stack[stack.length - 1]) {
              stack.pop();
              if (stack.length === 0) {
                result = hit.range.start;
                return hit.stop();
              } else if (/^["'`]$/.test(hit.matchText)) {
                return quotes -= 1;
              }
            } else if ((opener = CLOSERS[hit.matchText])) {
              if (!(/^["'`]$/.test(opener) && quotes > 0)) {
                stack.push(opener);
                if (/^["'`]$/.test(opener)) {
                  return quotes += 1;
                }
              }
            } else if (OPENERS[hit.matchText]) {
              if (stack.length === 0) {
                return hit.stop();
              }
            }
          };
        })(this));
        return result || point;
      } else {
        return ((ref1 = this._locateBackwardFrom(point, /[\W\n]/i)) != null ? ref1.end : void 0) || BOB;
      }
    };

    EmacsCursor.prototype._listForwardFrom = function(point) {
      var end, eob, match;
      eob = this.editor.getEofBufferPosition();
      if (!(match = this._locateForwardFrom(point, /[()[\]{}]/i))) {
        return null;
      }
      end = this._sexpForwardFrom(match.start);
      if (end.isEqual(match.start)) {
        return null;
      } else {
        return end;
      }
    };

    EmacsCursor.prototype._listBackwardFrom = function(point) {
      var match, start;
      if (!(match = this._locateBackwardFrom(point, /[()[\]{}]/i))) {
        return null;
      }
      start = this._sexpBackwardFrom(match.end);
      if (start.isEqual(match.end)) {
        return null;
      } else {
        return start;
      }
    };

    EmacsCursor.prototype._locateBackwardFrom = function(point, regExp) {
      var result;
      result = null;
      this.editor.backwardsScanInBufferRange(regExp, [BOB, point], function(hit) {
        return result = hit.range;
      });
      return result;
    };

    EmacsCursor.prototype._locateForwardFrom = function(point, regExp) {
      var eof, result;
      result = null;
      eof = this.editor.getEofBufferPosition();
      this.editor.scanInBufferRange(regExp, [point, eof], function(hit) {
        return result = hit.range;
      });
      return result;
    };

    EmacsCursor.prototype._getWordCharacterRegExp = function() {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp('[^\\s' + escapeRegExp(nonWordCharacters) + ']');
    };

    EmacsCursor.prototype._getNonWordCharacterRegExp = function() {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp('[\\s' + escapeRegExp(nonWordCharacters) + ']');
    };

    EmacsCursor.prototype._goTo = function(point) {
      if (point) {
        this.cursor.setBufferPosition(point);
        return true;
      } else {
        return false;
      }
    };

    return EmacsCursor;

  })();

  escapeRegExp = function(string) {
    if (string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    } else {
      return '';
    }
  };

  BOB = {
    row: 0,
    column: 0
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL21pbmdiby8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3MvbGliL2VtYWNzLWN1cnNvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0VBQ04sc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixPQUFBLEdBQVU7SUFBQyxHQUFBLEVBQUssR0FBTjtJQUFXLEdBQUEsRUFBSyxHQUFoQjtJQUFxQixHQUFBLEVBQUssR0FBMUI7SUFBK0IsSUFBQSxFQUFNLElBQXJDO0lBQTJDLEdBQUEsRUFBSyxHQUFoRDtJQUFxRCxHQUFBLEVBQUssR0FBMUQ7OztFQUNWLE9BQUEsR0FBVTtJQUFDLEdBQUEsRUFBSyxHQUFOO0lBQVcsR0FBQSxFQUFLLEdBQWhCO0lBQXFCLEdBQUEsRUFBSyxHQUExQjtJQUErQixJQUFBLEVBQU0sSUFBckM7SUFBMkMsR0FBQSxFQUFLLEdBQWhEO0lBQXFELEdBQUEsRUFBSyxHQUExRDs7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNKLFdBQUMsRUFBQSxHQUFBLEVBQUQsR0FBTSxTQUFDLE1BQUQ7MkNBQ0osTUFBTSxDQUFDLGVBQVAsTUFBTSxDQUFDLGVBQWdCLElBQUksV0FBSixDQUFnQixNQUFoQjtJQURuQjs7SUFHTyxxQkFBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFNBQUQ7TUFDWixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxNQUFNLENBQUM7TUFDbEIsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxjQUFELEdBQWtCO01BQ2xCLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFxQixDQUFBLFNBQUEsS0FB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LEVBQWtDLENBQUMsS0FBRCxFQUFRLEdBQVIsQ0FBbEMsRUFBZ0QsU0FBQyxHQUFEO2VBQzlDLE1BQUEsR0FBUyxHQUFHLENBQUM7TUFEaUMsQ0FBaEQ7YUFFQTtJQUxrQjs7MEJBT3BCLHVCQUFBLEdBQXlCLFNBQUE7QUFDdkIsVUFBQTtNQUFBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEI7YUFDcEIsSUFBSSxNQUFKLENBQVcsT0FBQSxHQUFVLFlBQUEsQ0FBYSxpQkFBYixDQUFWLEdBQTRDLEdBQXZEO0lBRnVCOzswQkFJekIsMEJBQUEsR0FBNEIsU0FBQTtBQUMxQixVQUFBO01BQUEsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQjthQUNwQixJQUFJLE1BQUosQ0FBVyxNQUFBLEdBQVMsWUFBQSxDQUFhLGlCQUFiLENBQVQsR0FBMkMsR0FBdEQ7SUFGMEI7OzBCQUk1QixLQUFBLEdBQU8sU0FBQyxLQUFEO01BQ0wsSUFBRyxLQUFIO1FBQ0UsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixDQUEwQixLQUExQjtlQUNBLEtBRkY7T0FBQSxNQUFBO2VBSUUsTUFKRjs7SUFESzs7Ozs7O0VBU1QsWUFBQSxHQUFlLFNBQUMsTUFBRDtJQUNiLElBQUcsTUFBSDthQUNFLE1BQU0sQ0FBQyxPQUFQLENBQWUsd0JBQWYsRUFBeUMsTUFBekMsRUFERjtLQUFBLE1BQUE7YUFHRSxHQUhGOztFQURhOztFQU1mLEdBQUEsR0FBTTtJQUFDLEdBQUEsRUFBSyxDQUFOO0lBQVMsTUFBQSxFQUFRLENBQWpCOztBQTNnQk4iLCJzb3VyY2VzQ29udGVudCI6WyJLaWxsUmluZyA9IHJlcXVpcmUgJy4va2lsbC1yaW5nJ1xuTWFyayA9IHJlcXVpcmUgJy4vbWFyaydcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbk9QRU5FUlMgPSB7JygnOiAnKScsICdbJzogJ10nLCAneyc6ICd9JywgJ1xcJyc6ICdcXCcnLCAnXCInOiAnXCInLCAnYCc6ICdgJ31cbkNMT1NFUlMgPSB7JyknOiAnKCcsICddJzogJ1snLCAnfSc6ICd7JywgJ1xcJyc6ICdcXCcnLCAnXCInOiAnXCInLCAnYCc6ICdgJ31cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRW1hY3NDdXJzb3JcbiAgQGZvcjogKGN1cnNvcikgLT5cbiAgICBjdXJzb3IuX2F0b21pY0VtYWNzID89IG5ldyBFbWFjc0N1cnNvcihjdXJzb3IpXG5cbiAgY29uc3RydWN0b3I6IChAY3Vyc29yKSAtPlxuICAgIEBlZGl0b3IgPSBAY3Vyc29yLmVkaXRvclxuICAgIEBfbWFyayA9IG51bGxcbiAgICBAX2xvY2FsS2lsbFJpbmcgPSBudWxsXG4gICAgQF95YW5rTWFya2VyID0gbnVsbFxuICAgIEBfZGlzcG9zYWJsZSA9IEBjdXJzb3Iub25EaWREZXN0cm95ID0+IEBkZXN0cm95KClcblxuICBtYXJrOiAtPlxuICAgIEBfbWFyayA/PSBuZXcgTWFyayhAY3Vyc29yKVxuXG4gIGtpbGxSaW5nOiAtPlxuICAgIGlmIEBlZGl0b3IuaGFzTXVsdGlwbGVDdXJzb3JzKClcbiAgICAgIEBnZXRMb2NhbEtpbGxSaW5nKClcbiAgICBlbHNlXG4gICAgICBLaWxsUmluZy5nbG9iYWxcblxuICBnZXRMb2NhbEtpbGxSaW5nOiAtPlxuICAgIEBfbG9jYWxLaWxsUmluZyA/PSBLaWxsUmluZy5nbG9iYWwuZm9yaygpXG5cbiAgY2xlYXJMb2NhbEtpbGxSaW5nOiAtPlxuICAgIEBfbG9jYWxLaWxsUmluZyA9IG51bGxcblxuICBkZXN0cm95OiAtPlxuICAgIEBjbGVhckxvY2FsS2lsbFJpbmcoKVxuICAgIEBfZGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICBAX2Rpc3Bvc2FibGUgPSBudWxsXG4gICAgQF95YW5rTWFya2VyPy5kZXN0cm95KClcbiAgICBAX21hcms/LmRlc3Ryb3koKVxuICAgIGRlbGV0ZSBAY3Vyc29yLl9hdG9taWNFbWFjc1xuXG4gICMgTG9vayBmb3IgdGhlIHByZXZpb3VzIG9jY3VycmVuY2Ugb2YgdGhlIGdpdmVuIHJlZ2V4cC5cbiAgI1xuICAjIFJldHVybiBhIFJhbmdlIGlmIGZvdW5kLCBudWxsIG90aGVyd2lzZS4gVGhpcyBkb2VzIG5vdCBtb3ZlIHRoZSBjdXJzb3IuXG4gIGxvY2F0ZUJhY2t3YXJkOiAocmVnRXhwKSAtPlxuICAgIEBfbG9jYXRlQmFja3dhcmRGcm9tKEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSwgcmVnRXhwKVxuXG4gICMgTG9vayBmb3IgdGhlIG5leHQgb2NjdXJyZW5jZSBvZiB0aGUgZ2l2ZW4gcmVnZXhwLlxuICAjXG4gICMgUmV0dXJuIGEgUmFuZ2UgaWYgZm91bmQsIG51bGwgb3RoZXJ3aXNlLiBUaGlzIGRvZXMgbm90IG1vdmUgdGhlIGN1cnNvci5cbiAgbG9jYXRlRm9yd2FyZDogKHJlZ0V4cCkgLT5cbiAgICBAX2xvY2F0ZUZvcndhcmRGcm9tKEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSwgcmVnRXhwKVxuXG4gICMgTG9vayBmb3IgdGhlIHByZXZpb3VzIHdvcmQgY2hhcmFjdGVyLlxuICAjXG4gICMgUmV0dXJuIGEgUmFuZ2UgaWYgZm91bmQsIG51bGwgb3RoZXJ3aXNlLiBUaGlzIGRvZXMgbm90IG1vdmUgdGhlIGN1cnNvci5cbiAgbG9jYXRlV29yZENoYXJhY3RlckJhY2t3YXJkOiAtPlxuICAgIEBsb2NhdGVCYWNrd2FyZCBAX2dldFdvcmRDaGFyYWN0ZXJSZWdFeHAoKVxuXG4gICMgTG9vayBmb3IgdGhlIG5leHQgd29yZCBjaGFyYWN0ZXIuXG4gICNcbiAgIyBSZXR1cm4gYSBSYW5nZSBpZiBmb3VuZCwgbnVsbCBvdGhlcndpc2UuIFRoaXMgZG9lcyBub3QgbW92ZSB0aGUgY3Vyc29yLlxuICBsb2NhdGVXb3JkQ2hhcmFjdGVyRm9yd2FyZDogLT5cbiAgICBAbG9jYXRlRm9yd2FyZCBAX2dldFdvcmRDaGFyYWN0ZXJSZWdFeHAoKVxuXG4gICMgTG9vayBmb3IgdGhlIHByZXZpb3VzIG5vbndvcmQgY2hhcmFjdGVyLlxuICAjXG4gICMgUmV0dXJuIGEgUmFuZ2UgaWYgZm91bmQsIG51bGwgb3RoZXJ3aXNlLiBUaGlzIGRvZXMgbm90IG1vdmUgdGhlIGN1cnNvci5cbiAgbG9jYXRlTm9uV29yZENoYXJhY3RlckJhY2t3YXJkOiAtPlxuICAgIEBsb2NhdGVCYWNrd2FyZCBAX2dldE5vbldvcmRDaGFyYWN0ZXJSZWdFeHAoKVxuXG4gICMgTG9vayBmb3IgdGhlIG5leHQgbm9ud29yZCBjaGFyYWN0ZXIuXG4gICNcbiAgIyBSZXR1cm4gYSBSYW5nZSBpZiBmb3VuZCwgbnVsbCBvdGhlcndpc2UuIFRoaXMgZG9lcyBub3QgbW92ZSB0aGUgY3Vyc29yLlxuICBsb2NhdGVOb25Xb3JkQ2hhcmFjdGVyRm9yd2FyZDogLT5cbiAgICBAbG9jYXRlRm9yd2FyZCBAX2dldE5vbldvcmRDaGFyYWN0ZXJSZWdFeHAoKVxuXG4gICMgTW92ZSB0byB0aGUgc3RhcnQgb2YgdGhlIHByZXZpb3VzIG9jY3VycmVuY2Ugb2YgdGhlIGdpdmVuIHJlZ2V4cC5cbiAgI1xuICAjIFJldHVybiB0cnVlIGlmIGZvdW5kLCBmYWxzZSBvdGhlcndpc2UuXG4gIGdvVG9NYXRjaFN0YXJ0QmFja3dhcmQ6IChyZWdFeHApIC0+XG4gICAgQF9nb1RvIEBsb2NhdGVCYWNrd2FyZChyZWdFeHApPy5zdGFydFxuXG4gICMgTW92ZSB0byB0aGUgc3RhcnQgb2YgdGhlIG5leHQgb2NjdXJyZW5jZSBvZiB0aGUgZ2l2ZW4gcmVnZXhwLlxuICAjXG4gICMgUmV0dXJuIHRydWUgaWYgZm91bmQsIGZhbHNlIG90aGVyd2lzZS5cbiAgZ29Ub01hdGNoU3RhcnRGb3J3YXJkOiAocmVnRXhwKSAtPlxuICAgIEBfZ29UbyBAbG9jYXRlRm9yd2FyZChyZWdFeHApPy5zdGFydFxuXG4gICMgTW92ZSB0byB0aGUgZW5kIG9mIHRoZSBwcmV2aW91cyBvY2N1cnJlbmNlIG9mIHRoZSBnaXZlbiByZWdleHAuXG4gICNcbiAgIyBSZXR1cm4gdHJ1ZSBpZiBmb3VuZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICBnb1RvTWF0Y2hFbmRCYWNrd2FyZDogKHJlZ0V4cCkgLT5cbiAgICBAX2dvVG8gQGxvY2F0ZUJhY2t3YXJkKHJlZ0V4cCk/LmVuZFxuXG4gICMgTW92ZSB0byB0aGUgZW5kIG9mIHRoZSBuZXh0IG9jY3VycmVuY2Ugb2YgdGhlIGdpdmVuIHJlZ2V4cC5cbiAgI1xuICAjIFJldHVybiB0cnVlIGlmIGZvdW5kLCBmYWxzZSBvdGhlcndpc2UuXG4gIGdvVG9NYXRjaEVuZEZvcndhcmQ6IChyZWdFeHApIC0+XG4gICAgQF9nb1RvIEBsb2NhdGVGb3J3YXJkKHJlZ0V4cCk/LmVuZFxuXG4gICMgU2tpcCBiYWNrd2FyZHMgb3ZlciB0aGUgZ2l2ZW4gY2hhcmFjdGVycy5cbiAgI1xuICAjIElmIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlciBpcyByZWFjaGVkLCByZW1haW4gdGhlcmUuXG4gIHNraXBDaGFyYWN0ZXJzQmFja3dhcmQ6IChjaGFyYWN0ZXJzKSAtPlxuICAgIHJlZ2V4cCA9IG5ldyBSZWdFeHAoXCJbXiN7ZXNjYXBlUmVnRXhwKGNoYXJhY3RlcnMpfV1cIilcbiAgICBAc2tpcEJhY2t3YXJkVW50aWwocmVnZXhwKVxuXG4gICMgU2tpcCBmb3J3YXJkcyBvdmVyIHRoZSBnaXZlbiBjaGFyYWN0ZXJzLlxuICAjXG4gICMgSWYgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIGlzIHJlYWNoZWQsIHJlbWFpbiB0aGVyZS5cbiAgc2tpcENoYXJhY3RlcnNGb3J3YXJkOiAoY2hhcmFjdGVycykgLT5cbiAgICByZWdleHAgPSBuZXcgUmVnRXhwKFwiW14je2VzY2FwZVJlZ0V4cChjaGFyYWN0ZXJzKX1dXCIpXG4gICAgQHNraXBGb3J3YXJkVW50aWwocmVnZXhwKVxuXG4gICMgU2tpcCBiYWNrd2FyZHMgb3ZlciBhbnkgd29yZCBjaGFyYWN0ZXJzLlxuICAjXG4gICMgSWYgdGhlIGJlZ2lubmluZyBvZiB0aGUgYnVmZmVyIGlzIHJlYWNoZWQsIHJlbWFpbiB0aGVyZS5cbiAgc2tpcFdvcmRDaGFyYWN0ZXJzQmFja3dhcmQ6IC0+XG4gICAgQHNraXBCYWNrd2FyZFVudGlsKEBfZ2V0Tm9uV29yZENoYXJhY3RlclJlZ0V4cCgpKVxuXG4gICMgU2tpcCBmb3J3YXJkcyBvdmVyIGFueSB3b3JkIGNoYXJhY3RlcnMuXG4gICNcbiAgIyBJZiB0aGUgZW5kIG9mIHRoZSBidWZmZXIgaXMgcmVhY2hlZCwgcmVtYWluIHRoZXJlLlxuICBza2lwV29yZENoYXJhY3RlcnNGb3J3YXJkOiAtPlxuICAgIEBza2lwRm9yd2FyZFVudGlsKEBfZ2V0Tm9uV29yZENoYXJhY3RlclJlZ0V4cCgpKVxuXG4gICMgU2tpcCBiYWNrd2FyZHMgb3ZlciBhbnkgbm9uLXdvcmQgY2hhcmFjdGVycy5cbiAgI1xuICAjIElmIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGJ1ZmZlciBpcyByZWFjaGVkLCByZW1haW4gdGhlcmUuXG4gIHNraXBOb25Xb3JkQ2hhcmFjdGVyc0JhY2t3YXJkOiAtPlxuICAgIEBza2lwQmFja3dhcmRVbnRpbChAX2dldFdvcmRDaGFyYWN0ZXJSZWdFeHAoKSlcblxuICAjIFNraXAgZm9yd2FyZHMgb3ZlciBhbnkgbm9uLXdvcmQgY2hhcmFjdGVycy5cbiAgI1xuICAjIElmIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlciBpcyByZWFjaGVkLCByZW1haW4gdGhlcmUuXG4gIHNraXBOb25Xb3JkQ2hhcmFjdGVyc0ZvcndhcmQ6IC0+XG4gICAgQHNraXBGb3J3YXJkVW50aWwoQF9nZXRXb3JkQ2hhcmFjdGVyUmVnRXhwKCkpXG5cbiAgIyBTa2lwIG92ZXIgY2hhcmFjdGVycyB1bnRpbCB0aGUgcHJldmlvdXMgb2NjdXJyZW5jZSBvZiB0aGUgZ2l2ZW4gcmVnZXhwLlxuICAjXG4gICMgSWYgdGhlIGJlZ2lubmluZyBvZiB0aGUgYnVmZmVyIGlzIHJlYWNoZWQsIHJlbWFpbiB0aGVyZS5cbiAgc2tpcEJhY2t3YXJkVW50aWw6IChyZWdleHApIC0+XG4gICAgaWYgbm90IEBnb1RvTWF0Y2hFbmRCYWNrd2FyZChyZWdleHApXG4gICAgICBAX2dvVG8gQk9CXG5cbiAgIyBTa2lwIG92ZXIgY2hhcmFjdGVycyB1bnRpbCB0aGUgbmV4dCBvY2N1cnJlbmNlIG9mIHRoZSBnaXZlbiByZWdleHAuXG4gICNcbiAgIyBJZiB0aGUgZW5kIG9mIHRoZSBidWZmZXIgaXMgcmVhY2hlZCwgcmVtYWluIHRoZXJlLlxuICBza2lwRm9yd2FyZFVudGlsOiAocmVnZXhwKSAtPlxuICAgIGlmIG5vdCBAZ29Ub01hdGNoU3RhcnRGb3J3YXJkKHJlZ2V4cClcbiAgICAgIEBfZ29UbyBAZWRpdG9yLmdldEVvZkJ1ZmZlclBvc2l0aW9uKClcblxuICAjIEluc2VydCB0aGUgZ2l2ZW4gdGV4dCBhZnRlciB0aGlzIGN1cnNvci5cbiAgaW5zZXJ0QWZ0ZXI6ICh0ZXh0KSAtPlxuICAgIHBvc2l0aW9uID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShbcG9zaXRpb24sIHBvc2l0aW9uXSwgXCJcXG5cIilcbiAgICBAY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKVxuXG4gIGhvcml6b250YWxTcGFjZVJhbmdlOiAtPlxuICAgIEBza2lwQ2hhcmFjdGVyc0JhY2t3YXJkKCcgXFx0JylcbiAgICBzdGFydCA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIEBza2lwQ2hhcmFjdGVyc0ZvcndhcmQoJyBcXHQnKVxuICAgIGVuZCA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIFtzdGFydCwgZW5kXVxuXG4gIGRlbGV0ZUJsYW5rTGluZXM6IC0+XG4gICAgZW9mID0gQGVkaXRvci5nZXRFb2ZCdWZmZXJQb3NpdGlvbigpXG4gICAgYmxhbmtMaW5lUmUgPSAvXlsgXFx0XSokL1xuXG4gICAgcG9pbnQgPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICBzID0gZSA9IHBvaW50LnJvd1xuICAgIHdoaWxlIGJsYW5rTGluZVJlLnRlc3QoQGN1cnNvci5lZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coZSkpIGFuZCBlIDw9IGVvZi5yb3dcbiAgICAgIGUgKz0gMVxuICAgIHdoaWxlIHMgPiAwIGFuZCBibGFua0xpbmVSZS50ZXN0KEBjdXJzb3IuZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHMgLSAxKSlcbiAgICAgIHMgLT0gMVxuXG4gICAgaWYgcyA9PSBlXG4gICAgICAjIE5vIGJsYW5rczogZGVsZXRlIGJsYW5rcyBhaGVhZC5cbiAgICAgIGUgKz0gMVxuICAgICAgd2hpbGUgYmxhbmtMaW5lUmUudGVzdChAY3Vyc29yLmVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhlKSkgYW5kIGUgPD0gZW9mLnJvd1xuICAgICAgICBlICs9IDFcbiAgICAgIEBjdXJzb3IuZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFtbcyArIDEsIDBdLCBbZSwgMF1dLCAnJylcbiAgICBlbHNlIGlmIGUgPT0gcyArIDFcbiAgICAgICMgT25lIGJsYW5rOiBkZWxldGUgaXQuXG4gICAgICBAY3Vyc29yLmVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShbW3MsIDBdLCBbZSwgMF1dLCAnJylcbiAgICAgIEBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24oW3MsIDBdKVxuICAgIGVsc2VcbiAgICAgICMgTXVsdGlwbGUgYmxhbmtzOiBkZWxldGUgYWxsIGJ1dCBvbmUuXG4gICAgICBAY3Vyc29yLmVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShbW3MsIDBdLCBbZSwgMF1dLCAnXFxuJylcbiAgICAgIEBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24oW3MsIDBdKVxuXG4gIHRyYW5zZm9ybVdvcmQ6ICh0cmFuc2Zvcm1lcikgLT5cbiAgICBAc2tpcE5vbldvcmRDaGFyYWN0ZXJzRm9yd2FyZCgpXG4gICAgc3RhcnQgPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICBAc2tpcFdvcmRDaGFyYWN0ZXJzRm9yd2FyZCgpXG4gICAgZW5kID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgcmFuZ2UgPSBbc3RhcnQsIGVuZF1cbiAgICB0ZXh0ID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCB0cmFuc2Zvcm1lcih0ZXh0KSlcblxuICBiYWNrd2FyZEtpbGxXb3JkOiAobWV0aG9kKSAtPlxuICAgIEBfa2lsbFVuaXQgbWV0aG9kLCA9PlxuICAgICAgZW5kID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICBAc2tpcE5vbldvcmRDaGFyYWN0ZXJzQmFja3dhcmQoKVxuICAgICAgQHNraXBXb3JkQ2hhcmFjdGVyc0JhY2t3YXJkKClcbiAgICAgIHN0YXJ0ID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICBbc3RhcnQsIGVuZF1cblxuICBraWxsV29yZDogKG1ldGhvZCkgLT5cbiAgICBAX2tpbGxVbml0IG1ldGhvZCwgPT5cbiAgICAgIHN0YXJ0ID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICBAc2tpcE5vbldvcmRDaGFyYWN0ZXJzRm9yd2FyZCgpXG4gICAgICBAc2tpcFdvcmRDaGFyYWN0ZXJzRm9yd2FyZCgpXG4gICAgICBlbmQgPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIFtzdGFydCwgZW5kXVxuXG4gIGtpbGxMaW5lOiAobWV0aG9kKSAtPlxuICAgIEBfa2lsbFVuaXQgbWV0aG9kLCA9PlxuICAgICAgc3RhcnQgPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHN0YXJ0LnJvdylcbiAgICAgIGlmIHN0YXJ0LmNvbHVtbiA9PSAwIGFuZCBhdG9tLmNvbmZpZy5nZXQoXCJhdG9taWMtZW1hY3Mua2lsbFdob2xlTGluZVwiKVxuICAgICAgICAgIGVuZCA9IFtzdGFydC5yb3cgKyAxLCAwXVxuICAgICAgZWxzZVxuICAgICAgICBpZiAvXlxccyokLy50ZXN0KGxpbmUuc2xpY2Uoc3RhcnQuY29sdW1uKSlcbiAgICAgICAgICBlbmQgPSBbc3RhcnQucm93ICsgMSwgMF1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGVuZCA9IFtzdGFydC5yb3csIGxpbmUubGVuZ3RoXVxuICAgICAgW3N0YXJ0LCBlbmRdXG5cbiAga2lsbFJlZ2lvbjogKG1ldGhvZCkgLT5cbiAgICBAX2tpbGxVbml0IG1ldGhvZCwgPT5cbiAgICAgIHBvc2l0aW9uID0gQGN1cnNvci5zZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgW3Bvc2l0aW9uLCBwb3NpdGlvbl1cblxuICBfa2lsbFVuaXQ6IChtZXRob2Q9J3B1c2gnLCBmaW5kUmFuZ2UpIC0+XG4gICAgaWYgQGN1cnNvci5zZWxlY3Rpb24/IGFuZCBub3QgQGN1cnNvci5zZWxlY3Rpb24uaXNFbXB0eSgpXG4gICAgICByYW5nZSA9IEBjdXJzb3Iuc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIEBjdXJzb3Iuc2VsZWN0aW9uLmNsZWFyKClcbiAgICBlbHNlXG4gICAgICByYW5nZSA9IGZpbmRSYW5nZSgpXG5cbiAgICB0ZXh0ID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCAnJylcbiAgICBraWxsUmluZyA9IEBraWxsUmluZygpXG4gICAga2lsbFJpbmdbbWV0aG9kXSh0ZXh0KVxuICAgIGtpbGxSaW5nLmdldEN1cnJlbnRFbnRyeSgpXG5cbiAgeWFuazogLT5cbiAgICBraWxsUmluZyA9IEBraWxsUmluZygpXG4gICAgcmV0dXJuIGlmIGtpbGxSaW5nLmlzRW1wdHkoKVxuICAgIGlmIEBjdXJzb3Iuc2VsZWN0aW9uXG4gICAgICByYW5nZSA9IEBjdXJzb3Iuc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIEBjdXJzb3Iuc2VsZWN0aW9uLmNsZWFyKClcbiAgICBlbHNlXG4gICAgICBwb3NpdGlvbiA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgICAgcmFuZ2UgPSBbcG9zaXRpb24sIHBvc2l0aW9uXVxuICAgIG5ld1JhbmdlID0gQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSwga2lsbFJpbmcuZ2V0Q3VycmVudEVudHJ5KCkpXG4gICAgQGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihuZXdSYW5nZS5lbmQpXG4gICAgQF95YW5rTWFya2VyID89IEBlZGl0b3IubWFya0J1ZmZlclBvc2l0aW9uKEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcbiAgICBAX3lhbmtNYXJrZXIuc2V0QnVmZmVyUmFuZ2UobmV3UmFuZ2UpXG5cbiAgcm90YXRlWWFuazogKG4pIC0+XG4gICAgcmV0dXJuIGlmIEBfeWFua01hcmtlciA9PSBudWxsXG4gICAgZW50cnkgPSBAa2lsbFJpbmcoKS5yb3RhdGUobilcbiAgICB1bmxlc3MgZW50cnkgaXMgbnVsbFxuICAgICAgcmFuZ2UgPSBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKEBfeWFua01hcmtlci5nZXRCdWZmZXJSYW5nZSgpLCBlbnRyeSlcbiAgICAgIEBfeWFua01hcmtlci5zZXRCdWZmZXJSYW5nZShyYW5nZSlcblxuICB5YW5rQ29tcGxldGU6IC0+XG4gICAgQF95YW5rTWFya2VyPy5kZXN0cm95KClcbiAgICBAX3lhbmtNYXJrZXIgPSBudWxsXG5cbiAgX25leHRDaGFyYWN0ZXJGcm9tOiAocG9zaXRpb24pIC0+XG4gICAgbGluZUxlbmd0aCA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3cocG9zaXRpb24ucm93KS5sZW5ndGhcbiAgICBpZiBwb3NpdGlvbi5jb2x1bW4gPT0gbGluZUxlbmd0aFxuICAgICAgaWYgcG9zaXRpb24ucm93ID09IEBlZGl0b3IuZ2V0TGFzdEJ1ZmZlclJvdygpXG4gICAgICAgIG51bGxcbiAgICAgIGVsc2VcbiAgICAgICAgQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbcG9zaXRpb24sIFtwb3NpdGlvbi5yb3cgKyAxLCAwXV0pXG4gICAgZWxzZVxuICAgICAgQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbcG9zaXRpb24sIHBvc2l0aW9uLnRyYW5zbGF0ZShbMCwgMV0pXSlcblxuICBfcHJldmlvdXNDaGFyYWN0ZXJGcm9tOiAocG9zaXRpb24pIC0+XG4gICAgaWYgcG9zaXRpb24uY29sdW1uID09IDBcbiAgICAgIGlmIHBvc2l0aW9uLnJvdyA9PSAwXG4gICAgICAgIG51bGxcbiAgICAgIGVsc2VcbiAgICAgICAgY29sdW1uID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhwb3NpdGlvbi5yb3cgLSAxKS5sZW5ndGhcbiAgICAgICAgQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbW3Bvc2l0aW9uLnJvdyAtIDEsIGNvbHVtbl0sIHBvc2l0aW9uXSlcbiAgICBlbHNlXG4gICAgICBAZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKFtwb3NpdGlvbi50cmFuc2xhdGUoWzAsIC0xXSksIHBvc2l0aW9uXSlcblxuICBuZXh0Q2hhcmFjdGVyOiAtPlxuICAgIEBfbmV4dENoYXJhY3RlckZyb20oQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpKVxuXG4gIHByZXZpb3VzQ2hhcmFjdGVyOiAtPlxuICAgIEBfbmV4dENoYXJhY3RlckZyb20oQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpKVxuXG4gICMgU2tpcCB0byB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IG9yIG5leHQgc3ltYm9saWMgZXhwcmVzc2lvbi5cbiAgc2tpcFNleHBGb3J3YXJkOiAtPlxuICAgIHBvaW50ID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgdGFyZ2V0ID0gQF9zZXhwRm9yd2FyZEZyb20ocG9pbnQpXG4gICAgQGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbih0YXJnZXQpXG5cbiAgIyBTa2lwIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGN1cnJlbnQgb3IgcHJldmlvdXMgc3ltYm9saWMgZXhwcmVzc2lvbi5cbiAgc2tpcFNleHBCYWNrd2FyZDogLT5cbiAgICBwb2ludCA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIHRhcmdldCA9IEBfc2V4cEJhY2t3YXJkRnJvbShwb2ludClcbiAgICBAY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHRhcmdldClcblxuICAjIFNraXAgdG8gdGhlIGVuZCBvZiB0aGUgY3VycmVudCBvciBuZXh0IGxpc3QuXG4gIHNraXBMaXN0Rm9yd2FyZDogLT5cbiAgICBwb2ludCA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIHRhcmdldCA9IEBfbGlzdEZvcndhcmRGcm9tKHBvaW50KVxuICAgIEBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24odGFyZ2V0KSBpZiB0YXJnZXRcblxuICAjIFNraXAgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgY3VycmVudCBvciBwcmV2aW91cyBsaXN0LlxuICBza2lwTGlzdEJhY2t3YXJkOiAtPlxuICAgIHBvaW50ID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgdGFyZ2V0ID0gQF9saXN0QmFja3dhcmRGcm9tKHBvaW50KVxuICAgIEBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24odGFyZ2V0KSBpZiB0YXJnZXRcblxuICAjIEFkZCB0aGUgbmV4dCBzZXhwIHRvIHRoZSBjdXJzb3IncyBzZWxlY3Rpb24uIEFjdGl2YXRlIGlmIG5lY2Vzc2FyeS5cbiAgbWFya1NleHA6IC0+XG4gICAgcmFuZ2UgPSBAY3Vyc29yLmdldE1hcmtlcigpLmdldEJ1ZmZlclJhbmdlKClcbiAgICBuZXdUYWlsID0gQF9zZXhwRm9yd2FyZEZyb20ocmFuZ2UuZW5kKVxuICAgIG1hcmsgPSBAbWFyaygpLnNldChuZXdUYWlsKVxuICAgIG1hcmsuYWN0aXZhdGUoKSB1bmxlc3MgbWFyay5pc0FjdGl2ZSgpXG5cbiAgIyBUcmFuc3Bvc2UgdGhlIHR3byBjaGFyYWN0ZXJzIGFyb3VuZCB0aGUgY3Vyc29yLiBBdCB0aGUgYmVnaW5uaW5nIG9mIGEgbGluZSxcbiAgIyB0cmFuc3Bvc2UgdGhlIG5ld2xpbmUgd2l0aCB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIHRoZSBsaW5lLiBBdCB0aGUgZW5kIG9mIGFcbiAgIyBsaW5lLCB0cmFuc3Bvc2UgdGhlIGxhc3QgdHdvIGNoYXJhY3RlcnMuIEF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGJ1ZmZlciwgZG9cbiAgIyBub3RoaW5nLiBXZWlyZCwgYnV0IHRoYXQncyBFbWFjcyFcbiAgdHJhbnNwb3NlQ2hhcnM6IC0+XG4gICAge3JvdywgY29sdW1ufSA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIHJldHVybiBpZiByb3cgPT0gMCBhbmQgY29sdW1uID09IDBcblxuICAgIGxpbmUgPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdylcbiAgICBpZiBjb2x1bW4gPT0gMFxuICAgICAgcHJldmlvdXNMaW5lID0gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cgLSAxKVxuICAgICAgcGFpclJhbmdlID0gW1tyb3cgLSAxLCBwcmV2aW91c0xpbmUubGVuZ3RoXSwgW3JvdywgMV1dXG4gICAgZWxzZSBpZiBjb2x1bW4gPT0gbGluZS5sZW5ndGhcbiAgICAgIHBhaXJSYW5nZSA9IFtbcm93LCBjb2x1bW4gLSAyXSwgW3JvdywgY29sdW1uXV1cbiAgICBlbHNlXG4gICAgICBwYWlyUmFuZ2UgPSBbW3JvdywgY29sdW1uIC0gMV0sIFtyb3csIGNvbHVtbiArIDFdXVxuICAgIHBhaXIgPSBAZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHBhaXJSYW5nZSlcbiAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHBhaXJSYW5nZSwgKHBhaXJbMV0gb3IgJycpICsgcGFpclswXSlcblxuICAjIFRyYW5zcG9zZSB0aGUgd29yZCBhdCB0aGUgY3Vyc29yIHdpdGggdGhlIG5leHQgb25lLiBNb3ZlIHRvIHRoZSBlbmQgb2YgdGhlXG4gICMgbmV4dCB3b3JkLlxuICB0cmFuc3Bvc2VXb3JkczogLT5cbiAgICBAc2tpcE5vbldvcmRDaGFyYWN0ZXJzQmFja3dhcmQoKVxuXG4gICAgd29yZDFSYW5nZSA9IEBfd29yZFJhbmdlKClcbiAgICBAc2tpcFdvcmRDaGFyYWN0ZXJzRm9yd2FyZCgpXG4gICAgQHNraXBOb25Xb3JkQ2hhcmFjdGVyc0ZvcndhcmQoKVxuICAgIGlmIEBlZGl0b3IuZ2V0RW9mQnVmZmVyUG9zaXRpb24oKS5pc0VxdWFsKEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKSlcbiAgICAgICMgTm8gc2Vjb25kIHdvcmQgLSBqdXN0IGdvIGJhY2suXG4gICAgICBAc2tpcE5vbldvcmRDaGFyYWN0ZXJzQmFja3dhcmQoKVxuICAgIGVsc2VcbiAgICAgIHdvcmQyUmFuZ2UgPSBAX3dvcmRSYW5nZSgpXG4gICAgICBAX3RyYW5zcG9zZVJhbmdlcyh3b3JkMVJhbmdlLCB3b3JkMlJhbmdlKVxuXG4gICMgVHJhbnNwb3NlIHRoZSBzZXhwIGF0IHRoZSBjdXJzb3Igd2l0aCB0aGUgbmV4dCBvbmUuIE1vdmUgdG8gdGhlIGVuZCBvZiB0aGVcbiAgIyBuZXh0IHNleHAuXG4gIHRyYW5zcG9zZVNleHBzOiAtPlxuICAgIEBza2lwU2V4cEJhY2t3YXJkKClcbiAgICBzdGFydDEgPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICBAc2tpcFNleHBGb3J3YXJkKClcbiAgICBlbmQxID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG5cbiAgICBAc2tpcFNleHBGb3J3YXJkKClcbiAgICBlbmQyID0gQGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgQHNraXBTZXhwQmFja3dhcmQoKVxuICAgIHN0YXJ0MiA9IEBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuXG4gICAgQF90cmFuc3Bvc2VSYW5nZXMoW3N0YXJ0MSwgZW5kMV0sIFtzdGFydDIsIGVuZDJdKVxuXG4gICMgVHJhbnNwb3NlIHRoZSBsaW5lIGF0IHRoZSBjdXJzb3Igd2l0aCB0aGUgb25lIGFib3ZlIGl0LiBNb3ZlIHRvIHRoZVxuICAjIGJlZ2lubmluZyBvZiB0aGUgbmV4dCBsaW5lLlxuICB0cmFuc3Bvc2VMaW5lczogLT5cbiAgICByb3cgPSBAY3Vyc29yLmdldEJ1ZmZlclJvdygpXG4gICAgaWYgcm93ID09IDBcbiAgICAgIEBfZW5kTGluZUlmTmVjZXNzYXJ5KClcbiAgICAgIEBjdXJzb3IubW92ZURvd24oKVxuICAgICAgcm93ICs9IDFcbiAgICBAX2VuZExpbmVJZk5lY2Vzc2FyeSgpXG5cbiAgICBsaW5lUmFuZ2UgPSBbW3JvdywgMF0sIFtyb3cgKyAxLCAwXV1cbiAgICB0ZXh0ID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShsaW5lUmFuZ2UpXG4gICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShsaW5lUmFuZ2UsICcnKVxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoW1tyb3cgLSAxLCAwXSwgW3JvdyAtIDEsIDBdXSwgdGV4dClcblxuICBfd29yZFJhbmdlOiAtPlxuICAgIEBza2lwV29yZENoYXJhY3RlcnNCYWNrd2FyZCgpXG4gICAgcmFuZ2UgPSBAbG9jYXRlTm9uV29yZENoYXJhY3RlckJhY2t3YXJkKClcbiAgICB3b3JkU3RhcnQgPSBpZiByYW5nZSB0aGVuIHJhbmdlLmVuZCBlbHNlIFswLCAwXVxuICAgIHJhbmdlID0gQGxvY2F0ZU5vbldvcmRDaGFyYWN0ZXJGb3J3YXJkKClcbiAgICB3b3JkRW5kID0gaWYgcmFuZ2UgdGhlbiByYW5nZS5zdGFydCBlbHNlIEBlZGl0b3IuZ2V0RW9mQnVmZmVyUG9zaXRpb24oKVxuICAgIFt3b3JkU3RhcnQsIHdvcmRFbmRdXG5cbiAgX2VuZExpbmVJZk5lY2Vzc2FyeTogLT5cbiAgICByb3cgPSBAY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkucm93XG4gICAgaWYgcm93ID09IEBlZGl0b3IuZ2V0TGluZUNvdW50KCkgLSAxXG4gICAgICBsZW5ndGggPSBAY3Vyc29yLmdldEN1cnJlbnRCdWZmZXJMaW5lKCkubGVuZ3RoXG4gICAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFtbcm93LCBsZW5ndGhdLCBbcm93LCBsZW5ndGhdXSwgXCJcXG5cIilcblxuICBfdHJhbnNwb3NlUmFuZ2VzOiAocmFuZ2UxLCByYW5nZTIpIC0+XG4gICAgdGV4dDEgPSBAZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlMSlcbiAgICB0ZXh0MiA9IEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UyKVxuXG4gICAgIyBVcGRhdGUgcmFuZ2UyIGZpcnN0IHNvIGl0IGRvZXNuJ3QgY2hhbmdlIHJhbmdlMS5cbiAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlMiwgdGV4dDEpXG4gICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZTEsIHRleHQyKVxuICAgIEBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24ocmFuZ2UyWzFdKVxuXG4gIF9zZXhwRm9yd2FyZEZyb206IChwb2ludCkgLT5cbiAgICBlb2IgPSBAZWRpdG9yLmdldEVvZkJ1ZmZlclBvc2l0aW9uKClcbiAgICBwb2ludCA9IEBfbG9jYXRlRm9yd2FyZEZyb20ocG9pbnQsIC9bXFx3KClbXFxde30nXCJdL2kpPy5zdGFydCBvciBlb2JcbiAgICBjaGFyYWN0ZXIgPSBAX25leHRDaGFyYWN0ZXJGcm9tKHBvaW50KVxuICAgIGlmIE9QRU5FUlMuaGFzT3duUHJvcGVydHkoY2hhcmFjdGVyKSBvciBDTE9TRVJTLmhhc093blByb3BlcnR5KGNoYXJhY3RlcilcbiAgICAgIHJlc3VsdCA9IG51bGxcbiAgICAgIHN0YWNrID0gW11cbiAgICAgIHF1b3RlcyA9IDBcbiAgICAgIGVvZiA9IEBlZGl0b3IuZ2V0RW9mQnVmZmVyUG9zaXRpb24oKVxuICAgICAgcmUgPSAvW14oKVtcXF17fVwiJ2BcXFxcXSt8XFxcXC58WygpW1xcXXt9XCInYF0vZ1xuICAgICAgQGVkaXRvci5zY2FuSW5CdWZmZXJSYW5nZSByZSwgW3BvaW50LCBlb2ZdLCAoaGl0KSA9PlxuICAgICAgICBpZiBoaXQubWF0Y2hUZXh0ID09IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdXG4gICAgICAgICAgc3RhY2sucG9wKClcbiAgICAgICAgICBpZiBzdGFjay5sZW5ndGggPT0gMFxuICAgICAgICAgICAgcmVzdWx0ID0gaGl0LnJhbmdlLmVuZFxuICAgICAgICAgICAgaGl0LnN0b3AoKVxuICAgICAgICAgIGVsc2UgaWYgL15bXCInYF0kLy50ZXN0KGhpdC5tYXRjaFRleHQpXG4gICAgICAgICAgICBxdW90ZXMgLT0gMVxuICAgICAgICBlbHNlIGlmIChjbG9zZXIgPSBPUEVORVJTW2hpdC5tYXRjaFRleHRdKVxuICAgICAgICAgIHVubGVzcyAvXltcIidgXSQvLnRlc3QoY2xvc2VyKSBhbmQgcXVvdGVzID4gMFxuICAgICAgICAgICAgc3RhY2sucHVzaChjbG9zZXIpXG4gICAgICAgICAgICBxdW90ZXMgKz0gMSBpZiAvXltcIidgXSQvLnRlc3QoY2xvc2VyKVxuICAgICAgICBlbHNlIGlmIENMT1NFUlNbaGl0Lm1hdGNoVGV4dF1cbiAgICAgICAgICBpZiBzdGFjay5sZW5ndGggPT0gMFxuICAgICAgICAgICAgaGl0LnN0b3AoKVxuICAgICAgcmVzdWx0IG9yIHBvaW50XG4gICAgZWxzZVxuICAgICAgQF9sb2NhdGVGb3J3YXJkRnJvbShwb2ludCwgL1tcXFdcXG5dL2kpPy5zdGFydCBvciBlb2JcblxuICBfc2V4cEJhY2t3YXJkRnJvbTogKHBvaW50KSAtPlxuICAgIHBvaW50ID0gQF9sb2NhdGVCYWNrd2FyZEZyb20ocG9pbnQsIC9bXFx3KClbXFxde30nXCJdL2kpPy5lbmQgb3IgQk9CXG4gICAgY2hhcmFjdGVyID0gQF9wcmV2aW91c0NoYXJhY3RlckZyb20ocG9pbnQpXG4gICAgaWYgT1BFTkVSUy5oYXNPd25Qcm9wZXJ0eShjaGFyYWN0ZXIpIG9yIENMT1NFUlMuaGFzT3duUHJvcGVydHkoY2hhcmFjdGVyKVxuICAgICAgcmVzdWx0ID0gbnVsbFxuICAgICAgc3RhY2sgPSBbXVxuICAgICAgcXVvdGVzID0gMFxuICAgICAgcmUgPSAvW14oKVtcXF17fVwiJ2BcXFxcXSt8XFxcXC58WygpW1xcXXt9XCInYF0vZ1xuICAgICAgQGVkaXRvci5iYWNrd2FyZHNTY2FuSW5CdWZmZXJSYW5nZSByZSwgW0JPQiwgcG9pbnRdLCAoaGl0KSA9PlxuICAgICAgICBpZiBoaXQubWF0Y2hUZXh0ID09IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdXG4gICAgICAgICAgc3RhY2sucG9wKClcbiAgICAgICAgICBpZiBzdGFjay5sZW5ndGggPT0gMFxuICAgICAgICAgICAgcmVzdWx0ID0gaGl0LnJhbmdlLnN0YXJ0XG4gICAgICAgICAgICBoaXQuc3RvcCgpXG4gICAgICAgICAgZWxzZSBpZiAvXltcIidgXSQvLnRlc3QoaGl0Lm1hdGNoVGV4dClcbiAgICAgICAgICAgIHF1b3RlcyAtPSAxXG4gICAgICAgIGVsc2UgaWYgKG9wZW5lciA9IENMT1NFUlNbaGl0Lm1hdGNoVGV4dF0pXG4gICAgICAgICAgdW5sZXNzIC9eW1wiJ2BdJC8udGVzdChvcGVuZXIpIGFuZCBxdW90ZXMgPiAwXG4gICAgICAgICAgICBzdGFjay5wdXNoKG9wZW5lcilcbiAgICAgICAgICAgIHF1b3RlcyArPSAxIGlmIC9eW1wiJ2BdJC8udGVzdChvcGVuZXIpXG4gICAgICAgIGVsc2UgaWYgT1BFTkVSU1toaXQubWF0Y2hUZXh0XVxuICAgICAgICAgIGlmIHN0YWNrLmxlbmd0aCA9PSAwXG4gICAgICAgICAgICBoaXQuc3RvcCgpXG4gICAgICByZXN1bHQgb3IgcG9pbnRcbiAgICBlbHNlXG4gICAgICBAX2xvY2F0ZUJhY2t3YXJkRnJvbShwb2ludCwgL1tcXFdcXG5dL2kpPy5lbmQgb3IgQk9CXG5cbiAgX2xpc3RGb3J3YXJkRnJvbTogKHBvaW50KSAtPlxuICAgIGVvYiA9IEBlZGl0b3IuZ2V0RW9mQnVmZmVyUG9zaXRpb24oKVxuICAgIGlmICEobWF0Y2ggPSBAX2xvY2F0ZUZvcndhcmRGcm9tKHBvaW50LCAvWygpW1xcXXt9XS9pKSlcbiAgICAgIHJldHVybiBudWxsXG4gICAgZW5kID0gdGhpcy5fc2V4cEZvcndhcmRGcm9tKG1hdGNoLnN0YXJ0KVxuICAgIGlmIGVuZC5pc0VxdWFsKG1hdGNoLnN0YXJ0KSB0aGVuIG51bGwgZWxzZSBlbmRcblxuICBfbGlzdEJhY2t3YXJkRnJvbTogKHBvaW50KSAtPlxuICAgIGlmICEobWF0Y2ggPSBAX2xvY2F0ZUJhY2t3YXJkRnJvbShwb2ludCwgL1soKVtcXF17fV0vaSkpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIHN0YXJ0ID0gdGhpcy5fc2V4cEJhY2t3YXJkRnJvbShtYXRjaC5lbmQpXG4gICAgaWYgc3RhcnQuaXNFcXVhbChtYXRjaC5lbmQpIHRoZW4gbnVsbCBlbHNlIHN0YXJ0XG5cbiAgX2xvY2F0ZUJhY2t3YXJkRnJvbTogKHBvaW50LCByZWdFeHApIC0+XG4gICAgcmVzdWx0ID0gbnVsbFxuICAgIEBlZGl0b3IuYmFja3dhcmRzU2NhbkluQnVmZmVyUmFuZ2UgcmVnRXhwLCBbQk9CLCBwb2ludF0sIChoaXQpIC0+XG4gICAgICByZXN1bHQgPSBoaXQucmFuZ2VcbiAgICByZXN1bHRcblxuICBfbG9jYXRlRm9yd2FyZEZyb206IChwb2ludCwgcmVnRXhwKSAtPlxuICAgIHJlc3VsdCA9IG51bGxcbiAgICBlb2YgPSBAZWRpdG9yLmdldEVvZkJ1ZmZlclBvc2l0aW9uKClcbiAgICBAZWRpdG9yLnNjYW5JbkJ1ZmZlclJhbmdlIHJlZ0V4cCwgW3BvaW50LCBlb2ZdLCAoaGl0KSAtPlxuICAgICAgcmVzdWx0ID0gaGl0LnJhbmdlXG4gICAgcmVzdWx0XG5cbiAgX2dldFdvcmRDaGFyYWN0ZXJSZWdFeHA6IC0+XG4gICAgbm9uV29yZENoYXJhY3RlcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5ub25Xb3JkQ2hhcmFjdGVycycpXG4gICAgbmV3IFJlZ0V4cCgnW15cXFxccycgKyBlc2NhcGVSZWdFeHAobm9uV29yZENoYXJhY3RlcnMpICsgJ10nKVxuXG4gIF9nZXROb25Xb3JkQ2hhcmFjdGVyUmVnRXhwOiAtPlxuICAgIG5vbldvcmRDaGFyYWN0ZXJzID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Iubm9uV29yZENoYXJhY3RlcnMnKVxuICAgIG5ldyBSZWdFeHAoJ1tcXFxccycgKyBlc2NhcGVSZWdFeHAobm9uV29yZENoYXJhY3RlcnMpICsgJ10nKVxuXG4gIF9nb1RvOiAocG9pbnQpIC0+XG4gICAgaWYgcG9pbnRcbiAgICAgIEBjdXJzb3Iuc2V0QnVmZmVyUG9zaXRpb24ocG9pbnQpXG4gICAgICB0cnVlXG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuIyBTdG9sZW4gZnJvbSB1bmRlcnNjb3JlLXBsdXMsIHdoaWNoIHdlIGNhbid0IHNlZW0gdG8gcmVxdWlyZSgpIGZyb20gYSBwYWNrYWdlXG4jIHdpdGhvdXQgZGVwZW5kaW5nIG9uIGEgc2VwYXJhdGUgY29weSBvZiB0aGUgd2hvbGUgbGlicmFyeS5cbmVzY2FwZVJlZ0V4cCA9IChzdHJpbmcpIC0+XG4gIGlmIHN0cmluZ1xuICAgIHN0cmluZy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKVxuICBlbHNlXG4gICAgJydcblxuQk9CID0ge3JvdzogMCwgY29sdW1uOiAwfVxuIl19

"use strict";
var vscode_1 = require('vscode');
var alignment_1 = require('alignment');
var config = vscode_1.workspace.getConfiguration('align');
function activate(context) {
    var disposable = vscode_1.commands.registerCommand('extension.align', function () {
        var editor = vscode_1.window.activeTextEditor;
        var selections = editor.selections;
        if (selections.length > 1) {
            alignCursors();
        }
        else {
            alignSelections();
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function alignCursors() {
    var editor = vscode_1.window.activeTextEditor;
    var selections = editor.selections;
    var cursors = new Array();
    selections.forEach(function (selection, idx) {
        cursors[idx] = selection.active.character;
    });
    var padLen = cursorPadding(cursors);
    editor.edit(function (editBuilder) {
        selections.forEach(function (selection, idx) {
            editBuilder.insert(selection.active, Array(padLen[idx] + 1).join(' '));
        });
    });
    function cursorPadding(cursors) {
        var padLen = new Array();
        var maxIndent = Math.max.apply(Math, cursors);
        cursors.forEach(function (pos, idx) {
            padLen[idx] = maxIndent - pos;
        });
        return padLen;
    }
}
exports.alignCursors = alignCursors;
function alignSelections() {
    var leftConfig = config.get('leftSeparators');
    var rightConfig = config.get('rightSeparators');
    var ignoreConfig = config.get('ignoreSeparators');
    var spaceConfig = config.get('spaceSeparators');
    var editor = vscode_1.window.activeTextEditor;
    var selections = editor.selections;
    selections.forEach(function (selection) {
        var maxLen = Math.max(editor.document.lineAt(selection.active).text.length);
        var range = new vscode_1.Range(selection.start.line, 0, selection.end.line, maxLen);
        var text = editor.document.getText(range);
        var newBlock = alignment_1.block(text, {
            leftSeparators: leftConfig,
            rightSeparators: rightConfig,
            ignoreSeparators: ignoreConfig,
            spaceSeparators: spaceConfig
        });
        editor.edit(function (editBuilder) {
            editBuilder.replace(range, newBlock[0]);
        });
    });
}
exports.alignSelections = alignSelections;
//# sourceMappingURL=extension.js.map
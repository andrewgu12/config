"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const controller_1 = require("./api/controller");
function handleError(err) {
    if (err) {
        vscode_1.window.showErrorMessage(err);
    }
    return err;
}
exports.controller = new controller_1.FileController();
function moveFile(uri) {
    return exports.controller.showMoveFileDialog({ prompt: 'New Location', showFullPath: true, uri })
        .then((fileItem) => exports.controller.move(fileItem))
        .then((fileItem) => exports.controller.openFileInEditor(fileItem))
        .catch(handleError);
}
exports.moveFile = moveFile;
function renameFile() {
    return exports.controller.showMoveFileDialog({ prompt: 'New Name' })
        .then((fileItem) => exports.controller.move(fileItem))
        .then((fileItem) => exports.controller.openFileInEditor(fileItem))
        .catch(handleError);
}
exports.renameFile = renameFile;
function duplicateFile(uri) {
    return exports.controller.showMoveFileDialog({ prompt: 'Duplicate As', showFullPath: true, uri })
        .then((fileItem) => exports.controller.duplicate(fileItem))
        .then((fileItem) => exports.controller.openFileInEditor(fileItem))
        .catch(handleError);
}
exports.duplicateFile = duplicateFile;
function removeFile() {
    return exports.controller.showRemoveFileDialog()
        .then((fileItem) => exports.controller.remove(fileItem))
        .then(() => exports.controller.closeCurrentFileEditor())
        .catch(handleError);
}
exports.removeFile = removeFile;
function newFile(options) {
    const { relativeToRoot = false } = options || {};
    return exports.controller.showNewFileDialog({ prompt: 'File Name', relativeToRoot })
        .then((fileItem) => exports.controller.create({ fileItem }))
        .then((fileItem) => exports.controller.openFileInEditor(fileItem))
        .catch(handleError);
}
exports.newFile = newFile;
function newFileAtRoot() {
    return newFile({ relativeToRoot: true });
}
exports.newFileAtRoot = newFileAtRoot;
function newFolder(options) {
    const { relativeToRoot = false } = options || {};
    return exports.controller.showNewFileDialog({ prompt: 'Folder Name', relativeToRoot })
        .then((fileItem) => exports.controller.create({ fileItem, isDir: true }))
        .catch(handleError);
}
exports.newFolder = newFolder;
function newFolderAtRoot() {
    return newFolder({ relativeToRoot: true });
}
exports.newFolderAtRoot = newFolderAtRoot;
//# sourceMappingURL=commands.js.map
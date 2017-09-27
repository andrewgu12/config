"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const vscode_1 = require("vscode");
const item_1 = require("./item");
class FileController {
    showMoveFileDialog(options) {
        const { prompt, showFullPath = false, uri = null } = options;
        const sourcePath = uri && uri.fsPath || this.sourcePath;
        if (!sourcePath) {
            return Promise.reject(null);
        }
        const value = showFullPath ? sourcePath : path.basename(sourcePath);
        return Promise.resolve(vscode_1.window.showInputBox({ prompt, value }))
            .then((targetPath) => {
            if (targetPath) {
                targetPath = path.resolve(path.dirname(sourcePath), targetPath);
                return new item_1.FileItem(sourcePath, targetPath);
            }
        });
    }
    showNewFileDialog(options) {
        const { prompt, relativeToRoot = false } = options;
        let sourcePath = vscode_1.workspace.rootPath;
        if (!relativeToRoot && this.sourcePath) {
            sourcePath = path.dirname(this.sourcePath);
        }
        if (!sourcePath) {
            return Promise.reject(null);
        }
        return Promise.resolve(vscode_1.window.showInputBox({ prompt }))
            .then((targetPath) => {
            if (targetPath) {
                targetPath = path.resolve(sourcePath, targetPath);
                return new item_1.FileItem(sourcePath, targetPath);
            }
        });
    }
    showRemoveFileDialog() {
        const sourcePath = this.sourcePath;
        if (!sourcePath) {
            return Promise.reject(null);
        }
        const message = `Are you sure you want to delete '${path.basename(sourcePath)}'?`;
        const action = 'Delete';
        return Promise.resolve(vscode_1.window.showInformationMessage(message, { modal: true }, action))
            .then((remove) => remove && new item_1.FileItem(sourcePath));
    }
    move(fileItem) {
        return this.ensureWritableFile(fileItem)
            .then(() => fileItem.move());
    }
    duplicate(fileItem) {
        return this.ensureWritableFile(fileItem)
            .then(() => fileItem.duplicate());
    }
    remove(fileItem) {
        return fileItem.remove()
            .catch(() => Promise.reject(`Error deleting file '${fileItem.path}'.`));
    }
    create(options) {
        const { fileItem, isDir = false } = options;
        return this.ensureWritableFile(fileItem)
            .then(() => fileItem.create(isDir))
            .catch(() => Promise.reject(`Error creating file '${fileItem.targetPath}'.`));
    }
    openFileInEditor(fileItem) {
        const isDir = fs.statSync(fileItem.path).isDirectory();
        if (isDir) {
            return;
        }
        return Promise.resolve(vscode_1.workspace.openTextDocument(fileItem.path))
            .then((textDocument) => textDocument || Promise.reject('Could not open file!'))
            .then((textDocument) => vscode_1.window.showTextDocument(textDocument))
            .then((editor) => editor || Promise.reject('Could not show document!'));
    }
    closeCurrentFileEditor() {
        return vscode_1.commands.executeCommand('workbench.action.closeActiveEditor');
    }
    get sourcePath() {
        const activeEditor = vscode_1.window.activeTextEditor;
        const document = activeEditor && activeEditor.document;
        return document && document.fileName;
    }
    ensureWritableFile(fileItem) {
        if (!fileItem.exists) {
            return Promise.resolve(fileItem);
        }
        const message = `File '${fileItem.targetPath}' already exists.`;
        const action = 'Overwrite';
        return Promise.resolve(vscode_1.window.showInformationMessage(message, { modal: true }, action))
            .then((overwrite) => overwrite || Promise.reject(null))
            .then(() => fileItem);
    }
}
exports.FileController = FileController;
//# sourceMappingURL=controller.js.map
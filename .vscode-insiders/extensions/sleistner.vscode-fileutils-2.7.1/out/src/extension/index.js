"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const api = require("./commands");
function register(context, handler) {
    const command = `fileutils.${handler.name}`;
    const disposable = vscode_1.commands.registerCommand(command, handler);
    context.subscriptions.push(disposable);
}
function activate(context) {
    register(context, api.moveFile);
    register(context, api.renameFile);
    register(context, api.duplicateFile);
    register(context, api.removeFile);
    register(context, api.newFile);
    register(context, api.newFileAtRoot);
    register(context, api.newFolder);
    register(context, api.newFolderAtRoot);
}
exports.activate = activate;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra-promise");
const path = require("path");
class FileItem {
    constructor(sourcePath, targetPath) {
        this.SourcePath = sourcePath;
        this.TargetPath = targetPath;
    }
    get path() {
        return this.SourcePath;
    }
    get targetPath() {
        return this.TargetPath;
    }
    get exists() {
        return fs.existsSync(this.targetPath);
    }
    move() {
        return this.ensureDir()
            .then(() => fs.renameAsync(this.path, this.targetPath))
            .then(() => {
            this.SourcePath = this.targetPath;
            return this;
        });
    }
    duplicate() {
        return this.ensureDir()
            .then(() => fs.copyAsync(this.path, this.targetPath))
            .then(() => new FileItem(this.targetPath));
    }
    remove() {
        return Promise.resolve(fs.removeAsync(this.path))
            .then(() => this);
    }
    create(isDir = false) {
        const fn = isDir ? fs.ensureDirAsync : fs.createFileAsync;
        return Promise.resolve(fs.removeAsync(this.targetPath))
            .then(() => fn(this.targetPath))
            .then(() => new FileItem(this.targetPath));
    }
    ensureDir() {
        return Promise.resolve(fs.ensureDirAsync(path.dirname(this.targetPath)));
    }
}
exports.FileItem = FileItem;
//# sourceMappingURL=item.js.map
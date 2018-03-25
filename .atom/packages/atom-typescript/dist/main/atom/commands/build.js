"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("./registry");
const utils_1 = require("../utils");
registry_1.addCommand("atom-text-editor", "typescript:build", deps => ({
    description: "Compile all files in project related to current active text editor",
    async didDispatch(e) {
        if (!utils_1.commandForTypeScript(e)) {
            return;
        }
        const fpp = utils_1.getFilePathPosition(e.currentTarget.getModel());
        if (!fpp) {
            e.abortKeyBinding();
            return;
        }
        const { file } = fpp;
        const client = await deps.getClient(file);
        const projectInfo = await client.execute("projectInfo", {
            file,
            needFileNameList: true,
        });
        const files = new Set(projectInfo.body.fileNames);
        files.delete(projectInfo.body.configFileName);
        let filesSoFar = 0;
        const stp = deps.getStatusPanel();
        const promises = [...files.values()].map(f => _finally(client.execute("compileOnSaveEmitFile", { file: f, forced: true }), () => {
            stp.update({ progress: { max: files.size, value: (filesSoFar += 1) } });
            if (files.size <= filesSoFar)
                stp.update({ progress: undefined });
        }));
        try {
            const results = await Promise.all(promises);
            if (results.some(result => result.body === false)) {
                throw new Error("Emit failed");
            }
            stp.update({ buildStatus: { success: true } });
        }
        catch (err) {
            console.error(err);
            stp.update({ buildStatus: { success: false, message: err.message } });
        }
    },
}));
function _finally(promise, callback) {
    promise.then(callback, callback);
    return promise;
}
//# sourceMappingURL=build.js.map
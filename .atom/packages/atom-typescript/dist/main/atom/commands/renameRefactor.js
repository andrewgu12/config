"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("./registry");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const renameView_1 = require("../views/renameView");
registry_1.addCommand("atom-text-editor", "typescript:rename-refactor", deps => ({
    description: "Rename symbol under text cursor everywhere it is used",
    async didDispatch(e) {
        if (!utils_1.commandForTypeScript(e)) {
            return;
        }
        const location = utils_1.getFilePathPosition(e.currentTarget.getModel());
        if (!location) {
            e.abortKeyBinding();
            return;
        }
        const client = await deps.getClient(location.file);
        const response = await client.execute("rename", location);
        const { info, locs } = response.body;
        if (!info.canRename) {
            return atom.notifications.addInfo("AtomTS: Rename not available at cursor location");
        }
        const newName = await renameView_1.showRenameDialog({
            autoSelect: true,
            title: "Rename Variable",
            text: info.displayName,
            onValidate: (newText) => {
                if (newText.replace(/\s/g, "") !== newText.trim()) {
                    return "The new variable must not contain a space";
                }
                if (!newText.trim()) {
                    return "If you want to abort : Press esc to exit";
                }
                return "";
            },
        });
        if (newName !== undefined) {
            locs.map(async (loc) => {
                await deps.withTypescriptBuffer(loc.file, async (buffer) => {
                    buffer.buffer.transact(() => {
                        for (const span of loc.locs) {
                            buffer.buffer.setTextInRange(utils_2.spanToRange(span), newName);
                        }
                    });
                });
            });
        }
    },
}));
//# sourceMappingURL=renameRefactor.js.map
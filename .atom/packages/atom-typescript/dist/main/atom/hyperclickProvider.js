"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const goToDeclaration_1 = require("./commands/goToDeclaration");
const utils_1 = require("./utils");
function getHyperclickProvider(clientResolver) {
    return {
        providerName: "typescript-hyperclick-provider",
        wordRegExp: /([A-Za-z0-9_])+|['"`](\\.|[^'"`\\\\])*['"`]/g,
        getSuggestionForWord(editor, _text, range) {
            if (!utils_1.isTypescriptGrammar(editor)) {
                return null;
            }
            const filePath = editor.getPath();
            if (!filePath) {
                return null;
            }
            return {
                range,
                callback: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const location = {
                        file: filePath,
                        line: range.start.row + 1,
                        offset: range.start.column + 1,
                    };
                    const client = yield clientResolver.get(location.file);
                    const result = yield client.executeDefinition(location);
                    goToDeclaration_1.handleDefinitionResult(result, location);
                }),
            };
        },
    };
}
exports.getHyperclickProvider = getHyperclickProvider;
//# sourceMappingURL=hyperclickProvider.js.map
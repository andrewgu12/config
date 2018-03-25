"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class CodefixProvider {
    constructor(clientResolver, errorPusher, withTypescriptBuffer) {
        this.clientResolver = clientResolver;
        this.errorPusher = errorPusher;
        this.withTypescriptBuffer = withTypescriptBuffer;
        this.supportedFixes = new WeakMap();
    }
    async runCodeFix(textEditor, bufferPosition) {
        const filePath = textEditor.getPath();
        if (!filePath || !this.errorPusher || !this.clientResolver || !this.withTypescriptBuffer) {
            return [];
        }
        const client = await this.clientResolver.get(filePath);
        const supportedCodes = await this.getSupportedFixes(client);
        const requests = this.errorPusher
            .getErrorsAt(filePath, utils_1.pointToLocation(bufferPosition))
            .filter(error => error.code && supportedCodes.has(error.code))
            .map(error => client.execute("getCodeFixes", {
            file: filePath,
            startLine: error.start.line,
            startOffset: error.start.offset,
            endLine: error.end.line,
            endOffset: error.end.offset,
            errorCodes: [error.code],
        }));
        const fixes = await Promise.all(requests);
        const results = [];
        for (const result of fixes) {
            if (result.body) {
                for (const fix of result.body) {
                    results.push(fix);
                }
            }
        }
        return results;
    }
    async applyFix(fix) {
        for (const f of fix.changes) {
            await this.withTypescriptBuffer(f.fileName, async (buffer) => {
                buffer.buffer.transact(() => {
                    for (const edit of f.textChanges.reverse()) {
                        buffer.buffer.setTextInRange(utils_1.spanToRange(edit), edit.newText);
                    }
                });
            });
        }
    }
    dispose() {
        // NOOP
    }
    async getSupportedFixes(client) {
        let codes = this.supportedFixes.get(client);
        if (codes) {
            return codes;
        }
        const result = await client.execute("getSupportedCodeFixes", undefined);
        if (!result.body) {
            throw new Error("No code fixes are supported");
        }
        codes = new Set(result.body.map(code => parseInt(code, 10)));
        this.supportedFixes.set(client, codes);
        return codes;
    }
}
exports.CodefixProvider = CodefixProvider;
//# sourceMappingURL=codefixProvider.js.map
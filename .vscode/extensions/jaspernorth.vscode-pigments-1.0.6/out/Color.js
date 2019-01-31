"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var ColorLibrary = require('tinycolor2');
function contrastColor(color) {
    var _a = ColorLibrary(color).toRgb(), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
}
function normaliseColor(color) {
    var _a = ColorLibrary(color).toRgb(), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
    return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}
var Color = /** @class */ (function () {
    function Color(color) {
        this.decorationOptions = [];
        this.color = normaliseColor(color);
        this.negativeColor = contrastColor(this.color);
        this.decorationType = vscode_1.window.createTextEditorDecorationType({
            backgroundColor: this.color,
            color: this.negativeColor,
            rangeBehavior: vscode_1.DecorationRangeBehavior.ClosedClosed
        });
    }
    Color.prototype.addOption = function (range) {
        this.decorationOptions.push({
            range: range
        });
    };
    return Color;
}());
exports.default = Color;
//# sourceMappingURL=Color.js.map
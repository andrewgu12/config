"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var ColorLibrary = require('color');
function negative(colorString) {
    var color = ColorLibrary(colorString);
    return color.negate().string();
}
var Color = /** @class */ (function () {
    function Color(color) {
        this.decorationOptions = [];
        this.color = color;
        this.negativeColor = negative(this.color);
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const settings_1 = require("./settings");
const init = require("./init");
const commands = require("./commands");
const vscode_extensions_1 = require("./utils/vscode-extensions");
const i18n_1 = require("./i18n");
const models_1 = require("./models");
const constants_1 = require("./constants");
function initialize(context) {
    const config = vscode_extensions_1.getVsiconsConfig();
    const settingsManager = new settings_1.SettingsManager(vscode);
    commands.registerCommands(context);
    init.manageWelcomeMessage(settingsManager);
    init.manageAutoApplyCustomizations(settingsManager.isNewVersion(), config, commands.applyCustomizationCommand);
    init.detectProject(vscode_extensions_1.findFiles, config)
        .then(results => {
        if (results && results.length && !vscode_extensions_1.asRelativePath(results[0].fsPath).includes('/')) {
            detectAngular(config, results);
        }
    });
    // Update the version in settings
    if (settingsManager.isNewVersion()) {
        settingsManager.updateStatus(settingsManager.getState().status);
    }
}
function detectAngular(config, results) {
    const projectInfo = init.getProjectInfo(results, models_1.Projects.angular);
    const i18nManager = new i18n_1.LanguageResourceManager(vscode.env.language);
    const presetValue = vscode_extensions_1.getConfig().inspect(`vsicons.presets.angular`).workspaceValue;
    const detectionResult = init.checkForAngularProject(presetValue, init.iconsDisabled(models_1.Projects.angular), !!projectInfo, i18nManager);
    if (!detectionResult.apply) {
        return;
    }
    init.applyDetection(i18nManager, detectionResult, config.projectDetection.autoReload, commands.applyCustomization, commands.showCustomizationMessage, commands.reload);
}
function activate(context) {
    initialize(context);
    // tslint:disable-next-line no-console
    console.info(`${constants_1.constants.extensionName} is active!`);
    exports.initialized = true;
}
exports.activate = activate;
// this method is called when your vscode is closed
function deactivate() {
    // no code here at the moment
}
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map
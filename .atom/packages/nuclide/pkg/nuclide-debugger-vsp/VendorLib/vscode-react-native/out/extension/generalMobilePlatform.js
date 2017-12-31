"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
Object.defineProperty(exports, "__esModule", { value: true });
// BEGIN MODIFIED BY PELMERS
// END MODIFIED BY PELMERS
const Q = require("q");
const packager_1 = require("../common/packager");
const packagerStatusIndicator_1 = require("./packagerStatusIndicator");
const settingsHelper_1 = require("./settingsHelper");
const OutputChannelLogger_1 = require("./log/OutputChannelLogger");
class GeneralMobilePlatform {
    constructor(runOptions, platformDeps = {}) {
        this.runOptions = runOptions;
        this.platformName = this.runOptions.platform;
        this.projectPath = this.runOptions.projectRoot;
        // BEGIN MODIFIED BY PELMERS
        this.packager = platformDeps.packager || new packager_1.Packager("", this.projectPath, settingsHelper_1.SettingsHelper.getPackagerPort());
        // END MODIFIED BY PELMERS
        this.packageStatusIndicator = platformDeps.packageStatusIndicator || new packagerStatusIndicator_1.PackagerStatusIndicator();
        this.logger = OutputChannelLogger_1.OutputChannelLogger.getChannel(`React Native: Run ${this.platformName}`, true);
        this.logger.clear();
    }
    runApp() {
        this.logger.info("Connected to packager. You can now open your app in the simulator.");
        return Q.resolve(void 0);
    }
    enableJSDebuggingMode() {
        this.logger.info("Debugger ready. Enable remote debugging in app.");
        return Q.resolve(void 0);
    }
    disableJSDebuggingMode() {
        this.logger.info("Debugger ready. Disable remote debugging in app.");
        return Q.resolve(void 0);
    }
    startPackager() {
        this.logger.info("Starting React Native Packager.");
        return this.packager.isRunning().then((running) => {
            if (running) {
                if (this.packager.getRunningAs() !== packager_1.PackagerRunAs.REACT_NATIVE) {
                    return this.packager.stop().then(() => this.packageStatusIndicator.updatePackagerStatus(packagerStatusIndicator_1.PackagerStatus.PACKAGER_STOPPED));
                }
                this.logger.info("Attaching to running React Native packager");
            }
            return void 0;
        })
            .then(() => {
            return this.packager.startAsReactNative();
        })
            .then(() => this.packageStatusIndicator.updatePackagerStatus(packagerStatusIndicator_1.PackagerStatus.PACKAGER_STARTED));
    }
    prewarmBundleCache() {
        // generalMobilePlatform should do nothing here. Method should be overriden by children for specific behavior.
        return Q.resolve(void 0);
    }
    getRunArgument() {
        throw new Error("Not yet implemented: GeneralMobilePlatform.getRunArgument");
    }
}
GeneralMobilePlatform.deviceString = "device";
GeneralMobilePlatform.simulatorString = "simulator";
exports.GeneralMobilePlatform = GeneralMobilePlatform;

//# sourceMappingURL=generalMobilePlatform.js.map

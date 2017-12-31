'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAgAckRgLine = parseAgAckRgLine;

var _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');

function parseAgAckRgLine(event) {
  if (event.kind === 'stdout') {
    const matches = event.data.trim().match(/^(.+):(\d+):(\d+):(.*)$/);
    if (matches != null && matches.length === 5) {
      const [file, row, column, line] = matches.slice(1);
      return _rxjsBundlesRxMinJs.Observable.of({
        file,
        row: parseInt(row, 10) - 1,
        column: parseInt(column, 10) - 1,
        line
      });
    }
  }
  return _rxjsBundlesRxMinJs.Observable.empty();
} /**
   * Copyright (c) 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the license found in the LICENSE file in
   * the root directory of this source tree.
   *
   * 
   * @format
   */
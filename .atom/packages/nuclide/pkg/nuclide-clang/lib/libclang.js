'use strict';

var _asyncToGenerator = _interopRequireDefault(require('async-to-generator'));

let getClangRequestSettings = (() => {
  var _ref = (0, _asyncToGenerator.default)(function* (src) {
    const settings = yield Promise.all(Array.from(clangRequestSettingsProviders.values()).map(function (provider) {
      return provider.getSettings(src);
    }));
    for (const requestSettings of settings) {
      if (requestSettings != null) {
        return requestSettings;
      }
    }
    return null;
  });

  return function getClangRequestSettings(_x) {
    return _ref.apply(this, arguments);
  };
})();

var _atom = require('atom');

var _featureConfig;

function _load_featureConfig() {
  return _featureConfig = _interopRequireDefault(require('nuclide-commons-atom/feature-config'));
}

var _nuclideRemoteConnection;

function _load_nuclideRemoteConnection() {
  return _nuclideRemoteConnection = require('../../nuclide-remote-connection');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 * @format
 */

const clangRequestSettingsProviders = new Set();

function getDefaultFlags() {
  const config = (_featureConfig || _load_featureConfig()).default.get('nuclide-clang');
  if (!config.enableDefaultFlags) {
    return null;
  }
  return config.defaultFlags;
}

const clangServices = new WeakSet();

module.exports = {
  registerRequestSettingsProvider(provider) {
    clangRequestSettingsProviders.add(provider);
    return new _atom.Disposable(() => clangRequestSettingsProviders.delete(provider));
  },

  getRelatedSourceOrHeader(src) {
    return (0, _asyncToGenerator.default)(function* () {
      return (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getClangServiceByNuclideUri)(src).getRelatedSourceOrHeader(src, (yield getClangRequestSettings(src)));
    })();
  },

  getDiagnostics(editor) {
    return (0, _asyncToGenerator.default)(function* () {
      const src = editor.getPath();
      if (src == null) {
        return null;
      }
      const contents = editor.getText();

      const defaultFlags = getDefaultFlags();
      const service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getClangServiceByNuclideUri)(src);

      // When we fetch diagnostics for the first time, reset the server state.
      // This is so the user can easily refresh the Clang + Buck state by reloading Atom.
      if (!clangServices.has(service)) {
        clangServices.add(service);
        yield service.reset();
      }

      return service.compile(src, contents, (yield getClangRequestSettings(src)), defaultFlags).refCount().toPromise();
    })();
  },

  getCompletions(editor, prefix) {
    return (0, _asyncToGenerator.default)(function* () {
      const src = editor.getPath();
      if (src == null) {
        return null;
      }
      const cursor = editor.getLastCursor();

      const line = cursor.getBufferRow();
      const column = cursor.getBufferColumn();
      const tokenStartColumn = column - prefix.length;

      const defaultFlags = getDefaultFlags();
      const service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getClangServiceByNuclideUri)(src);

      return service.getCompletions(src, editor.getText(), line, column, tokenStartColumn, prefix, (yield getClangRequestSettings(src)), defaultFlags);
    })();
  },

  /**
   * If a location can be found for the declaration, it will be available via
   * the 'location' field on the returned object.
   */
  getDeclaration(editor, line, column) {
    return (0, _asyncToGenerator.default)(function* () {
      const src = editor.getPath();
      if (src == null) {
        return null;
      }
      const defaultFlags = getDefaultFlags();
      const service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getClangServiceByNuclideUri)(src);
      return service.getDeclaration(src, editor.getText(), line, column, (yield getClangRequestSettings(src)), defaultFlags);
    })();
  },

  getDeclarationInfo(editor, line, column) {
    return (0, _asyncToGenerator.default)(function* () {
      const src = editor.getPath();
      if (src == null) {
        return Promise.resolve(null);
      }
      const defaultFlags = getDefaultFlags();

      const service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getServiceByNuclideUri)('ClangService', src);
      if (service == null) {
        return Promise.resolve(null);
      }

      return service.getDeclarationInfo(src, editor.getText(), line, column, (yield getClangRequestSettings(src)), defaultFlags);
    })();
  },

  getOutline(editor) {
    return (0, _asyncToGenerator.default)(function* () {
      const src = editor.getPath();
      if (src == null) {
        return Promise.resolve();
      }
      const defaultFlags = getDefaultFlags();
      const service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getClangServiceByNuclideUri)(src);
      return service.getOutline(src, editor.getText(), (yield getClangRequestSettings(src)), defaultFlags);
    })();
  },

  getLocalReferences(editor, line, column) {
    return (0, _asyncToGenerator.default)(function* () {
      const src = editor.getPath();
      if (src == null) {
        return Promise.resolve(null);
      }
      const defaultFlags = getDefaultFlags();

      const service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getServiceByNuclideUri)('ClangService', src);
      if (service == null) {
        return Promise.resolve(null);
      }

      return service.getLocalReferences(src, editor.getText(), line, column, (yield getClangRequestSettings(src)), defaultFlags);
    })();
  },

  formatCode(editor, range) {
    return (0, _asyncToGenerator.default)(function* () {
      const fileUri = editor.getPath();
      const buffer = editor.getBuffer();
      const cursor = buffer.characterIndexForPosition(editor.getLastCursor().getBufferPosition());
      if (fileUri == null) {
        return {
          formatted: editor.getText()
        };
      }
      const startIndex = buffer.characterIndexForPosition(range.start);
      const endIndex = buffer.characterIndexForPosition(range.end);
      const service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getClangServiceByNuclideUri)(fileUri);
      return Object.assign({}, (yield service.formatCode(fileUri, editor.getText(), cursor, startIndex, endIndex - startIndex)));
    })();
  },

  resetForSource(editor) {
    const src = editor.getPath();
    if (src != null) {
      clangRequestSettingsProviders.forEach(provider => provider.resetForSource(src));
      const service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getClangServiceByNuclideUri)(src);
      return service.resetForSource(src);
    }
  },

  reset(host) {
    return (0, _asyncToGenerator.default)(function* () {
      clangRequestSettingsProviders.forEach(function (provider) {
        return provider.reset(host);
      });
      yield (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getClangServiceByNuclideUri)(host).reset();
    })();
  }
};
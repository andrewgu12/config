'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asyncToGenerator = _interopRequireDefault(require('async-to-generator'));

var _memoize2;

function _load_memoize() {
  return _memoize2 = _interopRequireDefault(require('lodash/memoize'));
}

// returns either a list of allowed ports, or null if not restricted
let getAllowedPorts = (() => {
  var _ref2 = (0, _asyncToGenerator.default)(function* () {
    const fetchSitevarOnce = requireFetchSitevarOnce();
    if (fetchSitevarOnce == null) {
      return null;
    }
    const allowedPorts = yield fetchSitevarOnce('NUCLIDE_TUNNEL_ALLOWED_PORTS');
    if (allowedPorts == null) {
      return [];
    }
    return allowedPorts;
  });

  return function getAllowedPorts() {
    return _ref2.apply(this, arguments);
  };
})();

let validateTunnel = (() => {
  var _ref3 = (0, _asyncToGenerator.default)(function* (tunnel) {
    if (tunnel.to.host === 'localhost') {
      return true;
    }
    const allowedPorts = yield getAllowedPorts();
    if (allowedPorts == null) {
      return true;
    }

    return allowedPorts.includes(tunnel.to.port);
  });

  return function validateTunnel(_x2) {
    return _ref3.apply(this, arguments);
  };
})();

exports.openTunnelEpic = openTunnelEpic;

var _Actions;

function _load_Actions() {
  return _Actions = _interopRequireWildcard(require('./Actions'));
}

var _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');

var _nuclideRemoteConnection;

function _load_nuclideRemoteConnection() {
  return _nuclideRemoteConnection = require('../../../nuclide-remote-connection/');
}

var _nuclideUri;

function _load_nuclideUri() {
  return _nuclideUri = _interopRequireDefault(require('nuclide-commons/nuclideUri'));
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

function openTunnelEpic(actions, store) {
  return actions.ofType((_Actions || _load_Actions()).OPEN_TUNNEL).switchMap((() => {
    var _ref = (0, _asyncToGenerator.default)(function* (action) {
      if (!(action.type === (_Actions || _load_Actions()).OPEN_TUNNEL)) {
        throw new Error('Invariant violation: "action.type === Actions.OPEN_TUNNEL"');
      }

      const { tunnel, onOpen, onClose } = action.payload;

      if (!(yield validateTunnel(tunnel))) {
        onOpen(new Error('Invalid tunnel specification: ' + JSON.stringify(tunnel)));
        return null;
      }

      const { from, to } = tunnel;
      const fromService = getSocketServiceByHost(from.host);
      const toService = getSocketServiceByHost(to.host);
      let clientCount = 0;

      const connectionFactory = yield toService.getConnectionFactory();
      const tunnelDescriptor = {
        from: {
          host: from.host,
          port: from.port,
          family: from.family || 6
        },
        to: {
          host: to.host,
          port: to.port,
          family: to.family || 6
        }
      };

      const events = fromService.createTunnel(tunnelDescriptor, connectionFactory);

      const subscription = events.refCount().subscribe({
        next: function (event) {
          if (event.type === 'server_started') {
            store.dispatch((_Actions || _load_Actions()).setTunnelState(tunnel, 'ready'));
            onOpen();
          } else if (event.type === 'client_connected') {
            clientCount++;
            store.dispatch((_Actions || _load_Actions()).setTunnelState(tunnel, 'active'));
          } else if (event.type === 'client_disconnected') {
            clientCount--;
            if (clientCount === 0) {
              store.dispatch((_Actions || _load_Actions()).setTunnelState(tunnel, 'ready'));
            }
          }
        }
      });

      return (_Actions || _load_Actions()).addOpenTunnel(tunnel, function (error) {
        subscription.unsubscribe();
        onClose(error);
      });
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })()).switchMap(action => {
    if (action == null) {
      return _rxjsBundlesRxMinJs.Observable.empty();
    } else {
      return _rxjsBundlesRxMinJs.Observable.of(action);
    }
  });
}

function getSocketServiceByHost(host) {
  if (host === 'localhost') {
    return (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getSocketServiceByNuclideUri)('');
  } else {
    const uri = (_nuclideUri || _load_nuclideUri()).default.createRemoteUri(host, '/');
    return (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getSocketServiceByNuclideUri)(uri);
  }
}

// require fb-sitevar module lazily
const requireFetchSitevarOnce = (0, (_memoize2 || _load_memoize()).default)(() => {
  try {
    // $FlowFB
    return require('../../../commons-node/fb-sitevar').fetchSitevarOnce;
  } catch (e) {
    return null;
  }
});
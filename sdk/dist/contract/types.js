"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainId = void 0;
var ChainId;
(function (ChainId) {
    ChainId[ChainId["Mainnet"] = 1] = "Mainnet";
    ChainId[ChainId["Ropsten"] = 3] = "Ropsten";
    ChainId[ChainId["Rinkeby"] = 4] = "Rinkeby";
    ChainId[ChainId["Kovan"] = 42] = "Kovan";
    ChainId[ChainId["Local"] = 31337] = "Local";
})(ChainId = exports.ChainId || (exports.ChainId = {}));

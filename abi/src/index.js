"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Descriptor__factory = exports.Seeder__factory = exports.AuctionHouse__factory = exports.WizardToken__factory = exports.SeederABI = exports.DescriptorABI = exports.AuctionHouseABI = exports.WizardsTokenABI = void 0;
var WizardToken_json_1 = require("../artifacts/contracts/internal/Wizards.sol/WizardToken.json");
Object.defineProperty(exports, "WizardsTokenABI", { enumerable: true, get: function () { return __importDefault(WizardToken_json_1).default; } });
var AuctionHouse_json_1 = require("../artifacts/contracts/internal/auctionhouse/AuctionHouse.sol/AuctionHouse.json");
Object.defineProperty(exports, "AuctionHouseABI", { enumerable: true, get: function () { return __importDefault(AuctionHouse_json_1).default; } });
var Descriptor_json_1 = require("../artifacts/contracts/internal/descriptor/Descriptor.sol/Descriptor.json");
Object.defineProperty(exports, "DescriptorABI", { enumerable: true, get: function () { return __importDefault(Descriptor_json_1).default; } });
var Seeder_json_1 = require("../artifacts/contracts/internal/seeder/Seeder.sol/Seeder.json");
Object.defineProperty(exports, "SeederABI", { enumerable: true, get: function () { return __importDefault(Seeder_json_1).default; } });
var WizardToken__factory_1 = require("../typechain/factories/WizardToken__factory");
Object.defineProperty(exports, "WizardToken__factory", { enumerable: true, get: function () { return WizardToken__factory_1.WizardToken__factory; } });
var AuctionHouse__factory_1 = require("../typechain/factories/AuctionHouse__factory");
Object.defineProperty(exports, "AuctionHouse__factory", { enumerable: true, get: function () { return AuctionHouse__factory_1.AuctionHouse__factory; } });
var Seeder__factory_1 = require("../typechain/factories/Seeder__factory");
Object.defineProperty(exports, "Seeder__factory", { enumerable: true, get: function () { return Seeder__factory_1.Seeder__factory; } });
var Descriptor__factory_1 = require("../typechain/factories/Descriptor__factory");
Object.defineProperty(exports, "Descriptor__factory", { enumerable: true, get: function () { return Descriptor__factory_1.Descriptor__factory; } });

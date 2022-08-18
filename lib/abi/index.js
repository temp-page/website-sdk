"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TWAMMInstantSwap = exports.Pair = exports.BananaClaimable = exports.Banana = exports.Multicall2 = exports.IERC20 = void 0;
/**
 * ABI
 */
const IERC20_json_1 = __importDefault(require("./IERC20.json"));
const Multicall2_json_1 = __importDefault(require("./Multicall2.json"));
const IBanana_json_1 = __importDefault(require("./IBanana.json"));
const BananaClaimable_json_1 = __importDefault(require("./BananaClaimable.json"));
const IPair_json_1 = __importDefault(require("./IPair.json"));
const ITWAMMInstantSwap_json_1 = __importDefault(require("./ITWAMMInstantSwap.json"));
const IERC20 = IERC20_json_1.default;
exports.IERC20 = IERC20;
const Multicall2 = Multicall2_json_1.default;
exports.Multicall2 = Multicall2;
const Banana = IBanana_json_1.default;
exports.Banana = Banana;
const BananaClaimable = BananaClaimable_json_1.default;
exports.BananaClaimable = BananaClaimable;
const Pair = IPair_json_1.default;
exports.Pair = Pair;
const TWAMMInstantSwap = ITWAMMInstantSwap_json_1.default;
exports.TWAMMInstantSwap = TWAMMInstantSwap;

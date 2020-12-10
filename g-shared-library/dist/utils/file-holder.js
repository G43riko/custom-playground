"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true, get: function () {
            return m[k];
        }
    });
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.FileHolder = void 0;
var fs = __importStar(require("fs"));
var FileHolder = /** @class */ (function () {
    function FileHolder() {
    }

    FileHolder.writeFileSync = function (path, content, options) {
        if (options === void 0) {
            options = {};
        }
        var encoding = (options.encoding || "utf8");
        fs.writeFileSync(path, content, {encoding: encoding});
    };
    FileHolder.isFile = function (path) {
        return fs.statSync(path).isFile();
    };
    FileHolder.readFileSync = function (path, options) {
        if (options === void 0) {
            options = {};
        }
        var encoding = (options.encoding || "utf8");
        return fs.readFileSync(path, {encoding: encoding});
    };
    return FileHolder;
}());
exports.FileHolder = FileHolder;

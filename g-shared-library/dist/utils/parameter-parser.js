"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.ParsedArguments = void 0;
var glob_1 = __importDefault(require("glob"));
var path_1 = __importDefault(require("path"));
var file_holder_1 = require("./file-holder");
var ParsedArguments = /** @class */ (function () {
    function ParsedArguments(
        /**
         * node/ts-node
         */
        runner,
        /**
         * path to script.
         */
        script,
        /**
         * Real params
         */
        params) {
        var _a;
        this.runner = runner;
        this.script = script;
        this.params = params;
        this.processedParameters = {};
        for (var i = 0; i < params.length;) {
            var currentParam = params[i];
            if (currentParam.startsWith("--")) {
                var paramName = currentParam.substring(2);
                var values = [];
                var tmpIndex = i + 1;
                while (!((_a = params[tmpIndex]) === null || _a === void 0 ? void 0 : _a.startsWith("--"))) {
                    values.push(params[tmpIndex++]);
                }
                this.processedParameters[paramName] = {
                    value: values[0],
                    values: values.length ? values : [],
                };
                i = tmpIndex;
            } else {
                i++;
            }
        }
        console.error("this.processedParameters: ", JSON.stringify(this.processedParameters));
    }
    Object.defineProperty(ParsedArguments.prototype, "first", {
        get: function () {
            return this.params[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ParsedArguments.prototype, "firstResolvedFile", {
        get: function () {
            return path_1.default.resolve(this.first);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ParsedArguments.prototype, "globSync", {
        get: function () {
            return glob_1.default.sync(this.first);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ParsedArguments.prototype, "globFilesSync", {
        get: function () {
            return this.globSync.filter(file_holder_1.FileHolder.isFile);
        },
        enumerable: false,
        configurable: true
    });
    ParsedArguments.createProcessArgs = function (args) {
        if (args === void 0) {
            args = process.argv;
        }
        var runner = args[0], script = args[1], params = args.slice(2);
        return new ParsedArguments(runner, script, params);
    };
    Object.defineProperty(ParsedArguments.prototype, "globResolvedFilesSync", {
        get: function () {
            return this.globFilesSync.map(function (e) {
                return path_1.default.resolve(e);
            });
        },
        enumerable: false,
        configurable: true
    });
    ParsedArguments.prototype.hasFlag = function (flag) {
        return this.params.includes(flag);
    };
    return ParsedArguments;
}());
exports.ParsedArguments = ParsedArguments;

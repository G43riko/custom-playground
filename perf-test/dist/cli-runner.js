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
var g_shared_library_1 = require("g-shared-library");
var perf_test_holder_1 = require("./perf-test-holder");
var fs = __importStar(require("fs"));
var CliRunner = /** @class */ (function () {
    function CliRunner() {
    }

    CliRunner.start = function () {
        var parsedArgs = g_shared_library_1.ParsedArguments.createProcessArgs();
        var filePath = parsedArgs.firstResolvedFile;
        var fileContent = fs.readFileSync(filePath, {encoding: "utf8"});
        var testRunner = new perf_test_holder_1.PerfTestHolder(fileContent, {testMemory: parsedArgs.hasFlag("--memory")});
        testRunner.runAllTests();
    };
    return CliRunner;
}());
CliRunner.start();

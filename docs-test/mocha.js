'use strict';
const FileTest = require("./dist/index");

const fs = require('fs');
const path = require('path');

const loadDoctests = function loadDoctests(module, filename) {
    const rootDir = process.cwd();

    const content = fs.readFileSync(filename, 'utf8');
    const tests = FileTest.FileTest.create(content);
    if (!tests) {
        return module._compile("console.log('No performance-tests for file " + filename + "')");
    }

    // const mochaSpec = contentsToMochaSpec(rootDir, filename, content);
    fs.writeFileSync("tmpTest.js", tests.getTextContentForFile(filename, false), {encoding: "utf8"});
    module._compile(tests.getTextContentForFile(filename, false), filename);
};


let originalLoad;


module.exports = function () {
    if (originalLoad) {
        require.extensions['.js'] = originalLoad;
    } else {
        originalLoad = originalLoad || require.extensions['.js'];
        require.extensions['.js'] = function (module, filename) {
            if (filename.match(/node_modules/)) {
                return originalLoad(module, filename);
            }

            return loadDoctests(module, filename);
        };
    }
};

const path = require("path")

// if (path.basename(process.argv[0]) === "mocha") {
if (process.argv.some((arg) => arg.match(/mocha/i))) {
    require("./mocha")();
}

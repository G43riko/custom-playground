const fs = require("fs");
const pcl = require("./package.json");

const {scripts, ...result} = pcl;

fs.writeFileSync("dist/package.json", JSON.stringify(result, null, 4), {encoding: "utf8"});
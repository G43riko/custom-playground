const fs = require("fs");
const path = require("path");

const myArgs = process.argv.slice(2);
const fileName = myArgs[0];
const filePath = path.resolve(fileName)
const fileContent = fs.readFileSync(filePath, {encoding: "utf8"});
console.log('myArgs: ', myArgs);


const divider = /\/{9}/gim;

const extractHeaderItem = (key) => {
    const result = header.match(new RegExp(key + ": ?(.+)[\n\r]{1,2}", "i"));

    return result ? result[1] : undefined;
}
const [header, ...testContents] = fileContent.split(divider);
const title = extractHeaderItem("title");
const titleDivider = "=".repeat(title.length);
console.log(`${titleDivider}
${extractHeaderItem("title")}
${titleDivider}`);
console.log("Start measure " + testContents.length + " test cases");

const getMemory = () => {
    if (typeof performance !== "undefined" && (performance.memory && performance.memory.usedJSHeapSize)) {
        return performance.memory.usedJSHeapSize;
    }

    if (typeof process !== "undefined" && typeof process.memoryUsage === "function") {
        return process.memoryUsage().heapUsed;
    }
    return 0;
}

const testWrappers = testContents.map((content) => {
    const result = content.match(/\/ ?(.+)[\n\r]+((.|\n|\r)+)/i);
    return {
        title: result[1],
        content: new Function(result[2]),
        header: "____" + Math.random(),
    }
})

const testResults = testWrappers.map((wrapper, index) => {
    return new Promise((success, reject) => {
        let count = 0
        const finishTime = Date.now() + 1000;
        console.log("Running " + (index + 1) + " / " + testWrappers.length);
        console.log(gc());
        const startMemory = getMemory();
        while (finishTime > Date.now()) {
            wrapper.content();
            count++;
        }
        const memory = getMemory() - startMemory;
        success({
            count,
            wrapper,
            memory,
        })
    })
})

Promise.all(testResults).then((data) => {
    const max = Math.max(...data.map((d) => d.count));
    const maxTitleLength = Math.max(...data.map((d) => d.wrapper.title.length));
    data.forEach((item) => {
        console.log(item.wrapper.title + " - " + " ".repeat(maxTitleLength - item.wrapper.title.length) + item.count + " calls per second. " + item.memory + "b");
        console.log("#".repeat(Math.floor(item.count / max * 100)))
    })
})

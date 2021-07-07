const path = require("path");

module.exports = {
    entry: "./src/public_api.ts",
    mode: "development",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: [/node_modules/, /src\/tests/],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "diagram.js",
        library: "GDiagram",
        path: path.resolve(__dirname, "dist"),
    },
};

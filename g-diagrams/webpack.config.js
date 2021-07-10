const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: [/node_modules/, /src\/tests/],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }, {
                test: /\.ttf$/,
                use: ["file-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
        contentBase: "./dist",
    },
    plugins: [
        new MonacoWebpackPlugin({
            languages: ["typescript", "javascript", "java", "python", "json"],
        }),
        new HtmlWebpackPlugin({
            title: "My App",
            template: "src/index.html",
            filename: "index.html",
        }),
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
    },
};

const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const PATHS = {
    entryPoint: path.resolve(__dirname, "src/index.ts"),
    bundles: path.resolve(__dirname, "dist/_bundles"),
};

const config = {
    entry: {
        "g43-lib": [PATHS.entryPoint],
        "g43-lib.min": [PATHS.entryPoint],
    },
    devtool: "inline-source-map",
    mode: "development",
    output: {
        path: PATHS.bundles,
        filename: "[name].js",
        libraryTarget: "umd",
        library: "G43Lib",
        umdNamedDefine: true,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    optimization: {
        minimize: true,
        minimizer: [
            (compiler) => {
                new TerserPlugin({
                    test: /\.min\.js(\?.*)?$/i,
                }).apply(compiler);
            },
        ],
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            // loader: "awesome-typescript-loader",
            loader: "ts-loader",
            exclude: /node_modules/,
        }],
    },
};

module.exports = config;

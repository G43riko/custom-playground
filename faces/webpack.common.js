const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
    entry: {
        "face-detection": path.resolve(__dirname, "src/face-detection/script.ts"),
        "face-recognition": path.resolve(__dirname, "src/face-recognition/script.ts"),
    },
    // mode: "development",
    mode: "production",
    externals: {
        "faceapi": ["@vladmandic/face-api", path.resolve(__dirname, "lib/face-api.min.js")],
        "face-api": ["@vladmandic/face-api", path.resolve(__dirname, "lib/face-api.min.js")],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        fallback: {
            os: false,
            fs: false,
            util: false,
        },
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
    plugins: [
        new HtmlWebpackPlugin({
            filename: "face-detection/index.html",
            template: "src/face-detection/index.html",
            chunks: ["face-detection"],
        }),
        new CopyPlugin({
            patterns: [
                {from: "models", to: "models"},
                {from: "res", to: "res"},
            ],
        }),
        new HtmlWebpackPlugin({
            filename: "face-recognition/index.html",
            template: "src/face-recognition/index.html",
            chunks: ["face-recognition"],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                // loader: "awesome-typescript-loader",
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ],
    },
};

module.exports = config;

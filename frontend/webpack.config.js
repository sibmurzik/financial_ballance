const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");



module.exports = {
    entry: "./src/app.ts",
    mode: "development",
    devtool: "inline-source-map",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
        publicPath: "/",
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: true,
        port: 9001,
        historyApiFallback: true,
    },

    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    "sass-loader",

                ],
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }

        ],
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".scss"],
    },


    plugins: [

        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/components", to: "components"},
                {from: "./src/static/images", to: "static/images"},
                {from: "./src/static/fonts", to: "static/fonts"},
                {from: "./src/css", to: "css"},



            ],
        }),
    ],
};
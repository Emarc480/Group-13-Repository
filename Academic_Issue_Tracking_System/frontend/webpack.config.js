const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./static/frontend"),
        filename: "[name].js",
        publicPath: "/static/frontend/",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./templates/frontend/index.html",
            filename: "index.html",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpg|gif|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    optimization: {
        minimize: true,
    },
    devServer: {
        historyApiFallback: true,
    },
    //plugins: [
    //    new webpack.DefinePlugin({
    //        "process.env": {
    //            //affects react lib size
    //            NODE_ENV: JSON.stringify("production"),
    //        },
    //    }),
    //],
};
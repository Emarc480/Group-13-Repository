const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./static/frontend"),
        filename: "[name].js",
    },
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
                test: /\.(png|jpg|gif|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    optimization: {
        minimize: true,
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
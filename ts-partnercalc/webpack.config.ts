/* eslint-disable */
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')

module.exports = {
    entry: './src/components/index.tsx',
    target: 'web',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    {
                        loader: "@teamsupercell/typings-for-css-modules-loader",
                        options: {
                            banner: '// Automatically generated. Do not edit.\n/* eslint-disable */',
                        },
                    },
                    {
                        loader: "css-loader",
                        options: { modules: true },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json', '.css'],
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],
    },
    output: {
        filename: '[name].[fullhash:8].js',
        sourceMapFilename: '[name].[fullhash:8].map',
        chunkFilename: '[id].[fullhash:8].js',
        publicPath: '/',
    },
    devServer: {
        host: 'localhost',
        port: 7000,
        historyApiFallback: true,
        liveReload: false,
    },
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: 5,
        },
        runtimeChunk: 'single',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'components', 'index.html'),
            favicon: 'public/reassemble-icon.png',
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.config().parsed),
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public' }
            ]
        })
    ],
}

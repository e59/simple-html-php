let ExtractTextPlugin = require('extract-text-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
let webpack = require('webpack');
let path = require('path');

let extractSCSS = new ExtractTextPlugin('app.css');

module.exports = {
    entry: './src/entry.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'public/assets'),
        publicPath: '/'
    },
    module: {
        loaders: [
            { test: /\.scss$/i, loader: extractSCSS.extract(['css-loader', 'sass-loader']) },
            // {
            //     test: /\.woff2?$|\.ttf$|\.eot$|.*fonts.*\.svg$/,
            //     loader: "file-loader"
            // },
            { test: /.*fonts.*\.svg$/, loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=fonts/[name].[ext]' },
            { test: /\.woff$/, loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=fonts/[name].[ext]' },
            { test: /\.woff2$/, loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=fonts/[name].[ext]' },
            { test: /\.[ot]tf$/, loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=fonts/[name].[ext]' },
            { test: /\.eot$/, loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]' },
            {
                test: /^(?!.*\/fonts\/).*\.(gif|png|jpe?g|svg)$/i,
                loaders: [
                    'file-loader'
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    performance: {
        hints: false
    },
    plugins: [
        extractSCSS,
        new CopyWebpackPlugin([
            {
                from: 'src/assets/',
                to: '[path][name].[ext]'
            }
        ]),
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings: false
            }
        }),
        new OptimizeCssAssetsPlugin(),
        new BrowserSyncPlugin(
            // BrowserSync options
            {
                // browse to http://localhost:3000/ during development
                host: 'localhost',
                port: 3000,
                // proxy the Webpack Dev Server endpoint
                // (which should be serving on http://localhost:3100/)
                // through BrowserSync
                proxy: 'http://localhost/brava-frontend/public',
                files: ['src/templates', 'public/index.php', 'composer.json']
            },
            // plugin options
            {
                // prevent BrowserSync from reloading the page
                // and let Webpack Dev Server take care of this
                reload: false
            }
        )
    ]
}

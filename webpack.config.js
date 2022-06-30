const webpack = require("webpack");
const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    // entry: './assets/js/script.js',
    // output: {
    //     path: path.resolve(__dirname, 'dist'),
    //     filename: 'main.bundle.js'
    //   },
    // multi entry point b/c we split the code js into multi files 
    entry: {
        app: "./assets/js/script.js",
        events: "./assets/js/events.js",
        schedule: "./assets/js/schedule.js",
        tickets: "./assets/js/tickets.js"
    },
    // multi entry cause for multi output files
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
            // target all jpg files
                test: /\.jpg$/i,
            // bundle them together 
                use: [
                    {
                        // emit images w/o reducing the size 
                    loader: 'file-loader',
                    options: 
                        {
                            // remove default setting that may cause 
                            // paths to images might be formatted incorrectly. 
                            esModule: false,

                            // set file name
                            // Specifies a custom filename 
                            name (file) {
                                return "[path][name].[ext]"
                            },

                            // Specifies a custom public path for the target file(s).
                            publicPath: function(url) {
                            return url.replace("../", "/assets/")
                            }
                        }
                    },
                    {
                        loader: 'image-webpack-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static", // the report outputs to an HTML file in the dist folder
        })
    ],
    mode: 'development'
};
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    devServer: {
        port: 80,
        historyApiFallback: true,
        disableHostCheck: true,
    },
    publicPath: "/",
    outputDir: "dist",
    assetsDir: "static",
    indexPath: "index.html",
    filenameHashing: false,
    lintOnSave: true,
    runtimeCompiler: true,
    configureWebpack: {
        plugins: [
            new CleanWebpackPlugin()
        ]
    }
}

const path = require('path')
const webpack = require('webpack')
const webpackCommonConf = require('./webpack.common.js')
const { smart } = require('webpack-merge')
const { srcPath, distPath } = require('./paths')
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const vConsolePlugin = require('vconsole-webpack-plugin') // 页面打印
module.exports = smart(webpackCommonConf, {
    mode: 'development',
    entry: {
        index: path.join(srcPath, 'index.js')
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: 'file-loader'
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader', 'postcss-loader'] // 加了 postcss
            },
            {
                test: /\.less$/,
                loader: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            ENV: JSON.stringify('development')
        }),
        new HotModuleReplacementPlugin(),
        new vConsolePlugin({
            enable: false
        })
    ],
    devServer: {
        host:'0.0.0.0',
        port: 8080,
        progress: true,  // 显示打包的进度条
        contentBase: distPath,  // 根目录
        open: true,  // 自动打开浏览器
        compress: true,  // 启动 gzip 压缩
        hot: true,
        historyApiFallback:true,
        // 设置代理
        proxy: {
            '/api': {
                target: 'http://101.43.227.70:80',
                // target: 'http://www.qingcheng-eng.com',
                // target: 'http://www.qingchengeng.com',
                // target: 'http://81.70.229.127',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    },
    // watch: true, // 开启监听，默认为 false
    // watchOptions: {
    //     ignored: /node_modules/, // 忽略哪些
    //     // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    //     // 默认为 300ms
    //     aggregateTimeout: 300,
    //     // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    //     // 默认每隔1000毫秒询问一次
    //     poll: 1000
    // }
})

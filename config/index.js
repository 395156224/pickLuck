'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // 静态资源文件夹（一般存放css、js、image等文件
    assetsSubDirectory: 'static',
    // 根目录
    assetsPublicPath: '/',
    // 配置API代理，可利用该属性解决跨域的问题
    proxyTable: {
      '/proxy': {
        target: 'https://p.cn0909.com/Trend',
        changeOrigin: true,
        pathRewrite: {
          '^proxy': ''
        }
      }
    },
    // 可以被process.env.HOST覆盖
    // Various Dev Server settings
    host: '192.168.110.136', // can be overwritten by process.env.HOST
    // 可以被process.env.PORT覆盖
    port: 8888, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    // 编译后自动打开浏览器页面 http://localhost:3030/("port + host",默认"false"),设置路由重定向自动打开您的默认页面
    autoOpenBrowser: false,
    // 浏览器错误提示
    errorOverlay: true,
    // 跨平台错误提示
    notifyOnErrors: true,
    // webpack提供的使用文件系统（file system）获取文件改动的通知devServer.watchOptions（监控文件改动）
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */
    // webpack提供的用来调试的模式，有多个不同值代表不同的调试模式
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',
    // 配合devtool的配置，当给文件名插入新的hash导致清除缓存时是否生成source-map
    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    // 记录代码压缩前的位置信息，当产生错误时直接定位到未压缩前的位置，方便调试
    cssSourceMap: true
  },

  build: {
    // 编译后“首页面”生成的绝对路径和名字
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),
    // Paths
    // 打包编译的根路径（默认dist,存放打包压缩后的代码）
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 静态资源文件夹（一般存放css、js、image等文件）
    assetsSubDirectory: 'static',
    // 发布的根目录（dist文件夹所在路径）
    assetsPublicPath: '/',

    /**
     * Source Maps
     */
    // 是否开启source-map
    productionSourceMap: true,
    // 详细见 https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // 是否压缩
    productionGzip: false,
    // unit的gzip命令用来压缩文件（gzip模式下需要压缩的文件的拓展名有js和css)
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // 是否开启打包后的分析报告
    bundleAnalyzerReport: process.env.npm_config_report
  }
}

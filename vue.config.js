module.exports = {
  // 修改的配置
  // assetsPublicPath:'./',
  // 将baseUrl: '/api',改为baseUrl: '/',
  publicPath: '/',
  devServer: {
    proxy: {
      '/apis': {
        target: 'http://jingcaiadmin.manggeek.com/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/apis': '/'
        }
      }
    }
  }
}
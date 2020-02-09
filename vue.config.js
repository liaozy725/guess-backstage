module.exports = {
  // 修改的配置
  // assetsPublicPath:'./',
  // 将baseUrl: '/api',改为baseUrl: '/',
  publicPath: '/',
  devServer: {
    proxy: {
      '/apis': {
        target: 'http://admin.jkgame.org/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/apis': '/'
        }
      }
    }
  }
}
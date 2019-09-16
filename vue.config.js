module.exports = {
  // 修改的配置
  // 将baseUrl: '/api',改为baseUrl: '/',
  publicPath: '/',
  devServer: {
    proxy: {
      '/apis': {
        target: 'http://121.42.196.103:8282/jingcai/api/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/apis': '/'
        }
      }
    }
  }
}
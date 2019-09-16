module.exports = {
  devServer: {
    proxy: {
      '/apis': {
        target: 'http://121.42.196.103:8282/jingcai/api',
        changeOrigin: true
      }
    }
  }
}
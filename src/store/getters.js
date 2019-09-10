const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  token: state => state.user.token,
  getUserInfo: state => state.user.userInfo,
  errorLogs: state => state.errorLog.logs,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers,
}
export default getters
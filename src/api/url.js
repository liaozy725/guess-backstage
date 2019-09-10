var baseUrl = '',

  if (process.env.NODE_ENV === 'development') {
    baseUrl = 'https://testagent.xiaopangche.cn:30001';
  } else {
    baseUrl = window.g.baseUrl
  }

export {
  baseUrl
}
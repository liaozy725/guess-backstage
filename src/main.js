import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'animate.css'
import axios from 'axios'
import {Message} from 'element-ui'
import { from } from "_array-flatten@2.1.2@array-flatten";

Vue.use(ElementUI);
Vue.config.productionTip = false;

if (process.env.NODE_ENV == 'production') {
  // 生产环境
  axios.defaults.baseURL = window.g.baseURL;
} else {
  axios.defaults.baseURL = '/apis/';
}

/* 请求拦截 */
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  config.withCredentials = true;
  return config;
}, error => {
  // 对请求错误做些什么
  Message({
    showClose: true, message: "请求过程中发生了错误", type: 'error', duration: 4 * 1000
  })
  console.log("请求过程发生的错误消息：" + error);
  return Promise.reject(error);
});

/* 响应处理 */
axios.interceptors.response.use(response=>{
  try {
    if(response.data.retCode=='0'){
      return response.data;
    }else if(response.data.retCode=='10002'){
      store.commit("setToken",'');
      router.replace('/login');
    }else{
      Message({
        showClose: true, message: response.data.errorMsg || '请求异常', type: 'error', duration: 4 * 1000
      })
      return response.data;
    }
  } catch (error) {
    Message({
      showClose: true, message: "处理返回的数据发生异常", type: 'error', duration: 4 * 1000
    })
  }
},error=>{
  Message({
    showClose: true, message: "网络连接异常,请稍后再试", type: 'error', duration: 4 * 1000
  })
  return Promise.reject(error);
})

Vue.prototype.$http = axios;

// 从本地获取token  userInfo 缓存
try {
  let token = localStorage.getItem('token');
  if(token) store.commit("setToken",token);
  let userInfo = localStorage.getItem('setUserInfo');
  if(userInfo) store.commit("userInfo",userInfo);
} catch (error) {
  
}

// 过滤器
import * as myFilter from '@/utils/vx.js'

Object.keys(myFilter).forEach(key => {
    Vue.filter(key, myFilter[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
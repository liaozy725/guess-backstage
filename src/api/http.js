import axios from 'axios'
import { Message } from 'element-ui'
import {getSign} from '@/assets/js/sign.js'

/* 请求拦截 */
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  config.withCredentials = true;
  return config;
}, error => {
  // 对请求错误做些什么
  Message.error('请求过程中发生了错误')
  return Promise.reject(error);
});

/* 请求响应拦截 */
axios.interceptors.response.use(response => {
  try {
    if (response) {
      if (response.data.code == 0) {
        return response.data;
      } else {
        if (!response.config.url.includes('getJssdkSignature')) {
          Message({
            showClose: true,message: response.data.message || "出现异常状况！",type: 'error',duration: 4 * 1000
          })
        }
        return response.data;
      }
    }
  } catch (e) {
    Message.error('处理返回的数据发生异常')
  }
  return response.data;
}, error => {
  // 对响应错误做点什么
  Message.error('网络连接异常,请稍后再试')
  return Promise.reject(error);
})

export default {
  get(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: param
      }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  post(url, param) {
    param.sign = getSign(param)
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: param
      }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  postNoSign(url,param) {
    return new Promise((resolve, reject) => {
      axios({
          method: 'post',
          url,
          data: param
        }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

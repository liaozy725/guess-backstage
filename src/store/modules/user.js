// import { loginByUsername, logout } from '@/api/login'
import $vx from '@/utils/vx'
const user = {
  state: {
    token: $vx.localStorage.getItem('token'),
    userInfo:$vx.localStorage.getItem('user_info'),
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      // const userName = userInfo.userName.trim()
      return new Promise((resolve, reject) => {
        // loginByUsername(userInfo).then(async res => {
        //   // console.log(res)
        //   if (res.code === 0) {
        //     let data = res.data;
        //     let token = data.token_type + ' ' + data.access_token;
        //     $vx.localStorage.setItem('token', token);
        //     let obj = { clientId: userInfo.clientId, userName: userInfo.userName };
        //     let UserInfo = Object.assign(data.userAccountVO,obj);
        //     $vx.localStorage.setItem('user_info', UserInfo);
        //     commit('SET_TOKEN', token)
        //     commit('SET_USER_INFO', UserInfo)
        //   }
        //   resolve(res)
        // }).catch(e => {
        //   reject(e)
        // })
      })
    },
    // // 登出
    LogOut({ commit, state }) {
      // let userInfo = state.userInfo;
      // return new Promise((resolve, reject) => {
      //   logout({ clientId: userInfo.clientId, userName: userInfo.userName }).then((res) => {
      //     // console.log(res)
      //     if (res.code === 0) {
      //       $vx.localStorage.removeItem('token')
      //       $vx.localStorage.removeItem('user_info');
      //       commit('SET_TOKEN', '')
      //       commit('SET_USER_INFO', {})
      //       resolve()
      //     }
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })
    }
  }
}

export default user
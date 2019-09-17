import $vx from '@/utils/vx'
const user = {
  state: {
    token: $vx.localStorage.getItem('token'),
    userInfo:$vx.localStorage.getItem('userInfo'),
    gameList:[]
  },

  mutations: {
    setToken: (state, token) => {
      state.token = token;
      localStorage.setItem('token',token)
    },
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo;
      $vx.localStorage.setItem('userInfo',userInfo)
    },
    // 设置游戏列表
    setGameList: (state, list) =>{
      state.gameList = list || [];
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
      
    },
    
  }
}

export default user
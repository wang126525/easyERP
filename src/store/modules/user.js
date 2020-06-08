const user = {
  state: {
    token: window.localStorage.getItem('token'),
    userInfo: window.localStorage.getItem('userInfo')
  },
  actions: {
    userLogin({
      commit
    }, data) {
      commit('LOGIN', data);
    },
    userLogout({
      commit
    }) {
      commit('LOGOUT');
    }
  },
  mutations: {
    ['LOGIN']: (state, data) => {
      //更改token的值
      state.token = data.token;
      state.userInfo = data.userInfo;
      window.localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
      window.localStorage.setItem('token', data.token);
    },
    ['LOGOUT']: (state) => {
      //登出的时候要清除token
      state.token = null;
      state.userInfo = null;
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('userInfo');
    }
  },
  getters: {
    userole:state=>state.userInfo.userole  
  }
}

export default user

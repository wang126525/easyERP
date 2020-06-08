// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Viser from 'viser-vue'
import './assets/font/iconfont.css'
Vue.use(Element, {size: 'small'})
Vue.use(Viser)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (!token&&to.path!='/login') {
    next('/login')
  } else {
    next()
  }
})

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

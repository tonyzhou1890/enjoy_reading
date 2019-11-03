import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import meta from 'vue-meta'

import './style/index.less'
import './icons'
import './plugins/element.js'
import './permission' // permission control

Vue.config.productionTip = false

Vue.use(meta)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

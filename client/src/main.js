import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import TopHead from '@/components/TopHead.vue'
import PageMenu from '@/components/PageMenu.vue'
import Pagefooter from '@/components/PageFooter.vue'
import TimeSince from '@/components/TimeSince.vue'
import helper from "./helper";

Vue.config.productionTip = false
Vue.component('top-header', TopHead)
Vue.component('page-menu', PageMenu)
Vue.component('page-footer', Pagefooter)
Vue.component('time-since', TimeSince)

var settings = {
  networktime: 1459468800000,
  api:'http://localhost:3000/api/',
  ws:'http://localhost:3000',
  ws_path:'/ws'
}

window.conf = settings

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './filters'


import TopHead from '@/components/TopHead.vue'
import PageMenu from '@/components/PageMenu.vue'
import Pagefooter from '@/components/PageFooter.vue'
import TimeSince from '@/components/TimeSince.vue'
import w1 from '@/components/loading.vue'

Vue.config.productionTip = false
Vue.component('top-header', TopHead)
Vue.component('page-menu', PageMenu)
Vue.component('page-footer', Pagefooter)
Vue.component('time-since', TimeSince)
Vue.component('loader', w1)
var settings = {
  networktime: 1459468800000,
  api: 'api/',
  ws: 'http://localhost:3000',
  ws_path: '/ws'
}

window.conf = settings

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

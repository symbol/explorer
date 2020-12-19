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

import { loadConfig } from './config/loader';
import BootstrapVue from 'bootstrap-vue';
import 'vue-material-design-icons/styles.css';
import '@mdi/font/css/materialdesignicons.css';
import './styles/main.scss';

loadConfig().then(async () => {
	const Vue = (await import('vue')).default;
	const App = (await import('./App.vue')).default;
	const router = (await import('./router')).default;
	const store = (await import('./store')).default;

	window.Vue = Vue;
	Vue.config.productionTip = false;
	Vue.use(BootstrapVue);

	new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount('#app');
});

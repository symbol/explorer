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
import Router from 'vue-router'
import listPages from './config/list-pages'
import detailPages from './config/detail-pages'

Vue.use(Router)

const listPagesRoutes = listPages.pages.map(page => ({ ...page, component: () => import('./views/ListPage.vue') }))
const detailPagesRoutes = detailPages.pages.map(page => ({ ...page, component: () => import('./views/DetailPage.vue') }))

const routerConfig = {
  mode: 'history',
  routes: [
    ...listPagesRoutes,
    ...detailPagesRoutes,
    {
      path: '/',
      name: 'home',
      component: () =>
        import('./views/Home.vue')
    },
    {
      path: '/stat',
      name: 'stat',
      component: () =>
        import('./views/Stat.vue')
    },

    {
      path: '/terms',
      name: 'terms',
      component: () =>
        import('./views/Terms.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () =>
        import('./views/Privacy.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '*',
      name: '404',
      component: () => import('./views/NotFound.vue')
    }
  ]
}

export default new Router(routerConfig)

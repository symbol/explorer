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

Vue.use(Router)

const listPagesRoutes = listPages.pages.map( page => ({ ...page, component: () => import('./views/ListPage.vue') }))

const routerConfig = {
  mode: 'history',
  routes: [
    ...listPagesRoutes,
    {
      path: '/',
      name: 'home',
      component: () =>
        import('./views/Home.vue')
    },
    {
      path: '/block/:height',
      name: 'block-detail',
      component: () =>
        import('./views/BlockDetail.vue')
    },
    {
      path: '/transaction/:transactionHash',
      name: 'transaction-detail',
      component: () =>
        import('./views/TransactionDetail.vue')
    },
    {
      path: '/account/:address',
      name: 'account-detail',
      component: () =>
        import('./views/AccountDetail.vue')
    },
    {
      path: '/namespace/:namespaceId',
      name: 'namespace-detail',
      component: () =>
        import('./views/NamespaceDetail.vue')
    },
    {
      path: '/mosaic/:mosaicId',
      name: 'mosaic-detail',
      component: () =>
        import('./views/MosaicDetail.vue')
    },
    {
      path: '/nodes',
      name: 'nodes',
      component: () =>
        import('./views/Nodes.vue')
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

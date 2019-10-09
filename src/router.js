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

Vue.use(Router)

export default new Router({
  //mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () =>
        import('./views/Home.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/blocks',
      name: 'blocks',
      component: () =>
        import('./views/Blocks.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/block/:height',
      name: 'block-detail',
      component: () =>
        import('./views/BlockDetail.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/transactions',
      name: 'transaction',
      component: () =>
        import('./views/Transactions.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/transaction/:transactionHash',
      name: 'transaction-detail',
      component: () =>
        import('./views/TransactionDetail.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/account',
      name: 'account',
      component: () =>
        import('./views/Account.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/account/:address',
      name: 'account-detail',
      component: () =>
        import('./views/AccountDetail.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/namespace',
      name: 'namespace',
      component: () =>
        import('./views/Namespace.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/namespace/:namespaceId',
      name: 'namespace-detail',
      component: () =>
        import('./views/NamespaceDetail.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/mosaic',
      name: 'mosaic',
      component: () =>
        import('./views/Mosaic.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/mosaic/:mosaicId',
      name: 'mosaic-detail',
      component: () =>
        import('./views/MosaicDetail.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/node',
      name: 'Nodes',
      component: () =>
        import('./views/Nodes.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/stat',
      name: 'Stat',
      component: () =>
        import('./views/Stat.vue'),
      meta: {
        title: ''
      }
    },

    {
      path: '/test',
      name: 'test',
      component: () =>
        import('./views/Home.vue'),
      meta: {
        title: ''
      }
    },

    {
      path: '/test/account/:address',
      name: 'account',
      component: () => import('./views/test/AccountDetail.vue'),
    },
    {
      path: '/test/blocks',
      name: 'blocklist',
      component: () => import('./views/test/Blocks.vue'),
    },
    {
      path: '/test/block/:height',
      name: 'blockdetail',
      component: () => import('./views/test/BlockDetail.vue'),
    },
    {
      path: '/test/transactions',
      name: 'transactionlist',
      component: () => import('./views/test/Transactions.vue'),
    },
    {
      path: '/test/transaction/:id',
      name: 'transactiondetail',
      component: () => import('./views/test/TransactionDetail.vue'),
    },
    {
      path: '*',
      name: '404',
      component: () => import('./views/test/NotFound.vue'),
    }
    // {
    //   path: '/404',
    //   component: import(/* webpackChunkName: "about" */ "./views/About.vue")
    // },
  ]
})

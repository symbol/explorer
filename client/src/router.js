import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
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
      name: 'Blocks',
      component: () =>
        import('./views/Blocks.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/block/:blockid',
      name: 'Blocks_details',
      component: () =>
        import('./views/Block-detail.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: () =>
        import('./views/Transaction.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/transaction/:trx_id',
      name: 'transaction details',
      component: () =>
        import('./views/Transaction-detail.vue'),
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
      path: '/account/:acnt_adrs',
      name: 'account detail',
      component: () =>
        import('./views/Account-detail.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/Namespace',
      name: 'Namespace',
      component: () =>
        import('./views/Namespace.vue'),
      meta: {
        title: ''
      }
    },
    {
      path: '/Namespace/:namespace_id',
      name: 'Namespace detail',
      component: () =>
        import('./views/Namespace-detail.vue'),
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
      path: '/mosaic/:ns/:m',
      name: 'mosaic detail',
      component: () =>
        import('./views/Mosaic-detail.vue'),
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
    }
    // {
    //   path: '/404',
    //   component: import(/* webpackChunkName: "about" */ "./views/About.vue")
    // },
  ]
})

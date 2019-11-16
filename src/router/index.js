import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 普通路由，不需要权限
export const constantRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home'),
    meta: {
      title: '享阅'
    }
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('@/views/about'),
  //   meta: {
  //     title: '关于享阅'
  //   }
  // },
  {
    path: '/tag/:tag',
    name: 'Tag',
    component: () => import('@/views/tag')
  },
  {
    path: '/search/:keyword',
    name: 'Search',
    component: () => import('@/views/search')
  },
  {
    path: '/latest',
    name: 'Latest',
    component: () => import('@/views/latest'),
    meta: {
      title: '最新上架'
    }
  },
  {
    path: '/discount',
    name: 'Discount',
    component: () => import('@/views/discount'),
    meta: {
      title: '打折书籍'
    }
  },
  {
    path: '/free',
    name: 'Free',
    component: () => import('@/views/free'),
    meta: {
      title: '免费书籍'
    }
  },
  {
    path: '/book/detail/:name/:uuid',
    name: 'BookDetail',
    component: () => import('@/views/detail')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    meta: {
      title: '404'
    }
  }
]

// 需要权限的路由
export const asyncRoutes = [
  {
    path: '/baseInfo',
    name: 'BaseInfo',
    component: () => import('@/views/baseInfo'),
    meta: {
      roles: ['common', 'admin', 'publisher'],
      title: '基本信息'
    }
  },
  {
    path: '/store',
    name: 'Store',
    component: () => import('@/views/store'),
    meta: {
      roles: ['common', 'admin', 'publisher'],
      title: '书库'
    }
  },
  {
    path: '/shelf',
    name: 'Shelf',
    component: () => import('@/views/shelf'),
    meta: {
      roles: ['common', 'admin', 'publisher'],
      title: '书架'
    }
  },
  {
    path: '/space',
    name: 'Space',
    component: () => import('@/views/space'),
    meta: {
      roles: ['common', 'admin', 'publisher'],
      title: '空间管理'
    }
  },
  {
    path: '/shoppingCart',
    name: 'ShoppingCart',
    component: () => import('@/views/shoppingCart'),
    meta: {
      roles: ['common', 'admin', 'publisher'],
      title: '购物车'
    }
  },
  {
    path: '/scoreRecord',
    name: 'ScoreRecord',
    component: () => import('@/views/scoreRecord'),
    meta: {
      roles: ['common', 'admin', 'publisher'],
      title: '积分记录'
    }
  },
  {
    path: '*',
    redirect: '/404'
  }
]

export default new Router({
  routes: [
    ...constantRoutes,
    ...asyncRoutes
  ],
  mode: 'history'
})

import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import session from '@/utils/session.js'
import Welcome from '../components/Welcome.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/home/Welcome',
    children: [
      {
        path: '/home/Welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: () => import(/* chunkname */ '@/components/user/Users.vue')
      },
      {
        path: '/rights',
        component: () => import(/* chunkname */ '@/components/power/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import(/* chunkname */ '@/components/power/Roles.vue')
      },
      {
        path: '/categories',
        component: () => import(/* chunkname */ '@/components/goods/Cate.vue')
      },
      {
        path: '/goods',
        component: () => import(/* chunkname */ '@/components/goods/GoodsList.vue')
      },
      {
        path: '/params',
        component: () => import(/* chunkname */ '@/components/goods/CateParams.vue')
      },
      {
        path: '/goods/add',
        component: () => import(/* chunkname */ '@/components/goods/GoodsAdd.vue')
      },
      {
        path: '/orders',
        component: () => import(/* chunkname */ '@/components/order/Order.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = session.get('token')
  if (!token) return next('/login')
  next()
})

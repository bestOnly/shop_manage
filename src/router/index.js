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
    children: [{
      path: '/home/Welcome',
      component: Welcome
    },
    {
      path: '/users',
      component: () => import(/* chunkname */ '@/components/user/Users.vue')
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

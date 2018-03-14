import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/auth'

import Auth from '../components/Auth'
import Reader from '../components/Reader'
import Home from '../components/Home'

Vue.use(Router)

var routes = [
  { path: '', name: 'home', component: Home },
  { path: '/auth', name: 'auth', component: Auth, meta: { guestOnly: true } },
  { path: '/reader', name: 'reader', component: Reader, meta: { requireAuth: true } },
  { path: '*', redirect: '/home' }
]

export const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  let currentUser = auth.user()
  let requireAuth = to.matched.some(record => record.meta.requireAuth)
  let guestOnly = to.matched.some(record => record.meta.guestOnly)

  if (requireAuth && !currentUser) next('auth')
  else if (guestOnly && currentUser) next('reader')
  else next()
})
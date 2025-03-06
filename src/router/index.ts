import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import NotFound404 from '@/views/NotFound404.vue'
// import importRoutes from './import-routes'
import nextAppImportRoutes from './import-next-routes'

const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  { path: '/dashboard', redirect: '/dashboard/location' },
  { path: '/:pathMatch(.*)', component: NotFound404 },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // routes: defaultRoutes.concat(importRoutes),
  routes: defaultRoutes.concat(nextAppImportRoutes),
})

console.log(router.getRoutes())

// router.beforeEach(async (to, from, next) => {
//   // if (未登录) {
//   //   return { path: 'Login' }
//   // } else if (黑名单) {
//   //   //直接取消跳转
//   //   return false
//   // } else if (授权没通过) {
//   //   return { path: 'NotPermission401' }
//   // }
//   next()
// })

export default router

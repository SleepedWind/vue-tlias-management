import { createRouter, createWebHistory } from 'vue-router'
import LayoutView from '@/views/layout/index.vue'
import IndexView from '@/views/index/index.vue'
import LoginView from '@/views/login/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '' ,
      component: LayoutView,
      redirect: '/index',
      children : [
        {path: 'index',name: 'index',component: IndexView}
      ]
    },
    {path: '/login',name: 'login',component: LoginView}
  ]
})

export default router

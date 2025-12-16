import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/pic',
      name: 'pic',
      component: () => import('../views/PicView.vue'),
    },
    // {
    //   path: '/yarn',
    //   name: 'yarn',
    //   component: () => import('../views/YarnView.vue'),
    // },
    {
      path: '/review',
      name: 'review',
      component: () => import('../views/ReviewView.vue'),
    },
    {
      path: '/link',
      name: 'link',
      component: () => import('../views/LinkView.vue'),
    },
  ],
})

export default router

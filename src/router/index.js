import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
      meta: { title: '방명록' },
    },
    {
      path: '/pic',
      name: 'pic',
      component: () => import('../views/PicView.vue'),
      meta: { title: 'Pic' },
    },
    {
      path: '/review',
      name: 'review',
      component: () => import('../views/ReviewView.vue'),
      meta: { title: 'Review' },
    },
    {
      path: '/link',
      name: 'link',
      component: () => import('../views/LinkView.vue'),
      meta: { title: 'Link' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { title: 'Profile' },
    },
    {
      path: '/yarn',
      name: 'yarn',
      component: () => import('../views/YarnView.vue'),
      meta: { title: 'Yarn' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: 'Not Found' },
    },
  ],
})

// 페이지 이동 시 브라우저 탭 제목을 갱신한다.
router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} · Warren` : 'Warren'
})

export default router

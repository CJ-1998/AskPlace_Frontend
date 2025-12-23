import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth'
import { useModalStore } from '@/shared/stores/modalStore'

const routes: RouteRecordRaw[] = [
  // --- Home ---
  {
    path: '/',
    name: 'home',
    component: () => import('@/features/home/views/HomePage.vue')
  },
  
  // --- User ---
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('@/features/user/views/MyPage.vue')
  },

  // --- Place (Search) ---
  {
    path: '/places/search',
    name: 'place-list',
    component: () => import('@/features/place/views/PlaceSearchPage.vue')
  },
  {
    path: '/places/detail/:id',
    name: 'place-detail',
    component: () => import('@/features/place/views/PlaceDetailPage.vue'),
    props: true
  },

  // --- Plan ---
  {
    path: '/plans',
    name: 'plan-list',
    component: () => import('@/features/plan/views/PlanListPage.vue')
  },
  {
    path: '/plans/me',
    name: 'my-plan-list',
    component: () => import('@/features/plan/views/MyPlanListPage.vue')
  },
  {
    path: '/plans/create',
    name: 'plan-create',
    component: () => import('@/features/plan/views/PlanCreatePage.vue')
  },
  {
    path: '/plans/:id',
    name: 'plan-detail',
    component: () => import('@/features/plan/views/PlanDetailPage.vue'),
    props: true,
    meta: { hideFooter: true }
  },
  {
    path: '/plans/edit/:id',
    name: 'plan-edit',
    component: () => import('@/features/plan/views/PlanEditPage.vue'),
    props: true,
    meta: { requiresAuth: true, hideFooter: true }
  },
  {
    path: '/plans/:planId/daily/:day',
    name: 'daily-plan',
    component: () => import('@/features/plan/views/DailyPlanView.vue'),
    meta: { hideFooter: true }
  },

  // --- Video ---
  {
    path: '/videos',
    name: 'video-list',
    component: () => import('@/features/video/views/VideoListPage.vue')
  },
  {
    path: '/videos/upload',
    name: 'video-upload',
    component: () => import('@/features/video/views/VideoUploadPage.vue')
  },
  {
    path: '/videos/:id',
    name: 'video-detail',
    component: () => import('@/features/video/views/VideoDetailPage.vue'),
    props: route => ({ id: Number(route.params.id) })
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const modalStore = useModalStore()
  
  // 1. 세션 복구가 아직 안 끝났다면 기다림
  if (!authStore.isAuthInitialized) {
    await authStore.initAuth()
  }

  const protectedRoutes = ['mypage', 'plan-create', 'video-upload', 'my-plan-list', 'plan-edit']
  
  if (protectedRoutes.includes(to.name as string) && !authStore.isLoggedIn) {
    modalStore.openAuth('login')
    // 로그인 모달을 띄우고 홈으로 이동 (또는 이전 페이지 유지)
    if (from.name) {
      next(false)
    } else {
      next({ name: 'home' })
    }
  } else {
    next()
  }
})

export default router
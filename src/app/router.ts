// src/app/router.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { useModalStore } from '@/shared/stores/modalStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/features/home/views/HomePage.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/features/place/views/PlaceSearchPage.vue')
  },
  {
    path: '/place/:id',
    name: 'place-detail',
    component: () => import('@/features/place/views/PlaceDetailPage.vue'),
    props: true
  },
  {
    path: '/plan',
    name: 'plan',
    component: () => import('@/features/plan/views/PlanListPage.vue')
  },
  {
    path: '/plan/:id',
    name: 'plan-detail',
    component: () => import('@/features/plan/views/PlanDetailPage.vue'),
    props: true
  },
  {
    path: '/plan/:planId/day/:day',
    name: 'plan-day-detail',
    component: () => import('@/features/plan/views/PlanDayDetailPage.vue'),
    props: route => ({ 
      planId: Number(route.params.planId), 
      day: Number(route.params.day) 
    })
  },
  {
    path: '/plan/create',
    name: 'plan-create',
    component: () => import('@/features/plan/views/PlanCreatePage.vue')
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('@/features/video/views/VideoListPage.vue')
  },
  {
    path: '/video/:id',
    name: 'video-detail',
    component: () => import('@/features/video/views/VideoDetailPage.vue'),
    props: route => ({ id: Number(route.params.id) })
  },
  {
    path: '/video/upload',
    name: 'video-upload',
    component: () => import('@/features/video/views/VideoUploadPage.vue')
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('@/features/user/views/MyPage.vue')
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/features/place/views/MapPage.vue')
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

  const protectedRoutes = ['mypage', 'plan-create', 'video-upload']
  
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
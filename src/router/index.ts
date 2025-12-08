// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/pages/SearchPage.vue')
  },
  {
    path: '/place/:id',
    name: 'place-detail',
    component: () => import('@/pages/PlaceDetailPage.vue'),
    props: true
  },
  {
    path: '/plan',
    name: 'plan',
    component: () => import('@/pages/PlanListPage.vue')
  },
  {
    path: '/plan/:id',
    name: 'plan-detail',
    component: () => import('@/pages/PlanDetailPage.vue'),
    props: true
  },
  {
    path: '/plan/:planId/day/:day',
    name: 'plan-day-detail',
    component: () => import('@/pages/PlanDayDetailPage.vue'),
    props: route => ({ 
      planId: Number(route.params.planId), 
      day: Number(route.params.day) 
    })
  },
  {
    path: '/plan/create',
    name: 'plan-create',
    component: () => import('@/pages/PlanCreatePage.vue')
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('@/pages/VideoListPage.vue')
  },
  {
    path: '/video/:id',
    name: 'video-detail',
    component: () => import('@/pages/VideoDetailPage.vue'),
    props: route => ({ id: Number(route.params.id) })
  },
  {
    path: '/video/upload',
    name: 'video-upload',
    component: () => import('@/pages/VideoUploadPage.vue')
  }
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

export default router
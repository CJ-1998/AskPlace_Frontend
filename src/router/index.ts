import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 메인 페이지
  { path: '/', component: () => import('@/pages/Index.vue') },
  // 인증
  { path: '/auth/login', component: () => import('@/pages/auth/Login.vue') },
  { path: '/auth/signup', component: () => import('@/pages/auth/Signup.vue') },
  // 마이페이지
  { path: '/mypage', component: () => import('@/pages/mypage/MyPage.vue') },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

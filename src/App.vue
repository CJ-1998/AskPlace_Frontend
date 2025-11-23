<!-- src/App.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import FullLayout from '@/layouts/FullLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

const route = useRoute();

// 라우트 메타 데이터에 따라 레이아웃 컴포넌트 선택
const layout = computed(() => {
  switch (route.meta.layout) {
    case 'full':
      return FullLayout;
    case 'auth':
      return AuthLayout;
    default:
      return DefaultLayout;
  }
});
</script>

<template>
  <!-- 동적 컴포넌트로 레이아웃 감싸기 -->
  <component :is="layout">
    <router-view />
  </component>
</template>

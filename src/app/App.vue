<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { useAuthStore } from '@/features/auth/stores/auth'
import { useModalStore } from '@/shared/stores/modalStore'

import AppHeader from '@/shared/components/common/AppHeader.vue'
import AppFooter from '@/shared/components/common/AppFooter.vue'
import AuthModal from '@/features/auth/components/AuthModal.vue'
import ToastNotification from '@/shared/components/common/ToastNotification.vue'

const route = useRoute()


const modalStore = useModalStore()
const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchAllData()
})
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col relative">
    <AppHeader />
    
    <main class="flex-1">
      <RouterView />
    </main>

    <AuthModal 
      v-if="modalStore.isAuthOpen" 
      @close="modalStore.closeAuth()" 
    />

    <ToastNotification />

    <AppFooter v-if="!route.meta.hideFooter" />
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
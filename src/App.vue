<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

import { useAppStore } from '@/stores'
import { useModalStore } from '@/stores/modal'

import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import ToastNotification from '@/components/common/ToastNotification.vue'


const modalStore = useModalStore()
const appStore = useAppStore()

onMounted(() => {
  appStore.fetchAllData()
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

    <AppFooter />
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
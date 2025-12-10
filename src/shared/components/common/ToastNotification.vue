<template>
  <Transition name="slide-up">
    <div 
      v-if="toast && toast.show" 
      class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-3 text-sm font-medium"
    >
      <i 
        class="fa-solid" 
        :class="toast.type === 'error' ? 'fa-circle-exclamation text-red-400' : 'fa-circle-check text-emerald-400'"
      ></i>
      {{ toast.message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useToast } from '@/shared/composables/useToast'

const { toast } = useToast()
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
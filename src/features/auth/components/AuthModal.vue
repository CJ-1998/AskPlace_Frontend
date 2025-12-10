<script setup lang="ts">
import { computed } from 'vue'
import { useModalStore } from '@/shared/stores/modalStore'
import { useAuthStore } from '@/features/auth/stores/authStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import RegistForm from './RegistForm.vue'
import LoginForm from './LoginForm.vue'
import type { LoginResponse } from '../types/auth'
import { authApi } from '../api/auth'
import { setAccessToken } from '@/shared/api/client'
import { useRouter } from 'vue-router'
import { useToast } from '@/shared/composables/useToast'

const router = useRouter();
const { showToast } = useToast();

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalStore = useModalStore()
const appStore = useAuthStore()

const title = computed(() => modalStore.authMode === 'login' ? '여행을 시작하세요' : '회원가입')
const description = computed(() => modalStore.authMode === 'login' ? '새로운 여행 경험이 기다립니다.' : 'AskPlace와 함께 여행을 기록하세요.')

const toggleMode = () => {
  modalStore.setAuthMode(modalStore.authMode === 'login' ? 'regist' : 'login')
}

const handleLoginSuccess = (data: LoginResponse) => {
  setAccessToken(data.accessToken)
  appStore.login(data.accessToken)
  emit('close')
  router.replace({ name: 'home' });
}

const handleRegist = async (data: any) => {
  try {
    await authApi.regist(data)
    showToast('회원가입이 완료되었습니다. 로그인해주세요.', 'success');
    modalStore.setAuthMode('login')
    router.push({ name: 'home'});
  } catch (error: any) {
    console.error('Regist failed:', error)
    const message = error.response?.data?.message || '회원가입에 실패했습니다.'
    showToast(message, 'error');
  }
}
</script>

<template>
  <Dialog :open="true" @update:open="$emit('close')">
    <DialogContent class="sm:max-w-md p-8">
      <DialogHeader class="text-center mb-4">
        <div class="flex justify-center mb-4">
             <i class="fa-solid fa-plane-departure text-primary text-4xl"></i>
        </div>
        <DialogTitle class="text-2xl font-bold text-center">{{ title }}</DialogTitle>
        <DialogDescription class="text-center">{{ description }}</DialogDescription>
      </DialogHeader>

      <LoginForm 
        v-if="modalStore.authMode === 'login'" 
        @success="handleLoginSuccess"
        class="mb-6" 
      />
      
      <RegistForm 
        v-else 
        @regist="handleRegist" 
        class="mb-6"
      />

      <div class="relative flex py-2 items-center mb-6">
        <Separator class="flex-1" />
        <span class="flex-shrink-0 mx-4 text-slate-400 text-xs">또는 소셜 계정으로 시작</span>
        <Separator class="flex-1" />
      </div>

      <div class="space-y-2">
        <Button variant="outline" class="w-full bg-[#FEE500] text-[#3c1e1e] hover:bg-[#fdd835] border-none py-5 h-5">
             <i class="fa-solid fa-comment mr-2"></i> 카카오로 시작하기
        </Button>
        <Button variant="outline" class="w-full bg-[#03C75A] text-white hover:bg-[#02b351] border-none py-5 h-5">
             <span class="font-black text-xs border border-white px-0.5 rounded-sm mr-2">N</span> 네이버로 시작하기
        </Button>
        <Button variant="outline" class="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-5 h-5">
             <i class="fa-brands fa-google mr-2"></i> Google로 시작하기
        </Button>
      </div>
      
      <DialogFooter class="sm:justify-center mt-6">
          <p class="text-center text-xs text-slate-400">
            {{ modalStore.authMode === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?' }}
            <button 
              @click="toggleMode" 
              class="text-primary font-bold hover:underline ml-1"
            >
              {{ modalStore.authMode === 'login' ? '회원가입' : '로그인' }}
            </button>
          </p>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

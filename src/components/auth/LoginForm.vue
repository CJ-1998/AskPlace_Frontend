<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authApi } from '@/api/auth';
import { setAccessToken } from '@/api/client';
import type { LoginResponse } from '@/types/auth';
import { Loader2 } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'success', data: LoginResponse): void
}>()

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = '이메일과 비밀번호를 입력해주세요.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await authApi.login(email.value, password.value);
    
    // 토큰을 메모리(변수)에 저장
    setAccessToken(response.data.accessToken);
    
    emit('success', response.data);
  } catch (error: any) {
    console.error('Login failed:', error);
    errorMessage.value = error.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="space-y-3">
    <div class="space-y-1">
      <Input 
        v-model="email"
        type="email" 
        placeholder="이메일" 
        :disabled="isLoading"
        required
      />
    </div>
    <div class="space-y-1">
      <Input 
        v-model="password"
        type="password" 
        placeholder="비밀번호" 
        :disabled="isLoading"
        required
      />
    </div>
    
    <p v-if="errorMessage" class="text-destructive text-sm font-medium px-1">
      {{ errorMessage }}
    </p>

    <Button 
      type="submit" 
      class="w-full py-6 font-bold shadow-md"
      :disabled="isLoading"
    >
      <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
      {{ isLoading ? '로그인 중...' : '로그인' }}
    </Button>
  </form>
</template>
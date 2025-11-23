<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 mb-6">
          <div class="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
            <span class="text-white text-xl">✈</span>
          </div>
          <span class="text-2xl font-bold text-gray-900">AskPlace</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">로그인</h1>
        <p class="text-gray-600 mt-2">계정으로 로그인하여 여행을 계획하세요</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-900">이메일</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition text-gray-900"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 text-gray-900">비밀번호</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••••••••••"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition text-gray-900"
            required
          />
        </div>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-gray-900">
            <input v-model="rememberMe" type="checkbox" class="w-4 h-4 bg-white border-gray-300 rounded" />
            <span>다음에 자동 로그인</span>
          </label>
          <a href="#" class="text-teal-500 hover:text-teal-600">비밀번호 찾기</a>
        </div>

        <button
          type="submit"
          class="w-full py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition"
        >
          로그인
        </button>
      </form>

      <!-- Sign Up Link -->
      <div class="text-center text-gray-600">
        계정이 없으신가요?
        <router-link to="/auth/signup" class="text-teal-500 hover:text-teal-600 font-semibold">
          회원가입
        </router-link>
      </div>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="flex-1 h-px bg-gray-300"></div>
        <span class="px-3 text-gray-500 text-sm">또는</span>
        <div class="flex-1 h-px bg-gray-300"></div>
      </div>

      <!-- Social Login
      <div class="space-y-2">
        <button class="w-full py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg transition border border-gray-300 font-medium flex items-center justify-center gap-2">
          <span>🔵</span> Google로 로그인
        </button>
        <button class="w-full py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg transition border border-gray-300 font-medium flex items-center justify-center gap-2">
          <span>🍎</span> Apple로 로그인
        </button>
      </div>
       -->

      <!-- Footer -->
      <p class="text-center text-gray-500 text-sm mt-6">
        로그인하면 <a href="#" class="text-teal-500 hover:text-teal-600">이용약관</a>과 <a href="#" class="text-teal-500 hover:text-teal-600">개인정보보호정책</a>에 동의합니다.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const handleLogin = async () => {
  console.log('[v0] Login attempt:', { email: email.value, rememberMe: rememberMe.value })
  
  // 실제 로그인 API 호출 시:
  // const response = await fetch('/api/auth/login', { ... })
  // 로그인 성공 시 대시보드로 리다이렉트
}
</script>

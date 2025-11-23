<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">회원가입</h1>
        <p class="text-gray-600 mt-2">새로운 계정을 만들어보세요</p>
      </div>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-900">이름</label>
          <input type="text" class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-900">국가/지역</label>
          <input type="text" class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900" required />
        </div>

        <hr />
        
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-900">이메일</label>
          <input type="email" class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-900">비밀번호</label>
          <input type="password" class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-900">비밀번호 확인</label>
          <input type="password" class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900" required />
        </div>

        <hr />
        
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-900">국가 옵션</label>
          <input type="password" class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-900">전화번호</label>
          <input type="password" class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900" required />
        </div>
        <button type="submit" class="w-full py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition">
          가입하기
        </button>
      </form>
      
      <div class="text-center mt-6 text-gray-600">
        이미 계정이 있으신가요?
        <router-link to="/auth/login" class="text-teal-500 hover:text-teal-600 font-semibold">
          로그인
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const handleSignup = () => {
  console.log('Signup attempt')
}
</script>

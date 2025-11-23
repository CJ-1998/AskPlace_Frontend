<template>
  <header class="bg-white border-b border-gray-200 shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 hover:opacity-80 transition">
        <div class="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-lg">✈</span>
        </div>
        <span class="text-xl font-bold text-gray-900">AskPlace</span>
      </router-link>
      
      <div class="flex items-center gap-6">
        <router-link to="/places" class="text-gray-600 hover:text-gray-900 transition">여행지</router-link>
        <router-link to="/plans" class="text-gray-600 hover:text-gray-900 transition">내 계획</router-link>
        <router-link to="/live" class="text-gray-600 hover:text-gray-900 transition">실시간</router-link>
        <router-link to="/mypage" class="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition">마이페이지</router-link>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
</script>

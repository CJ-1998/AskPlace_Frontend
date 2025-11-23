<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto p-8">
      <h1 class="text-3xl font-bold mb-8 text-gray-900">마이페이지</h1>
      
      <!-- 프로필 섹션 -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-1 text-gray-900">여행자</h2>
            <p class="text-gray-600">askplace@example.com</p>
          </div>
          <button class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition font-medium">
            프로필 수정
          </button>
        </div>
      </div>
      
      <!-- 통계 섹션 -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
          <div class="text-3xl font-bold text-teal-600 mb-2">12</div>
          <div class="text-sm text-gray-600">여행 계획</div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
          <div class="text-3xl font-bold text-teal-600 mb-2">48</div>
          <div class="text-sm text-gray-600">방문한 장소</div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
          <div class="text-3xl font-bold text-teal-600 mb-2">8</div>
          <div class="text-sm text-gray-600">업로드한 영상</div>
        </div>
      </div>
      
      <!-- 최근 활동 -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 class="text-xl font-bold mb-4 text-gray-900">최근 활동</h3>
        <div class="space-y-3">
          <div class="flex items-center gap-4 py-3 border-b border-gray-200 last:border-0">
            <div class="text-2xl">📋</div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">제주도 여행 계획을 생성했습니다</p>
              <p class="text-sm text-gray-600">2시간 전</p>
            </div>
          </div>
          <div class="flex items-center gap-4 py-3 border-b border-gray-200 last:border-0">
            <div class="text-2xl">🎥</div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">해운대 영상을 업로드했습니다</p>
              <p class="text-sm text-gray-600">5시간 전</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

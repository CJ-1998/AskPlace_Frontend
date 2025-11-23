<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="pt-40 pb-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="space-y-8">
          <h1 class="text-6xl md:text-7xl font-bold leading-tight text-balance text-gray-900">
            당신의 여행을
            <br />
            <span class="text-teal-500">완벽하게 계획하세요</span>
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl leading-relaxed">
            드래그 앤 드롭으로 일정을 관리하고, 영상을 공유하며, 지도에서 모든 위치를 한눈에 확인하세요. 당신의 여행 이야기를 시작해보세요.
          </p>
          <div class="flex gap-4 pt-4">
            <router-link 
              to="/auth/signup" 
              class="px-8 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition"
            >
              무료로 시작하기
            </router-link>
            <a 
              href="#features"
              class="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              자세히 보기
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-200">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold mb-4 text-gray-900">핵심 기능</h2>
          <p class="text-xl text-gray-600">TravelPlan으로 여행 계획을 더 쉽고 재미있게</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="group p-8 bg-white border border-gray-200 rounded-2xl hover:border-teal-500 hover:shadow-lg transition">
            <div class="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition">
              <span class="text-3xl">📋</span>
            </div>
            <h3 class="text-2xl font-bold mb-3 text-gray-900">드래그 앤 드롭</h3>
            <p class="text-gray-600 leading-relaxed">
              마우스로 드래그하여 여행 일정을 자유롭게 재구성하세요. 간단하고 직관적입니다.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="group p-8 bg-white border border-gray-200 rounded-2xl hover:border-teal-500 hover:shadow-lg transition">
            <div class="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition">
              <span class="text-3xl">🎥</span>
            </div>
            <h3 class="text-2xl font-bold mb-3 text-gray-900">영상 업로드</h3>
            <p class="text-gray-600 leading-relaxed">
              여행지의 아름다운 순간을 영상으로 담아 공유하세요. 위치 정보도 함께 저장됩니다.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="group p-8 bg-white border border-gray-200 rounded-2xl hover:border-teal-500 hover:shadow-lg transition">
            <div class="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition">
              <span class="text-3xl">🗺️</span>
            </div>
            <h3 class="text-2xl font-bold mb-3 text-gray-900">지도 통합</h3>
            <p class="text-gray-600 leading-relaxed">
              모든 여행지의 위치를 지도 위에 마커로 표시하고 시각적으로 관리하세요.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-5xl font-bold mb-4 text-gray-900">어떻게 사용하나요?</h2>
          <p class="text-xl text-gray-600">4가지 간단한 단계로 시작하세요</p>
        </div>

        <div class="space-y-6">
          <!-- Step 1 -->
          <div class="flex gap-6 pb-8 border-l-2 border-teal-500/30 pl-8">
            <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 -ml-14">
              1
            </div>
            <div>
              <h3 class="text-2xl font-bold mb-2 text-gray-900">여행 계획 만들기</h3>
              <p class="text-gray-600 text-lg">
                새로운 여행을 생성하고 여행지, 날짜, 제목 등 기본 정보를 입력하세요.
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex gap-6 pb-8 border-l-2 border-teal-500/30 pl-8">
            <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 -ml-14">
              2
            </div>
            <div>
              <h3 class="text-2xl font-bold mb-2 text-gray-900">일정 추가 및 정렬</h3>
              <p class="text-gray-600 text-lg">
                방문할 여행지를 추가하고 드래그 앤 드롭으로 순서를 정렬하세요. 네이버 지도에서 위치를 바로 확인할 수 있습니다.
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex gap-6 pb-8 border-l-2 border-teal-500/30 pl-8">
            <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 -ml-14">
              3
            </div>
            <div>
              <h3 class="text-2xl font-bold mb-2 text-gray-900">영상 업로드</h3>
              <p class="text-gray-600 text-lg">
                여행 중 촬영한 영상을 업로드하고 위치, 날짜, 설명과 함께 저장하세요.
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex gap-6 border-l-2 border-teal-500/30 pl-8">
            <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 -ml-14">
              4
            </div>
            <div>
              <h3 class="text-2xl font-bold mb-2 text-gray-900">공유 및 회상</h3>
              <p class="text-gray-600 text-lg">
                완성된 여행 계획과 영상을 친구들과 공유하고, 언제든 다시 보며 추억을 되새기세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-3xl p-12 md:p-16 text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-6 text-gray-900">지금 바로 시작하세요</h2>
          <p class="text-xl text-gray-700 mb-10 leading-relaxed">
            완벽한 여행 계획을 만들어 보세요. AskPlace는 무료로 시작할 수 있습니다.
          </p>
          <router-link 
            to="/auth/signup" 
            class="inline-block px-10 py-4 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition text-lg"
          >
            회원가입 하기
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 랜딩페이지 컴포넌트
</script>

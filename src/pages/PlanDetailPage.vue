<!-- src/views/PlanDetailPage.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <button 
      @click="router.back()" 
      class="text-sm text-slate-500 mb-4 hover:text-slate-900"
    >
      <i class="fa-solid fa-arrow-left"></i> 목록으로
    </button>
    
    <div v-if="plan" class="space-y-6">
      <!-- Plan Header -->
      <div class="bg-white p-6 rounded-2xl border shadow-sm">
        <div class="flex flex-col md:flex-row justify-between gap-4 mb-6 border-b pb-6">
          <div>
            <h1 class="text-2xl font-bold mb-2">{{ plan.title }}</h1>
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <span>{{ plan.author }}</span>
              <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>2024.10.15 - 10.17</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100">
              복사하기
            </button>
            <button class="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200">
              공유
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-slate-50 p-4 rounded-xl text-center">
            <div class="text-red-500 text-2xl mb-1">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div class="text-xl font-bold">13개</div>
            <div class="text-xs text-slate-500">총 방문장소</div>
          </div>
          <div class="bg-slate-50 p-4 rounded-xl text-center">
            <div class="text-indigo-500 text-2xl mb-1">
              <i class="fa-regular fa-clock"></i>
            </div>
            <div class="text-xl font-bold">21시간</div>
            <div class="text-xs text-slate-500">총 소요시간</div>
          </div>
          <div class="bg-slate-50 p-4 rounded-xl text-center">
            <div class="text-emerald-500 text-2xl mb-1">
              <i class="fa-solid fa-car"></i>
            </div>
            <div class="text-xl font-bold">115km</div>
            <div class="text-xs text-slate-500">총 이동거리</div>
          </div>
          <div class="bg-slate-50 p-4 rounded-xl text-center">
            <div class="text-amber-500 text-2xl mb-1">
              <i class="fa-solid fa-won-sign"></i>
            </div>
            <div class="text-xl font-bold">14.5만</div>
            <div class="text-xs text-slate-500">예상 경비</div>
          </div>
        </div>
      </div>

      <!-- Daily Itinerary -->
      <div class="space-y-4">
        <div 
          v-for="(day, index) in dailyPlans" 
          :key="index" 
          class="bg-white p-5 rounded-xl border flex justify-between items-center hover:border-indigo-300 cursor-pointer transition-colors"
        >
          <div>
            <h3 class="font-bold text-lg mb-1">{{ index + 1 }}일차 - {{ day.title }}</h3>
            <p class="text-sm text-slate-500">{{ day.details }}</p>
          </div>
          <i class="fa-solid fa-chevron-right text-slate-300"></i>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-slate-500">계획을 찾을 수 없습니다.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const store = useAppStore()

const plan = computed(() => store.getPlanById(route.params.id as string))

const dailyPlans = [
  { title: '설악산 탐방', details: '방문 4곳 • 이동 30km • 예산 5만원' },
  { title: '속초 해변 힐링', details: '방문 4곳 • 이동 25km • 예산 4만원' },
  { title: '강릉 카페 투어', details: '방문 5곳 • 이동 60km • 예산 5.5만원' }
]
</script>
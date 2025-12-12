<script setup lang="ts">
import MapView from '@/shared/components/common/MapView.vue'
import type { Place } from '@/features/place/types/place'

defineProps<{
  place: Place
}>()

defineEmits<{
  (e: 'request-live'): void
  (e: 'add-plan'): void
}>()
</script>

<template>
  <div class="bg-white rounded-2xl overflow-hidden border shadow-sm">
    <!-- Header Image -->
    <div class="h-64 md:h-80 relative">
      <img 
        :src="place.placeImageUrl" 
        :alt="place.placeName"
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
        <div class="text-white">
          <h1 class="text-3xl font-bold mb-1">{{ place.placeName }}</h1>
          <p class="opacity-90">
            <i class="fa-solid fa-location-dot"></i> {{ place.placeAddress }}
          </p>
        </div>
      </div>
    </div>

    <!-- Details -->
    <div class="p-6 md:p-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-slate-50 p-3 rounded-lg text-center">
          <div class="text-xs text-slate-400">지역</div>
          <div class="font-bold">{{ place.region || '-' }}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg text-center">
          <div class="text-xs text-slate-400">시/군/구</div>
          <div class="font-bold">{{ place.siGunGu || '-' }}</div>
        </div>
        <!-- Todo : 입장료, 주차 구현 필요 -->
        <div class="bg-slate-50 p-3 rounded-lg text-center">
          <div class="text-xs text-slate-400">입장료</div>
          <div class="font-bold">{{ '무료' }}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg text-center">
          <div class="text-xs text-slate-400">주차</div>
          <div class="font-bold">{{ '가능' }}</div>
        </div>
       
      </div>

       <!-- Map Section -->
      <div class="mb-8 h-64 md:h-80 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
        <MapView :lat="place.latitude || 37.5665" :lng="place.longitude || 126.9780" />
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mb-8">
        <button 
          @click="$emit('request-live')" 
          class="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-indigo-600 shadow-sm transition-colors"
        >
          <i class="fa-solid fa-video mr-2"></i> 실시간 영상 요청
        </button>
        <button 
          @click="$emit('add-plan')" 
          class="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 shadow-sm transition-colors"
        >
          <i class="fa-solid fa-plus mr-2"></i> 계획에 추가
        </button>
      </div>

      <!-- Description -->
      <div class="mb-12">
          <h3 class="text-lg font-bold mb-2 text-slate-800">상세 설명</h3>
          <p class="text-slate-600 leading-relaxed">{{ place.placeDescription }}</p>
      </div>

       <!-- Nearby Places Slot or Component -->
      <div>
        <h3 class="text-xl font-bold mb-4 text-slate-800">근처 여행지</h3>
        <slot name="nearby"></slot>
      </div>
    </div>
  </div>
</template>

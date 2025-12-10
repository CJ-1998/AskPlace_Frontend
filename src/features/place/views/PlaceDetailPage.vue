<!-- src/views/PlaceDetailPage.vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <button 
      @click="router.back()" 
      class="text-sm text-slate-500 mb-4 hover:text-slate-900"
    >
      <i class="fa-solid fa-arrow-left"></i> 목록으로
    </button>

    <div v-if="place" class="bg-white rounded-2xl overflow-hidden border shadow-sm">
      <!-- Header Image -->
      <div class="h-64 md:h-80 relative">
        <img 
          :src="place.image" 
          :alt="place.title"
          class="w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
          <div class="text-white">
            <h1 class="text-3xl font-bold mb-1">{{ place.title }}</h1>
            <p class="opacity-90">
              <i class="fa-solid fa-location-dot"></i> {{ place.location }}
            </p>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div class="p-6 md:p-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-slate-50 p-3 rounded-lg text-center">
            <div class="text-xs text-slate-400">카테고리</div>
            <div class="font-bold">{{ place.category || '자연/명소' }}</div>
          </div>
          <div class="bg-slate-50 p-3 rounded-lg text-center">
            <div class="text-xs text-slate-400">운영시간</div>
            <div class="font-bold">{{ place.operatingHours || '24시간' }}</div>
          </div>
          <div class="bg-slate-50 p-3 rounded-lg text-center">
            <div class="text-xs text-slate-400">입장료</div>
            <div class="font-bold">{{ place.admission || '무료' }}</div>
          </div>
          <div class="bg-slate-50 p-3 rounded-lg text-center">
            <div class="text-xs text-slate-400">주차</div>
            <div class="font-bold">{{ place.parking || '가능' }}</div>
          </div>
        </div>

         <!-- Map Section -->
        <div class="mb-8 h-64 md:h-80 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
          <MapView :lat="place.lat || 37.5665" :lng="place.lng || 126.9780" />
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mb-8">
          <button 
            @click="showToast('라이브 영상을 요청했습니다.')" 
            class="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-indigo-600 shadow-sm transition-colors"
          >
            <i class="fa-solid fa-video mr-2"></i> 실시간 영상 요청
          </button>
          <button 
            @click="showToast('여행 계획에 담았습니다.')" 
            class="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 shadow-sm transition-colors"
          >
            <i class="fa-solid fa-plus mr-2"></i> 계획에 추가
          </button>
        </div>

        <!-- Description -->
        <div class="mb-12">
            <h3 class="text-lg font-bold mb-2 text-slate-800">상세 설명</h3>
            <p class="text-slate-600 leading-relaxed">{{ place.desc }}</p>
        </div>

         <!-- Nearby Places -->
        <div>
          <h3 class="text-xl font-bold mb-4 text-slate-800">근처 여행지</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <NearbyPlaceCard 
                v-for="i in 3" 
                :key="i"
                :title="['경복궁', '남산타워', '청계천'][i-1]"
                image="https://picsum.photos/200"
                address="서울특별시 종로구"
                :rating="4.5"
             />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-slate-500">장소를 찾을 수 없습니다.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { useToast } from '@/shared/composables/useToast'
import MapView from '@/shared/components/common/MapView.vue'
import NearbyPlaceCard from '@/features/place/components/NearbyPlaceCard.vue'

const router = useRouter()
const route = useRoute()
const store = useAuthStore()
const { showToast } = useToast()

const place = computed(() => store.getPlaceById(route.params.id as string))
</script>

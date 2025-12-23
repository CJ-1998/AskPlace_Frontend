<script setup lang="ts">
import { usePlaceSearch } from '@/features/place/composables/usePlaceSearch'
import { Input } from '@ui/input'
import { Button } from '@ui/button'
import placeHolderImage from '@/assets/placeholder.png'

const { 
  searchText, 
  regions,
  currentRegion, 
  places, 
  isLoading, 
  error, 
  onSearch, 
  onSelectRegion, 
  goToDetail,
  currentPage,
  totalPages,
  loadMore
} = usePlaceSearch()


</script>

<template>
  <div class="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
    <aside class="w-full lg:w-64 space-y-6 hidden lg:block">
      <div class="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 class="font-bold text-lg mb-4 text-slate-800">지역별 필터</h3>
        <div class="flex flex-wrap gap-2">
          <!-- 전체 버튼 -->
          <button 
            @click="onSelectRegion('ALL')"
            class="px-3 py-2 rounded-xl text-sm transition-all border"
            :class="!currentRegion || currentRegion === '전체' || currentRegion === 'ALL'
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'"
          >
            전체
          </button>
          
          <!-- 동적 지역 버튼 -->
          <button 
            v-for="region in regions" 
            :key="region.code"
            @click="onSelectRegion(region.code)"
            class="px-3 py-2 rounded-xl text-sm transition-all border"
            :class="currentRegion === region.code
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'"
          >
            {{ region.label }}
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 space-y-6">
      <div class="flex gap-3 bg-white p-2 rounded-2xl shadow-lg border border-slate-100">
        <div class="flex-1 flex items-center px-4">
          <i class="fa-solid fa-magnifying-glass text-slate-400 mr-3"></i>
          <Input 
            v-model="searchText" 
            @keyup.enter="onSearch"
            placeholder="어디로 떠나고 싶으신가요?" 
            class="border-0 shadow-none focus-visible:ring-0 text-base"
          />
        </div>
        <Button @click="onSearch" class="bg-blue-600 hover:bg-blue-700 px-8 rounded-xl h-12 font-bold transition-all">
          검색하기
        </Button>
      </div>

      <div class="flex justify-between items-center px-1">
        <h2 class="font-bold text-xl text-slate-800">
          <span v-if="searchText" class="text-blue-600">"{{ searchText }}"</span>
          검색 결과
          <span class="text-sm text-slate-400 font-normal ml-2">{{ places.length }}건</span>
        </h2>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="grid gap-5">
        <div v-for="n in 5" :key="n" class="flex gap-5 bg-slate-50 p-4 rounded-2xl animate-pulse h-32"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="grid gap-5">
        <div class="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
          <p class="text-red-500 font-medium">{{ error }}</p>
          <Button variant="outline" class="mt-4" @click="onSearch">다시 시도</Button>
        </div>
      </div>

      <!-- Result State -->
      <div v-else class="grid gap-5">
        <div 
          v-for="place in places" 
          :key="place.placeId" 
          @click="goToDetail(place.placeId)"
          class="flex gap-5 bg-white p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all group"
        >
          <div class="w-32 h-24 md:w-40 md:h-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <img 
              :src="place.placeThumbnailImageUrl || place.placeImageUrl || placeHolderImage" 
              :alt="place.placeName"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            >
          </div>
          
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <h3 class="font-bold text-lg md:text-xl text-slate-900 group-hover:text-blue-600 transition-colors truncate mb-1">
              {{ place.placeName }}
            </h3>
            <p class="text-sm text-slate-500 mb-3 flex items-center">
              <i class="fa-solid fa-location-dot mr-1.5"></i>
              <span class="truncate">{{ place.placeAddress }}</span>
            </p>
            <div class="flex gap-2">
              <span class="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">
                #{{ place.placeRegion }}
              </span>
              <span class="text-xs font-medium bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg">
                #{{ place.placeSiGunGu }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="places.length === 0" class="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <i class="fa-solid fa-map-location-dot text-4xl text-slate-300 mb-4"></i>
          <p class="text-slate-500 font-medium text-lg">찾으시는 여행지가 없나요?</p>
          <p class="text-slate-400 text-sm">다른 검색어로 다시 시도해 보세요.</p>
        </div>

        <!-- 더보기 버튼 -->
        <div v-if="places.length > 0 && currentPage + 1 < totalPages" class="text-center mt-8">
          <Button 
            variant="outline" 
            class="px-8 py-6 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all w-full md:w-auto"
            @click="loadMore"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <i class="fa-solid fa-circle-notch fa-spin text-slate-400"></i>
              불러오는 중...
            </span>
            <span v-else class="flex items-center gap-2 text-slate-600 font-medium">
              더 보기 
              <span class="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">
                {{ currentPage + 1 }} / {{ totalPages }}
              </span>
              <i class="fa-solid fa-chevron-down text-xs ml-1"></i>
            </span>
          </Button>
        </div>
        <div v-if="isLoading" class="text-center py-12 text-slate-500">
          로딩중...
        </div>
      </div>
    </div>
  </div>
</template>
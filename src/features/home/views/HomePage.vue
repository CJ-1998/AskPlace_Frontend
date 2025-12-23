<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlaceStore } from '@/features/place/stores/place'
import { storeToRefs } from 'pinia'
import PlaceCard from '@/features/place/components/PlaceCard.vue'
import { Input } from '@ui/input'
import { Button } from '@ui/button'
import { usePlace } from '@/features/place/composables/usePlace'
import { usePlaceRecommend } from '@/features/place/composables/usePlaceRecommend'

const router = useRouter()
const searchQuery = ref('')
const placeStore = usePlaceStore()

// Composable 사용
const { recommendedPlaces, isLoading, fetchRecommendations } = usePlaceRecommend()
const { resetPlace } = usePlace()

const handleSearch = () => {
  router.push({ name: 'place-list', query: { q: searchQuery.value } })
}

const handlePlaceClick = (id: string) => {
  resetPlace()
  router.push({ name: 'place-detail', params: { id } })
}

// 페이지 진입 시 호출
onMounted(() => {
  fetchRecommendations()
})
</script>

<template>
  <div>
    <section class="relative h-[400px] flex items-center justify-center text-center px-4 bg-slate-900">
      <img 
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070" 
        class="absolute inset-0 w-full h-full object-cover opacity-50"
        alt="Hero background"
      >
      <div class="relative z-10 max-w-2xl text-white space-y-6">
        <h1 class="text-4xl md:text-5xl font-bold leading-tight">
          당신만의 완벽한 여행을<br>계획하세요
        </h1>
        <div class="bg-white p-2 rounded-full shadow-xl flex items-center text-slate-800">
          <i class="fa-solid fa-magnifying-glass text-slate-400 ml-4"></i>
          <Input 
            v-model="searchQuery"
            type="text" 
            placeholder="어디로 떠나시나요?" 
            class="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent text-base h-auto py-3" 
            @keyup.enter="handleSearch"
          />
          <Button 
            @click="handleSearch" 
            class="rounded-full px-8 py-6 font-bold text-lg hover:bg-indigo-600"
          >
            검색
          </Button>
        </div>
      </div>
    </section>
    
    <div>
      <section class="container mx-auto px-4 py-12">
        <div class="flex justify-between items-end mb-6">
          <h2 class="text-2xl font-bold">오늘의 추천 여행지</h2>
          <p v-if="recommendedPlaces.length" class="text-gray-500 text-sm">
            총 {{ recommendedPlaces.length }}곳의 모든 추천 장소를 확인하세요.
          </p>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="n in 9" :key="n" class="h-[380px] bg-slate-100 animate-pulse rounded-xl"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <PlaceCard 
            v-for="place in recommendedPlaces" 
            :key="place.placeId" 
            :place="place"
            @click="handlePlaceClick"
          />
        </div>
      </section>
    </div>
  </div>
</template>

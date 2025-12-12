<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePlace } from '@/features/place/composables/usePlace'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { getPlaceTypeLabel } from '@/features/place/utils/placeUtils'

const router = useRouter()
const route = useRoute()
const { places, fetchPlaces, isLoading } = usePlace()

// 해당 기능들은 임시적으로 필터링을 구현한 것으로
// 실제 서비스에서는 백엔드 API를 호출하여 필터링을 구현할 예정
const locations = ['전체', '서울', '부산', '제주', '강원' ]
const placeTypes = ['전체', '12', '14', '15', '25', '28', '32', '38', '39']

const selectedLocation = ref('전체')
const selectedplaceTypes = ref('전체')
const searchText = ref(route.query.q as string || '')

// url쿼리가 변경되면 searchText를 변경
watch(() => route.query.q, (newQ) => {
  searchText.value = newQ as string || ''
})

const filteredPlaces = computed(() => {
  let result = places.value

  // 장소를 기준으로 필터
  if (selectedLocation.value !== '전체') {
    result = result.filter(p => p.region && p.region.includes(selectedLocation.value))
  }

  // 이름을 기준으로 필터
  if (searchText.value) {
    const lower = searchText.value.toLowerCase()
    result = result.filter(p => p.placeName.toLowerCase().includes(lower) || p.placeAddress.toLowerCase().includes(lower))
  }

  // 테마를 기준으로 필터
  if (selectedplaceTypes.value !== '전체') {
    result = result.filter(p => p.contentTypeId === selectedplaceTypes.value)
  }
  
  return result
})

const onSearch = () => {
  router.push({ query: { ...route.query, q: searchText.value } })
}

const goToDetail = (id: string) => {
  router.push({ name: 'place-detail', params: { id } })
}

onMounted(() => {
  if (places.value.length === 0) {
    fetchPlaces()
  }
})
</script>


<template>
  <div class="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
    <!-- Sidebar Filters -->
    <aside class="w-full lg:w-64 space-y-6 hidden lg:block">
      <div>
        <h3 class="font-bold mb-3">지역</h3>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="loc in locations" 
            :key="loc"
            @click="selectedLocation = loc"
            :class="selectedLocation === loc ? 'bg-blue-600 text-white' : 'bg-white border text-slate-600 hover:bg-slate-50'"
            class="px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            {{ loc }}
          </button>
        </div>
      </div>
      <div>
        <h3 class="font-bold mb-3">테마</h3>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="placeType in placeTypes" 
            :key="placeType"
            @click="selectedplaceTypes = placeType"
            :class="selectedplaceTypes === placeType ? 'bg-blue-600 text-white' : 'bg-white border text-slate-600 hover:bg-slate-50'"
            class="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 border border-transparent hover:border-slate-300"
          >
            #{{ getPlaceTypeLabel(placeType) }}
          </button>
        </div>
      </div>
    </aside>

    <!-- Results -->
    <div class="flex-1 space-y-4">
      <!-- Search Bar -->
      <div class="flex gap-2 mb-6">
        <Input 
          v-model="searchText" 
          @keyup.enter="onSearch"
          placeholder="여행지 이름으로 검색해보세요" 
          class="bg-white flex-1"
        />
        <Button @click="onSearch" class="bg-blue-600">검색</Button>
      </div>

      <div class="flex justify-between items-center mb-4">
        <h2 class="font-bold text-xl">
          <span class="text-blue-600">{{ selectedLocation === '전체' ? '전체' : selectedLocation }}</span> 검색 결과
          <span class="text-sm text-slate-400 font-normal ml-2">{{ filteredPlaces.length }}개</span>
        </h2>
        <select class="bg-transparent text-sm font-medium outline-none">
          <option>추천순</option>
          <option>인기순</option>
          <option>최신순</option>
        </select>
      </div>
      
      <div class="grid gap-4">
        <div 
          v-for="place in filteredPlaces" 
          :key="place.placeId" 
          @click="goToDetail(place.placeId)"
          class="flex gap-4 bg-white p-4 rounded-xl border hover:shadow-md cursor-pointer transition-shadow"
        >
           <div class="w-32 h-24 shrink-0 overflow-hidden rounded-lg bg-slate-200">
             <img 
              :src="place.placeThumbnailImageUrl || place.placeImageUrl || '/placeholder.jpg'" 
              :alt="place.placeName"
              class="w-full h-full object-cover"
            >
           </div>
          
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-lg truncate">{{ place.placeName }}</h3>
            <p class="text-sm text-slate-500 mb-2 truncate">{{ place.placeAddress }}</p>
            <div class="flex gap-1 flex-wrap">
              <span class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">
                #{{ getPlaceTypeLabel(place.contentTypeId) }}
              </span>
               <span class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">
                #{{ place.region }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="!isLoading && filteredPlaces.length === 0" class="text-center py-12 text-slate-500">
          검색 결과가 없습니다.
        </div>
        <div v-if="isLoading" class="text-center py-12 text-slate-500">
          로딩중...
        </div>
      </div>
    </div>
  </div>
</template>
<!-- src/views/SearchPage.vue -->
<template>
  <div class="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
    <!-- Sidebar Filters -->
    <aside class="w-full lg:w-64 space-y-6">
      <div>
        <h3 class="font-bold mb-3">지역</h3>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="loc in locations" 
            :key="loc"
            @click="selectedLocation = loc"
            :class="selectedLocation === loc ? 'bg-primary text-white' : 'bg-white border text-slate-600'"
            class="px-3 py-1.5 rounded-lg text-sm transition-colors hover:opacity-80"
          >
            {{ loc }}
          </button>
        </div>
      </div>
      <div>
        <h3 class="font-bold mb-3">테마</h3>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="theme in themes" 
            :key="theme"
            class="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 border border-transparent hover:border-slate-300"
          >
            #{{ theme }}
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
          class="bg-white"
        />
        <Button @click="onSearch">검색</Button>
      </div>

      <div class="flex justify-between items-center mb-4">
        <h2 class="font-bold text-xl">
          <span class="text-primary">{{ selectedLocation === '전체' ? '전체' : selectedLocation }}</span> 검색 결과
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
          :key="place.id" 
          @click="goToDetail(place.id)"
          class="flex gap-4 bg-white p-4 rounded-xl border hover:shadow-md cursor-pointer transition-shadow"
        >
          <img 
            :src="place.image" 
            :alt="place.title"
            class="w-32 h-24 object-cover rounded-lg bg-slate-200"
          >
          <div>
            <h3 class="font-bold text-lg">{{ place.title }}</h3>
            <p class="text-sm text-slate-500 mb-2">{{ place.location }}</p>
            <div class="flex gap-1">
              <span 
                v-for="tag in place.tags" 
                :key="tag" 
                class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="filteredPlaces.length === 0" class="text-center py-12 text-slate-500">
          검색 결과가 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'

const router = useRouter()
const route = useRoute()
const store = useAuthStore()

const locations = ['전체', '서울', '부산', '제주', '강원']
const themes = ['자연', '역사', '힐링', '맛집']

const selectedLocation = ref('전체')
const searchText = ref(route.query.q as string || '')

// Update searchText when URL query changes
watch(() => route.query.q, (newQ) => {
  searchText.value = newQ as string || ''
})

const filteredPlaces = computed(() => {
  let result = store.places

  // Filter by Location
  if (selectedLocation.value !== '전체') {
    result = result.filter(p => p.location.includes(selectedLocation.value))
  }

  // Filter by Name (Search Text)
  if (searchText.value) {
    const lower = searchText.value.toLowerCase()
    result = result.filter(p => p.title.toLowerCase().includes(lower))
  }
  
  return result
})

const onSearch = () => {
  router.push({ query: { ...route.query, q: searchText.value } })
}

const goToDetail = (id: number) => {
  router.push({ name: 'place-detail', params: { id } })
}
</script>
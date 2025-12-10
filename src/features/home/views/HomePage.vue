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
    
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold mb-6">오늘의 추천 여행지</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PlaceCard 
          v-for="place in store.places.slice(0, 3)" 
          :key="place.id" 
          :place="place"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/authStore'
import PlaceCard from '@/features/place/components/PlaceCard.vue'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'

const router = useRouter()
const store = useAuthStore()
const searchQuery = ref('')

const handleSearch = () => {
  router.push({ name: 'search', query: { q: searchQuery.value } })
}
</script>

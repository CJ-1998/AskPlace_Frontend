<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/shared/composables/useToast'
import PlaceDetail from '@/features/place/components/PlaceDetail.vue'
import NearbyPlaceCard from '@/features/place/components/NearbyPlaceCard.vue'
import { usePlace } from '@/features/place/composables/usePlace'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()
const { place, places, isLoading, error, getPlace, recommendPlace } = usePlace()

const nearbyPlaces = computed(() => {
    return places.value
        .filter(p => p.placeId !== place.value?.placeId)
        .slice(0, 3)
})

const fetchPlace = () => {
    const id = route.params.id as string
    if (id) {
        getPlace(id)
    }
}

const handleNearbyClick = (id: string) => {
    router.push({ name: 'place-detail', params: { id } })
}

onMounted(() => {
    fetchPlace()
    if (places.value.length === 0) {
        recommendPlace()
    }
})

watch(() => route.params.id, () => {
    fetchPlace()
})

const handleRequestLive = () => {
    showToast('라이브 영상을 요청했습니다.')
}

const handleAddPlan = () => {
    showToast('여행 계획에 담았습니다.')
}
</script>


<template>
  <div class="container mx-auto px-4 py-8">
    <button 
      @click="router.back()" 
      class="text-sm text-slate-500 mb-4 hover:text-slate-900"
    >
      <i class="fa-solid fa-arrow-left"></i> 목록으로
    </button>

    <div v-if="isLoading" class="text-center py-12">
      <p class="text-slate-500">불러오는 중...</p>
    </div>

    <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
    </div>

    <PlaceDetail 
      v-else-if="place"
      :place="place"
      @request-live="handleRequestLive"
      @add-plan="handleAddPlan"
    >
      <template #nearby>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <NearbyPlaceCard 
                v-for="nearbyPlace in nearbyPlaces" 
                :key="nearbyPlace.placeId"
                :place="nearbyPlace"
                @click="handleNearbyClick"
             />
             <div v-if="nearbyPlaces.length === 0" class="col-span-full text-center py-8 text-slate-500">
                근처 여행지가 없습니다.
             </div>
          </div>
      </template>
    </PlaceDetail>

    <div v-else class="text-center py-12">
      <p class="text-slate-500">장소를 찾을 수 없습니다.</p>
    </div>
  </div>
</template>


import { defineStore } from 'pinia'
import { usePlace } from '@/features/place/composables/usePlace'

export const usePlaceStore = defineStore('place', () => {
  const {
    places,
    place,
    isLoading,
    error,
    getPlace,
    recommendPlace,
    fetchPlaces,
    getPlaceDetail,
    resetPlace,
    currentPage,
    totalPages
  } = usePlace()

  return {
    places,
    place,
    isLoading,
    error,
    getPlace,
    recommendPlace,
    fetchPlaces,
    getPlaceDetail,
    resetPlace,
    currentPage,
    totalPages
  }
})

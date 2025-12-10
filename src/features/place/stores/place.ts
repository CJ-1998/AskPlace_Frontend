import { defineStore } from 'pinia'
import { ref } from 'vue'
import { placeApi } from '@/features/place/api/place'
import type { Place } from '@/features/place/types/place'

export const usePlaceStore = defineStore('place', () => {
  const places = ref<Place[]>([])
  const currentPlace = ref<Place | null>(null)
  const isLoading = ref(false)

  const fetchPlaces = async (params?: any) => {
    isLoading.value = true
    try {
      places.value = await placeApi.getPlaces(params)
    } catch (error) {
      console.error('Failed to fetch places', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchPlaceById = async (id: number) => {
    isLoading.value = true
    try {
      currentPlace.value = await placeApi.getPlaceById(id)
      return currentPlace.value
    } catch (error) {
      console.error('Failed to fetch place', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    places,
    currentPlace,
    isLoading,
    fetchPlaces,
    fetchPlaceById
  }
})

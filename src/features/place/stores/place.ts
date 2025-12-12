import { defineStore } from 'pinia'

import { usePlace } from '@/features/place/composables/usePlace'

export const usePlaceStore = defineStore('place', () => {
  const { places, fetchPlaces, searchPlaces, isLoading, error, getPlaceById } = usePlace()

  return {
    places,
    fetchPlaces,
    searchPlaces,
    isLoading,
    error,
    getPlaceById
  }
})

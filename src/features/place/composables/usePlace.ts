import { ref } from 'vue'
import type { Place, PlaceSearchParams } from '@/features/place/types/place'
import { MOCK_PLACES } from '@/mocks/place'

const places = ref<Place[]>([])
const place = ref<Place | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export const usePlace = () => {
  
  // 추천 여행지 가져오기
  const recommendPlace = async () => {
    isLoading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      // 일단은 임시데이터인 MOCK_PLACES를 사용
      // 백엔드 연결하면 MOCK_PLACES를 사용하지 않음
      places.value = MOCK_PLACES
    } catch (e) {
      error.value = 'Failed to fetch recommended places'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  // 여행지 검색
  const searchPlace = async (params: PlaceSearchParams) => {
    isLoading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let results = [...MOCK_PLACES]
      
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        results = results.filter(p => 
          p.placeName.toLowerCase().includes(keyword) || 
          p.placeAddress.toLowerCase().includes(keyword)
        )
      }
      
      places.value = results
    } catch (e) {
      error.value = 'Failed to search places'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  // 여행지 상세 정보 가져오기
  const getPlaceDetail = async (id: string) => {
    isLoading.value = true
    error.value = null
    place.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const found = MOCK_PLACES.find(p => p.placeId === id)
      if (found) {
        place.value = found
      } else {
        error.value = 'Place not found'
      }
    } catch (e) {
      error.value = 'Failed to fetch place detail'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  // 여행지 상세 정보 가져오기
  const getPlaceById = (id: string): Place | undefined => {
    return places.value.find(p => p.placeId === id) || MOCK_PLACES.find(p => p.placeId === id)
  }

  return {
    places,
    place,
    isLoading,
    error,
    // Alias임
    // 예시. fetchPlaces라고 불러도 recommendPlace를 실행하는 것과 같음.
    fetchPlaces: recommendPlace, 
    searchPlaces: searchPlace,
    getPlace: getPlaceDetail,
    
    recommendPlace,
    searchPlace,
    getPlaceDetail,
    getPlaceById
  }
}

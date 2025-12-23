import { ref } from 'vue'
import type { PlaceSummary, PlaceDetail, Region } from '@/features/place/types/place'
import { placeApi } from '../api/place'

export const usePlace = () => {
  // 1. Singleton State 제거: 호출 시마다 독립적인 상태 생성
  const places = ref<PlaceSummary[]>([])
  const place = ref<PlaceDetail | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Pagination State
  const currentPage = ref(0)
  const totalPages = ref(0)
  const totalCount = ref(0)

  // Filter State
  const regions = ref<Region[]>([])

  // 2. Race Condition 방지를 위한 Request ID (Closure)
  let lastSearchId = 0
  let lastDetailId = 0

  // 추천 여행지 가져오기
  const recommendPlace = async () => {
    const currentId = ++lastSearchId // ID 증가
    isLoading.value = true
    error.value = null
    try {
      const data = await placeApi.getRecommendedPlaces()
      // 응답 시점에 ID가 일치하는지 확인 (최신 요청만 반영)
      if (currentId === lastSearchId) {
        places.value = data.placeSearchResponseDtoList
        // 추천은 페이징이 없으므로 초기화
        currentPage.value = 0
        totalPages.value = 1
        totalCount.value = data.placeSearchResponseDtoList.length
      }
    } catch (e) {
      if (currentId === lastSearchId) {
        error.value = '추천 여행지를 불러오지 못했습니다.'
        console.error(e)
      }
    } finally {
      if (currentId === lastSearchId) {
        isLoading.value = false
      }
    }
  }

  // 여행지 목록 조회 (검색 or 전체)
  const fetchPlaces = async (keyword?: string, region?: string, page: number = 0, isLoadMore: boolean = false) => {
    const currentId = ++lastSearchId
    isLoading.value = true
    error.value = null

    try {
      let data;
      // API call (page, size=50)
      const params: any = { page, size: 50 };
      if (keyword) params.placeName = keyword;
      if (region && region !== 'ALL') params.region = region;

      data = await placeApi.getPlaces(params);

      if (currentId === lastSearchId) {
        if (isLoadMore) {
          places.value = [...places.value, ...data.placeSearchResponseDtoList]
        } else {
          places.value = data.placeSearchResponseDtoList
        }

        // Update pagination meta
        currentPage.value = data.currentPage
        totalPages.value = data.totalPages
        totalCount.value = data.totalCount
      }
    } catch (e) {
      if (currentId === lastSearchId) {
        error.value = '데이터를 불러오지 못했습니다.'
        if (!isLoadMore) places.value = []
        console.error(e)
      }
    } finally {
      if (currentId === lastSearchId) {
        isLoading.value = false
      }
    }
  }

  // 여행지 상세 정보 가져오기
  const getPlaceDetail = async (id: string) => {
    const currentId = ++lastDetailId
    isLoading.value = true
    error.value = null
    place.value = null // 초기화

    try {
      const data = await placeApi.getPlaceDetail(id)
      if (currentId === lastDetailId) {
        place.value = data
      }
    } catch (e) {
      if (currentId === lastDetailId) {
        error.value = '상세 정보를 불러오지 못했습니다.'
        console.error(e)
      }
    } finally {
      if (currentId === lastDetailId) {
        isLoading.value = false
      }
    }
  }

  const fetchRegions = async () => {
    try {
      const data = await placeApi.getRegions()
      regions.value = data
    } catch (e) {
      console.error('Failed to fetch regions', e)
    }
  }

  const resetPlace = () => {
    place.value = null
    error.value = null
  }

  return {
    places,
    place,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalCount,
    getPlace: getPlaceDetail,
    recommendPlace,
    fetchPlaces,
    getPlaceDetail, // Alias 유지 (호환성)
    resetPlace,
    regions,
    fetchRegions
  }
}

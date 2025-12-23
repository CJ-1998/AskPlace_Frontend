// @/features/place/composables/usePlaceRecommend.ts
import { ref } from 'vue'
import { placeApi } from '@/features/place/api/place'
import type { PlaceSummary } from '@/features/place/types/place'

export function usePlaceRecommend() {
    const recommendedPlaces = ref<PlaceSummary[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const fetchRecommendations = async () => {
        isLoading.value = true
        error.value = null
        try {
            const data = await placeApi.getRecommendedPlaces()
            // PlaceListSearchResponseDto에서 리스트 추출
            recommendedPlaces.value = data.placeSearchResponseDtoList
        } catch (err) {
            console.error('추천 여행지 로드 실패:', err)
            error.value = '추천 여행지를 불러오는 중 오류가 발생했습니다.'
        } finally {
            isLoading.value = false
        }
    }

    return {
        recommendedPlaces,
        isLoading,
        error,
        fetchRecommendations
    }
}
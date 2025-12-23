import { apiClient } from '@/shared/api/client'
import type { Place, PlaceListSearchResponseDto, PlaceDetailResponseDto, Region } from '@/features/place/types/place'
import type { ApiResponse } from '@/shared/types/apiResponse'

export const placeApi = {
  // GET /places?placeName=...&region=...&page=0&size=50
  async getPlaces(params?: { placeName?: string, region?: string, page?: number, size?: number }) {
    const response = await apiClient.get<ApiResponse<PlaceListSearchResponseDto>>('/places', {
      params
    })
    return response.data.data
  },

  // GET /places/recommend
  async getRecommendedPlaces() {
    const response = await apiClient.get<ApiResponse<PlaceListSearchResponseDto>>('/places/recommend')
    return response.data.data
  },

  // GET /places/detail/{placeId}
  async getPlaceDetail(id: string) {
    const response = await apiClient.get<ApiResponse<PlaceDetailResponseDto>>(`/places/detail/${id}`)
    return response.data.data
  },

  // GET /places/nearby
  async getNearbyPlaces(lat: number, lng: number, radius: number = 3.0) {
    const response = await apiClient.get<ApiResponse<PlaceListSearchResponseDto>>('/places/nearby', {
      params: { lat, lng, radius }
    })
    return response.data.data
  },

  // Admin/Other methods can stay if needed, keeping them generic for now
  async createPlace(placeData: Partial<Place>) {
    const response = await apiClient.post<Place>('/places', placeData)
    return response.data
  },

  async updatePlace(id: string, placeData: Partial<Place>) {
    const response = await apiClient.put<Place>(`/places/${id}`, placeData)
    return response.data
  },

  async deletePlace(id: string) {
    const response = await apiClient.delete(`/places/${id}`)
    return response.data
  },

  // GET /places/regions
  async getRegions() {
    const response = await apiClient.get<ApiResponse<Region[]>>('/places/regions')
    return response.data.data
  }
}

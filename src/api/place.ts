import { apiClient } from './client'
import type { Place } from '@/types/place'

export const placeApi = {
  async getPlaces(params?: any) {
    const response = await apiClient.get<Place[]>('/places', { params })
    return response.data
  },

  async getPlaceById(id: number) {
    const response = await apiClient.get<Place>(`/places/${id}`)
    return response.data
  },

  async createPlace(placeData: Partial<Place>) {
    const response = await apiClient.post<Place>('/places', placeData)
    return response.data
  },

  async updatePlace(id: number, placeData: Partial<Place>) {
    const response = await apiClient.put<Place>(`/places/${id}`, placeData)
    return response.data
  },

  async deletePlace(id: number) {
    const response = await apiClient.delete(`/places/${id}`)
    return response.data
  }
}

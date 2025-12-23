import { apiClient } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/types/api'
import type { 
  TravelPlanDetailResponseDto, 
  DailyPlanDetailResponseDto,
  TravelPlanListResponseDto,
  TravelPlanRequestDto
} from '@/features/plan/types/plan'

export const planApi = {
  // Plan List
  async getPlans(params?: any) {
    const response = await apiClient.get<ApiResponse<TravelPlanListResponseDto>>('/plans', { params })
    return response.data.data
  },

  async getMyPlans() {
    const response = await apiClient.get<ApiResponse<TravelPlanListResponseDto>>('/plans/me')
    return response.data.data
  },

  async getPlanById(id: string) {
    const response = await apiClient.get<ApiResponse<TravelPlanDetailResponseDto>>(`/plans/${id}`)
    return response.data.data
  },

  async getDailyPlanDetail(dailyPlanId: string) {
    const response = await apiClient.get<ApiResponse<DailyPlanDetailResponseDto>>(`/plans/days/${dailyPlanId}`)
    return response.data.data
  },

  async createPlan(planData: TravelPlanRequestDto) {
    const response = await apiClient.post<ApiResponse<string>>('/plans', planData)
    return response.data.data
  },

  async updatePlan(id: string, planData: TravelPlanRequestDto) {
    const response = await apiClient.put<ApiResponse<string>>(`/plans/${id}`, planData)
    return response.data.data
  },

  async deletePlan(id: string) {
    const response = await apiClient.delete<ApiResponse<any>>(`/plans/${id}`)
    return response.data.data
  },

  async clonePlan(id: string) {
    const response = await apiClient.post<ApiResponse<string>>(`/plans/${id}/clone`)
    return response.data.data
  }
}


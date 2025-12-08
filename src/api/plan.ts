import { apiClient } from './client'
import type { Plan } from '@/types/plan'

export const planApi = {
  async getPlans(params?: any) {
    const response = await apiClient.get<Plan[]>('/plans', { params })
    return response.data
  },

  async getPlanById(id: number) {
    const response = await apiClient.get<Plan>(`/plans/${id}`)
    return response.data
  },

  async createPlan(planData: Partial<Plan>) {
    const response = await apiClient.post<Plan>('/plans', planData)
    return response.data
  },

  async updatePlan(id: number, planData: Partial<Plan>) {
    const response = await apiClient.put<Plan>(`/plans/${id}`, planData)
    return response.data
  },

  async deletePlan(id: number) {
    const response = await apiClient.delete(`/plans/${id}`)
    return response.data
  }
}

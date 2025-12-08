import { defineStore } from 'pinia'
import { ref } from 'vue'
import { planApi } from '@/api/plan'
import type { Plan } from '@/types/plan'

export const usePlanStore = defineStore('plan', () => {
  const plans = ref<Plan[]>([])
  const currentPlan = ref<Plan | null>(null)
  const isLoading = ref(false)

  const fetchPlans = async (params?: any) => {
    isLoading.value = true
    try {
      plans.value = await planApi.getPlans(params)
    } catch (error) {
      console.error('Failed to fetch plans', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchPlanById = async (id: number) => {
    isLoading.value = true
    try {
      currentPlan.value = await planApi.getPlanById(id)
      return currentPlan.value
    } catch (error) {
      console.error('Failed to fetch plan', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createPlan = async (planData: Partial<Plan>) => {
    try {
      const newPlan = await planApi.createPlan(planData)
      plans.value.push(newPlan)
      return newPlan
    } catch (error) {
      console.error('Failed to create plan', error)
      throw error
    }
  }

  return {
    plans,
    currentPlan,
    isLoading,
    fetchPlans,
    fetchPlanById,
    createPlan
  }
})

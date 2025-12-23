import { useRouter } from 'vue-router'
import { usePlanStore } from '@/features/plan/stores/plan'
import { useToast } from '@/shared/composables/useToast'

export function usePlanInteraction() {
  const router = useRouter()
  const planStore = usePlanStore()
  const { showToast } = useToast()

  const handleDelete = async (planId: string) => {
    if (!confirm('정말로 이 여행 계획을 삭제하시겠습니까?')) return
    
    try {
      await planStore.deletePlan(planId)
      showToast('여행 계획이 삭제되었습니다.')
      router.replace({ name: 'plan-list' })
    } catch (e) {
      showToast('삭제 중 오류가 발생했습니다.')
      console.error(e)
    }
  }

  const handleClone = async (planId: string) => {
    if (!confirm('이 여행 계획을 복사하여 내 보관함에 저장하시겠습니까?')) return
  
    try {
      const newId = await planStore.clonePlan(planId)
      showToast('여행 계획이 성공적으로 복사되었습니다. 편집 페이지로 이동합니다.')
      router.push({ name: 'plan-edit', params: { id: newId } })
    } catch (e) {
      showToast('복사 중 오류가 발생했습니다.')
      console.error(e)
    }
  }

  const handleEdit = (planId: string) => {
    router.push({ name: 'plan-edit', params: { id: planId } })
  }

  return {
    handleDelete,
    handleClone,
    handleEdit
  }
}

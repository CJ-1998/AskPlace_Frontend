import { ref } from 'vue'

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

export function useToast() {
  const showToast = (message: string, type = 'success', duration = 3000) => {
    toast.value = {
      show: true,
      message,
      type
    }

    setTimeout(() => {
      toast.value.show = false
    }, duration)
  }

  return {
    toast,
    showToast
  }
}

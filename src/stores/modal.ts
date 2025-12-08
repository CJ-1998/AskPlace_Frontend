import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', () => {
  const isAuthOpen = ref(false)
  const authMode = ref<'login' | 'regist'>('login')

  const openAuth = (mode: 'login' | 'regist' = 'login') => {
    authMode.value = mode
    isAuthOpen.value = true
  }

  const closeAuth = () => {
    isAuthOpen.value = false
    setTimeout(() => { authMode.value = 'login' }, 300)
  }

  const toggleAuth = () => {
    isAuthOpen.value = !isAuthOpen.value
  }
  
  const setAuthMode = (mode: 'login' | 'regist') => {
    authMode.value = mode
  }

  return { 
    isAuthOpen, 
    authMode,
    openAuth, 
    closeAuth,
    toggleAuth,
    setAuthMode
  }
})
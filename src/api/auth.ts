import { RegistRequest } from '@/types/auth'
import { apiClient } from './client'

// Auth API 모듈
export const authApi = {
  async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  },
  async regist(userData: RegistRequest) {
    const response = await apiClient.post('/auth/regist', userData)
    return response.data
  },
  async refreshToken() {
    // 쿠키(Refresh Token)는 자동으로 전송됨
    const response = await apiClient.post('/auth/refresh')
    return response.data
  },
  async logout() {
    const response = await apiClient.post('/auth/logout')
    return response.data
  }
}
import { apiClient } from '@/shared/api/client'
import type { UserProfile, UserActivity } from '@/features/user/types/user'
import type { ApiResponse } from '@/features/auth/types/auth'

export const userApi = {
  // 내 프로필 정보 조회
  async getMyProfile() {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/users/profile')
    return response.data.data
  },

  // 내 프로필 수정
  async updateProfile(userUuid: string, data: Partial<UserProfile>) {
    const response = await apiClient.patch<ApiResponse<UserProfile>>(`/users/${userUuid}`, data)
    return response.data.data
  },

  // 회원 탈퇴
  async withdrawUser(userUuid: string) {
    const response = await apiClient.delete(`/users/${userUuid}`)
    return response.data
  },

  // 내 활동 내역 조회 (여행 계획, 찜한 장소, 비디오 등)
  async getUserActivity() {
    // TODO : 백엔드 API 구현 후 연동 필요
    // 현재는 빈 배열 반환하여 에러 방지
    return {
      myPlans: [],
      likedPlaces: [],
      myVideos: []
    } as UserActivity
  }
}

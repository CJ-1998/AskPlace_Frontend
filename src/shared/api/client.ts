import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
  if(token){
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }else{
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

export const getAccessToken = () => accessToken

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터 (변수에 저장된 토큰 사용)
apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 응답 인터셉터 (401 에러 시 토큰 재발급)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 Unauthorized 에러이고, 재시도한 요청이 아닐 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // 재시도 플래그 설정

      try {
        // Refresh API 호출 (순환 참조 방지를 위해 axios 직접 사용)
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        // 새 토큰 저장
        const newAccessToken = data.data.accessToken
        setAccessToken(newAccessToken)

        // 원래 요청의 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // 원래 요청 재시도
        return apiClient(originalRequest)
      } catch (refreshError) {
        // 재발급 실패 (로그인 만료)
        setAccessToken(null)
        // 필요 시 이곳에서 window.location.href = '/login' 등으로 강제 이동 가능
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

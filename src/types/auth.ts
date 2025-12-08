// 인증 관련 데이터 인터페이스
export interface AuthData {
  email: string
  name: string
  role: string
  accessToken: string
}

// 로그인 응답 타입
export type LoginResponse = AuthData

// Generic API 응답 인터페이스
export interface ApiResponse<T> {
  result: string
  data: T
  errorCode: string | null
  message: string | null
}

// 로그인 요청 인터페이스
export interface LoginRequest {
  email: string
  password: string
}

// 회원가입 요청 인터페이스
export interface RegistRequest { 
  email: string
  password: string
  passwordConfirm: string
  name: string
}
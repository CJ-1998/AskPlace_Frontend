
export interface AuthData {
  email: string
  name: string
  role: string
  accessToken: string
}

export interface AccessTokenPayload {
  sub: string // uuid
  name: string
  email: string
  role: string
  exp: number
}

export interface UserData {
  uuid: string
  name: string
  email: string
  role: string
  introduction?: string
}

// 로그인 응답 타입
export type LoginResponse = AuthData

// Generic API 응답 인터페이스 (Re-export for compatibility)
export type { ApiResponse } from '@/shared/types/api'


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
export interface ApiResponse<T> {
  result: string
  message: string
  data: T
  errorCode: string | null
}

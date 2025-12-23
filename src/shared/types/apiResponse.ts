export interface ApiResponse<T> {
    result: 'SUCCESS' | 'ERROR';
    data: T;
    errorCode: string | null;
    message: string | null;
}
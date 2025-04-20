// src/types/response.types.ts
export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  message: string;
  error?: string;
  status?: number;
}

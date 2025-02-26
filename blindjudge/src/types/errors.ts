// src/types/errors.ts
import { AxiosError } from "axios";

export interface ApiErrorData {
  message?: string;
  error?: string;
}

export type ApiError = AxiosError<ApiErrorData>;

export const defaultErrorMsg = 'An unexpected error occurred. Please try again later.';

export type JLPTLevel = {
  id: string;
  name: string;
  total_count: number;
}

export interface ApiError {
  ok?: boolean;
  code?: number;
  message?: string;
}
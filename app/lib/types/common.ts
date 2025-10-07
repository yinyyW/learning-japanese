export const defaultErrorMsg = 'An unexpected error occurred. Please try again later.';

export interface ApiError {
  ok?: boolean;
  code?: number;
  message?: string;
}
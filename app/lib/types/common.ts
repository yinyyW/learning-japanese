import { UUID } from "crypto";

export const defaultErrorMsg = 'An unexpected error occurred. Please try again later.';

export type JLPTLevel = {
  id: string;
  name: string;
  total_count: number;
}

export enum WordStatus {
  learned = 'learned',
  not_learned = 'not_learned',
}

export type Word = {
  id: string;
  word: string;
  meaning: string;
  jlpt_level_id: UUID;
  furigana?: string;
  romaji?: string;
  level?: number;
}

export interface ApiError {
  ok?: boolean;
  code?: number;
  message?: string;
}
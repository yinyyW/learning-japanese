export type JLPTLevel = {
  id: string;
  level_name: string;
  total_count: number;
}

export type Word = {
  id: string;
  word: string;
  jlpt_level_id: string;
  meaning?: string;
  furigana?: string;
  romaji?: string;
  level?: number;
}

export enum WordStatus {
  learned = 'learned',
  not_learned = 'not_learned',
}
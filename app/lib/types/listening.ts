export interface ListeningTranscript {
  start: string;
  startSecends?: number;
  end: string;
  endSecends?: number;
  text: string;
  show?: boolean;
}

export interface ListeningQuestion {
  question_id: number;
  text?: string;
  options?: string[];
  answer_index?: string | number;
}

export interface ListeningMaterial {
  material_id: number;
  exam_id: number;
  title: string;
  audio_url: string;
  // JSONB stringified array of ListeningTranscript
  transcript?: string;
  // JSONB stringified array of ListeningQuestion
  question?: string;
  transcript_data?: ListeningTranscript[];
  question_data?: ListeningQuestion;
}

export interface ListeningExam {
  exam_id: number;
  title?: string;
  exam_date?: string;
  level_id?: string;
  description?: string;
  img_url?: string;
  level_name?: string;
}
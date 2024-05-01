import { QuizDAO } from './dao';

export interface QuestionAnalysis {
  rating: number;
  explanation: string;
}

export type ProposedQuizAttributes = Pick<QuizDAO, 'subject_area' | 'difficulty' | 'quiz_type'> & {
  included_topics_arr: string[];
  excluded_topics_arr: string[];
  exclusive_topics_arr: string[];
  num_topics: number;
  ques_per_topic: number;
};

export type EnumSelectWorkaround = Omit<ProposedQuizAttributes, 'difficulty'> & {
  difficulty: string;
};

export type EphemeralQuiz = Partial<QuizDAO>;

export interface QuizOverview {
  quiz_id: string;
  created_at: Date;
  subject_area: string;
  difficulty: string;
  total_answers: number;
  great: number;
  good: number;
  average: number;
  needs_improvement: number;
  irrelevant: number;
  topics: string[];
}

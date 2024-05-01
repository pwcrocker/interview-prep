import { USER_TIER } from './enum';

export interface UserDAO {
  user_id: string;
  user_sub: string;
  username: string;
  email: string;
  tokens: number;
  paid_tier: USER_TIER;
  is_disabled: boolean;
  num_times_rate_limited: number;
  last_quiz_creation: Date;
  last_quiz_grading: Date;
  created_at: Date;
  modified_at: Date;
}

export interface QuizDAO {
  quiz_id: string;
  user_sub: string;
  quiz_type: string;
  subject_area: string;
  difficulty: string;
  included_topics: string;
  excluded_topics: string;
  exclusive_topics: string;
  is_graded: boolean;
}

export interface QuestionDAO {
  ques_id: string;
  ques_text: string;
  ques_topic: string;
}

export interface UserAnswerDAO {
  answer_id: string;
  user_sub: string;
  ques_id: string;
  user_answer: string;
  summary_analysis: number;
  detailed_analysis: string;
}

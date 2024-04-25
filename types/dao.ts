export interface UserDAO {
  user_id: string;
  user_sub: string;
  username: string;
  email: string;
  tokens: number;
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
  subject_area: string;
  difficulty_modifier: string;
  included_topics: string;
  excluded_topics: string;
  exclusive_topics: string;
  is_graded: boolean;
}

export interface QuestionDAO {
  question_id: string;
  question: string;
  question_topic: string;
}

export interface UserAnswerDAO {
  answer_id: string;
  user_sub: string;
  question_id: string;
  user_answer: string;
  ai_summary_analysis: number;
  ai_detailed_analysis: string;
}

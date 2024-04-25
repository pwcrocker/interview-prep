import { UserAnswerDAO } from './dao';

export type EphemeralUserAnswer = Pick<UserAnswerDAO, 'question_id' | 'user_answer'>;
export type EphemeralAnalysisResponse = Pick<
  UserAnswerDAO,
  'question_id' | 'ai_summary_analysis' | 'ai_detailed_analysis'
>;
export type EphemeralGradedUserAnswer = Omit<UserAnswerDAO, 'answer_id'>;
export type PersistedUserAnswer = UserAnswerDAO;

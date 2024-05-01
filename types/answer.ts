import { QuestionDAO, UserAnswerDAO } from './dao';

export type EphemeralUserAnswer = Pick<UserAnswerDAO, 'ques_id' | 'user_answer'> &
  Pick<QuestionDAO, 'ques_text'>;
export type EphemeralAnalysisResponse = Pick<
  UserAnswerDAO,
  'ques_id' | 'summary_analysis' | 'detailed_analysis'
>;
export type EphemeralGradedUserAnswer = Omit<UserAnswerDAO, 'answer_id'>;
export type PersistedUserAnswer = UserAnswerDAO;

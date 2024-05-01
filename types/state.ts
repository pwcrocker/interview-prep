import { QuestionDAO, QuizDAO, UserAnswerDAO } from './dao';

export type StateQuestion = Partial<QuestionDAO> & {
  question_answer?: Partial<UserAnswerDAO>;
};

export type StateQuiz = QuizDAO &
  Partial<Pick<QuizDAO, 'quiz_id' | 'is_graded'>> & { quiz_questions: StateQuestion[] };

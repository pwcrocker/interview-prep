import { EphemeralGradedUserAnswer, EphemeralUserAnswer, PersistedUserAnswer } from './answer';
import { QuestionDAO } from './dao';

export type EphemeralQuestion = Partial<QuestionDAO>;
export type PersistedQuestion = QuestionDAO & { question_answer?: EphemeralUserAnswer };
export type AnsweredQuestion = QuestionDAO & { question_answer: EphemeralGradedUserAnswer };
export type FinalizedQuestion = QuestionDAO & { question_answer: PersistedUserAnswer };
export type StateQuestion = QuestionDAO & { question_answer: Partial<PersistedUserAnswer> };

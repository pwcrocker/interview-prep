import { EphemeralQuiz, FinalizedQuiz, PersistedQuiz } from './quiz';

export type QuizState = EphemeralQuiz | PersistedQuiz | FinalizedQuiz;

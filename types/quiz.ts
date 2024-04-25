import { QuizDAO } from './dao';
import {
  AnsweredQuestion,
  EphemeralQuestion,
  FinalizedQuestion,
  PersistedQuestion,
  StateQuestion,
} from './question';

export interface QuestionAnalysis {
  rating: number;
  explanation: string;
}

export type ProposedQuizAttributes = Pick<QuizDAO, 'subject_area' | 'difficulty_modifier'> & {
  included_topics_arr: string[];
  excluded_topics_arr: string[];
  exclusive_topics_arr: string[];
  num_topics: number;
  ques_per_topic: number;
};

export type EphemeralQuiz = Partial<QuizDAO> & { quiz_questions: EphemeralQuestion[] };
export type PersistedQuiz = QuizDAO & { quiz_questions: PersistedQuestion[] };
export type AnsweredQuiz = QuizDAO & { quiz_questions: AnsweredQuestion[] };
export type FinalizedQuiz = QuizDAO & { quiz_questions: FinalizedQuestion[] };
export type StateQuiz = QuizDAO & { quiz_questions: Partial<StateQuestion>[] };

'use client';

import { createContext, useReducer } from 'react';
import quizReducer from '@/reducers/quizReducer';
import { StateQuiz } from '@/types/state';
import { EphemeralUserAnswer, PersistedUserAnswer } from '@/types/answer';
import { QuestionDAO, QuizDAO } from '@/types/dao';
import { PROFESSION_LABELS, QUIZ_DIFFICULTY, QUIZ_TYPE } from '@/types/enum';

export enum QuizActionType {
  MAKE_QUIZ = 'make-quiz',
  ANSWER_SINGLE_QUESTION = 'answer-question',
  GRADE_QUIZ = 'grade-quiz',
  RESET_QUIZ = 'reset-quiz',
}

export type QuizAction =
  | {
      type: QuizActionType.MAKE_QUIZ;
      payload: { persistedQuiz: QuizDAO; persistedQuestions: QuestionDAO[] };
    }
  | {
      type: QuizActionType.ANSWER_SINGLE_QUESTION;
      payload: { questionIdx: number; answer: EphemeralUserAnswer };
    }
  | {
      type: QuizActionType.GRADE_QUIZ;
      payload: PersistedUserAnswer[];
    }
  | {
      type: QuizActionType.RESET_QUIZ;
    };
// quiz should be overwritten with PersistedQuiz
export interface QuizContextType {
  quiz: StateQuiz;
  dispatch: React.Dispatch<QuizAction>;
}

export const initialReducerState: StateQuiz = {
  quiz_id: '',
  user_sub: '',
  quiz_type: QUIZ_TYPE.PROFESSION,
  subject_area: '',
  difficulty: PROFESSION_LABELS[QUIZ_DIFFICULTY.INTERMEDIATE],
  included_topics: '',
  excluded_topics: '',
  exclusive_topics: '',
  is_graded: false,
  quiz_questions: [],
};

export const QuizContext = createContext<QuizContextType>({
  quiz: initialReducerState,
  dispatch: () => {},
});

export default function QuizContextProvider({ children }: { children: React.ReactNode }) {
  const [quiz, dispatch] = useReducer(quizReducer, initialReducerState);

  const ctxValue = {
    quiz,
    dispatch,
  };

  return <QuizContext.Provider value={ctxValue}>{children}</QuizContext.Provider>;
}

'use client';

import { createContext, useReducer } from 'react';
import quizReducer from '@/reducers/quizReducer';
import { QuestionAnalysis, Quiz } from '@/types/quiz';
import { StitchedResponse } from '@/types/response';

export enum QuizActionType {
  MAKE_QUIZ = 'make-quiz',
  ANSWER_QUESTION = 'answer-question',
  ADD_ANALYSIS = 'add-analysis',
  RESET_QUIZ = 'reset-quiz',
}

export type QuizAction =
  | {
      type: QuizActionType.MAKE_QUIZ;
      payload: StitchedResponse;
    }
  | {
      type: QuizActionType.ANSWER_QUESTION;
      payload: { questionIdx: number; userAnswer: string };
    }
  | {
      type: QuizActionType.ADD_ANALYSIS;
      payload: { question: string; questionAnalysis: QuestionAnalysis };
    }
  | {
      type: QuizActionType.RESET_QUIZ;
    };

export interface QuizContextType {
  quiz: Quiz;
  dispatch: React.Dispatch<QuizAction>;
}

export const initialReducerState: Quiz = {
  questions: [],
  attributes: {
    profession: {
      job: null,
      experience: null,
    },
  },
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

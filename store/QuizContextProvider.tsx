'use client';

import { createContext, useReducer } from 'react';
import quizReducer from '@/reducers/quizReducer';
import { Quiz } from '@/types/quiz';
import { PreliminaryQuiz } from '@/types/createQuiz';
import { EXPERIENCE } from '@/types/experience';
import { GradedQuiz } from '@/types/gradeQuiz';
import { RetryAnalysis } from '@/types/questionRetry';

export enum QuizActionType {
  MAKE_QUIZ = 'make-quiz',
  GRADE_QUIZ = 'grade-quiz',
  ANSWER_SINGLE_QUESTION = 'answer-single-question',
  RETRY_SINGLE_ANALYSIS = 'retry-single-analysis',
  RETAKE_QUIZ = 'retake-quiz',
  RESET_QUIZ = 'reset-quiz',
}

export type QuizAction =
  | {
      type: QuizActionType.MAKE_QUIZ;
      payload: PreliminaryQuiz;
    }
  | {
      type: QuizActionType.GRADE_QUIZ;
      payload: GradedQuiz;
    }
  | {
      type: QuizActionType.ANSWER_SINGLE_QUESTION;
      payload: { questionId: string; userAnswer: string };
    }
  | {
      type: QuizActionType.RETRY_SINGLE_ANALYSIS;
      payload: RetryAnalysis;
    }
  | {
      type: QuizActionType.RETAKE_QUIZ;
      payload: { quiz: Quiz };
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
      job: '',
      experience: EXPERIENCE.INTERMEDIATE,
    },
    topics: 3,
    quesPerTopic: 1,
    includedAreas: [],
    excludedAreas: [],
    exclusiveAreas: [],
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

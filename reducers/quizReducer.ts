import { QuizAction, QuizActionType, initialReducerState } from '@/store/QuizContextProvider';
import { FinalizedQuiz, PersistedQuiz, StateQuiz } from '@/types/quiz';
import { log, logJson } from '@/lib/logger';
import { EphemeralUserAnswer, PersistedUserAnswer } from '@/types/answer';

function answerSingleQuestion(
  quiz: PersistedQuiz,
  { questionIdx, answer }: { questionIdx: number; answer: EphemeralUserAnswer }
) {
  const newState = {
    ...quiz,
    quiz_questions: quiz.quiz_questions.map((curQues, idx) => {
      if (idx === questionIdx) {
        return {
          ...curQues,
          question_answer: {
            ...curQues.question_answer,
            ...answer,
          },
        };
      }
      return curQues;
    }),
  };

  logJson('Answering single question: ', newState.quiz_questions[questionIdx]);
  return newState;
}

function stitchAnswersIntoQuiz(quiz: FinalizedQuiz, answers: PersistedUserAnswer[]): FinalizedQuiz {
  const quesIdToAns = new Map<string, PersistedUserAnswer>();
  answers.forEach((answer) => quesIdToAns.set(answer.question_id, answer));
  const newState: FinalizedQuiz = {
    ...quiz,
    quiz_questions: quiz.quiz_questions.map((curQues) => ({
      ...curQues,
      question_answer: {
        ...curQues.question_answer,
        ...quesIdToAns.get(curQues.question_id),
      },
    })),
  };
  log('Stitched answers into final quiz');
  return newState;
}

export default function quizReducer(quiz: StateQuiz, action: QuizAction): StateQuiz {
  switch (action.type) {
    case QuizActionType.MAKE_QUIZ:
      return { ...action.payload };
    case QuizActionType.ANSWER_SINGLE_QUESTION:
      return {
        ...quiz,
        ...answerSingleQuestion(quiz as PersistedQuiz, action.payload),
      };
    case QuizActionType.GRADE_QUIZ:
      return {
        ...quiz,
        ...stitchAnswersIntoQuiz(quiz as FinalizedQuiz, action.payload),
      };
    case QuizActionType.RESET_QUIZ:
      return initialReducerState;
    default:
      return quiz;
  }
}

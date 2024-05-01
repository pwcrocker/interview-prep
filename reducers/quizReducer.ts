import { QuizAction, QuizActionType, initialReducerState } from '@/store/QuizContextProvider';
import { StateQuiz } from '@/types/state';
import { log, logJson } from '@/lib/logger';
import { EphemeralUserAnswer, PersistedUserAnswer } from '@/types/answer';
import { UserAnswerDAO } from '@/types/dao';

function answerSingleQuestion(
  quiz: StateQuiz,
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

function stitchAnswersIntoQuiz(quiz: StateQuiz, answers: UserAnswerDAO[]) {
  const quesIdToAns = new Map<string, PersistedUserAnswer>();
  answers.forEach((answer) => quesIdToAns.set(answer.ques_id, answer));
  const newState = {
    ...quiz,
    quiz_questions: quiz.quiz_questions.map((curQues) => ({
      ...curQues,
      question_answer: {
        ...curQues.question_answer,
        // TODO forcing ques_id here...
        ...quesIdToAns.get(curQues.ques_id!),
      },
    })),
    is_graded: true,
  };
  log('Stitched answers into final quiz and marked as graded');
  return newState;
}

export default function quizReducer(quiz: StateQuiz, action: QuizAction): StateQuiz {
  switch (action.type) {
    case QuizActionType.MAKE_QUIZ:
      return {
        ...quiz,
        ...action.payload.persistedQuiz,
        // quiz_questions should be empty here...
        quiz_questions: [...action.payload.persistedQuestions],
      };
    case QuizActionType.ANSWER_SINGLE_QUESTION:
      return {
        ...quiz,
        ...answerSingleQuestion(quiz as StateQuiz, action.payload),
      };
    case QuizActionType.GRADE_QUIZ:
      return {
        ...quiz,
        ...stitchAnswersIntoQuiz(quiz, action.payload),
      };
    case QuizActionType.RESET_QUIZ:
      return initialReducerState;
    default:
      return quiz;
  }
}

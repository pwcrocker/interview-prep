/* eslint-disable no-console */
import { QuizAction, QuizActionType, initialReducerState } from '@/store/QuizContextProvider';
import { Question, Quiz } from '@/types/quiz';
import { PreliminaryQuiz } from '@/types/createQuiz';
import { logJson } from '@/lib/logger';
import { RetryAnalysis } from '@/types/questionRetry';
import { GradedQuiz } from '@/types/gradeQuiz';

function buildQuiz(prelimQuiz: PreliminaryQuiz) {
  const freshQuiz: Quiz = {
    questions: [],
    attributes: prelimQuiz.attributes,
  };

  prelimQuiz.quiz.quizItems.forEach((quizItem) => {
    quizItem.questions.forEach((generatedQ) => {
      const newQ: Question = {
        id: generatedQ.id,
        question: generatedQ.question,
        attributes: { topic: quizItem.topic },
      };
      freshQuiz.questions.push(newQ);
    });
  });

  logJson('Building fresh quiz: ', freshQuiz);
  return freshQuiz;
}

interface IdToIndexMap {
  [x: string]: number;
}

function gradeQuiz(quiz: Quiz, gradedQuiz: GradedQuiz) {
  // make a Qid -> Qidx map for O(1) lookup when assigning analysis
  const map: IdToIndexMap = quiz.questions.reduce(
    (acc, ques, idx) => ({ ...acc, [ques.id]: idx }),
    {}
  );
  const updatedQuiz = { ...quiz };
  const updatedQuesArr = [...updatedQuiz.questions];

  gradedQuiz.gradedItems.forEach((item) => {
    const { questionId, summary, detailed } = item;
    // Instantly get index for insertion
    const questionIdx = map[questionId];
    const updatedQuestion: Question = {
      ...updatedQuesArr[questionIdx],
      analysis: { summary, detailed },
    };
    updatedQuesArr[questionIdx] = updatedQuestion;
  });

  logJson('Grading quiz: ', updatedQuiz);
  updatedQuiz.questions = updatedQuesArr;
  return updatedQuiz;
}

function answerSingleQuestion(quiz: Quiz, questionId: string, userAnswer: string) {
  const updatedQuiz = { ...quiz };
  const updatedQuesArr = [...updatedQuiz.questions];
  const questionIdx = updatedQuesArr.findIndex((ques) => ques.id === questionId);
  const updatedQuestion = { ...updatedQuesArr[questionIdx] };
  updatedQuestion.userAnswer = userAnswer;
  updatedQuesArr[questionIdx] = updatedQuestion;
  updatedQuiz.questions = updatedQuesArr;

  logJson('Answering single question: ', updatedQuestion);
  return updatedQuiz;
}

function addSingleAnalysis(quiz: Quiz, { questionId, summary, detailed }: RetryAnalysis) {
  const updatedQuiz = { ...quiz };
  const updatedQuesArr = [...updatedQuiz.questions];
  const questionIdx = updatedQuesArr.findIndex((ques) => ques.id === questionId);
  const updatedQuestion = { ...updatedQuesArr[questionIdx] };
  updatedQuestion.analysis = { summary, detailed };
  updatedQuesArr[questionIdx] = updatedQuestion;
  updatedQuiz.questions = updatedQuesArr;

  logJson('Adding single analysis: ', updatedQuestion);
  return updatedQuiz;
}

export default function quizReducer(quiz: Quiz, action: QuizAction) {
  switch (action.type) {
    case QuizActionType.MAKE_QUIZ:
      return { ...quiz, ...buildQuiz(action.payload) };
    case QuizActionType.GRADE_QUIZ:
      return { ...quiz, ...gradeQuiz(quiz, action.payload) };
    case QuizActionType.ANSWER_SINGLE_QUESTION:
      return {
        ...quiz,
        ...answerSingleQuestion(
          quiz,
          action.payload.questionId,
          action.payload.userAnswer || 'No answer'
        ),
      };
    case QuizActionType.RETRY_SINGLE_ANALYSIS:
      return {
        ...quiz,
        ...addSingleAnalysis(quiz, action.payload),
      };
    case QuizActionType.RETAKE_QUIZ:
      return { ...quiz, ...action.payload.quiz };
    case QuizActionType.RESET_QUIZ:
      return initialReducerState;
    default:
      return quiz;
  }
}

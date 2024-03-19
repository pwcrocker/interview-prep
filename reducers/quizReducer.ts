/* eslint-disable no-console */
import { QuizAction, QuizActionType, initialReducerState } from '@/store/QuizContextProvider';
import { Question, QuestionAnalysis, Quiz } from '@/types/quiz';
import { StitchedResponse } from '@/types/response';

function buildQuiz(stitchedRes: StitchedResponse) {
  const freshQuiz: Quiz = {
    questions: [],
    attributes: {
      profession: stitchedRes.profession,
    },
  };

  stitchedRes.response.quizTopics.forEach((quizTopic) => {
    quizTopic.questions.forEach((question) => {
      const newQ: Question = { question, attributes: { topic: quizTopic.topic } };
      freshQuiz.questions.push(newQ);
    });
  });

  console.log(`BUILT QUIZ: ${JSON.stringify(freshQuiz, null, 2)}`);

  return freshQuiz;
}

function answerQuestion(quiz: Quiz, questionIdx: number, userAnswer: string) {
  const updatedQuiz = { ...quiz };
  const updatedQuesArr = [...updatedQuiz.questions];
  const updatedQuestion = { ...updatedQuesArr[questionIdx] };
  updatedQuestion.userAnswer = userAnswer;
  updatedQuesArr[questionIdx] = updatedQuestion;
  updatedQuiz.questions = updatedQuesArr;

  console.log(`CREATING ANSWER: ${questionIdx}`);
  return updatedQuiz;
}

function addAnalysis(quiz: Quiz, question: string, quesAnalysis: QuestionAnalysis) {
  const questionIdx = quiz.questions.findIndex((curQues) => curQues.question === question);
  const updatedQuiz = { ...quiz };
  const updatedQuesArr = [...updatedQuiz.questions];
  const updatedQuestion = { ...updatedQuesArr[questionIdx] };
  updatedQuestion.analysis = quesAnalysis;
  updatedQuesArr[questionIdx] = updatedQuestion;
  updatedQuiz.questions = updatedQuesArr;
  console.log(`CREATING ANALYSIS: ${questionIdx}`);

  return updatedQuiz;
}

export default function quizReducer(quiz: Quiz, action: QuizAction) {
  switch (action.type) {
    case QuizActionType.MAKE_QUIZ:
      return { ...quiz, ...buildQuiz(action.payload) };
    case QuizActionType.ANSWER_QUESTION:
      console.log(`answering question: ${action.payload.questionIdx} `);
      return {
        ...quiz,
        ...answerQuestion(quiz, action.payload.questionIdx, action.payload.userAnswer),
      };
    case QuizActionType.ADD_ANALYSIS:
      console.log(
        `Adding analysis question: ${quiz.questions.findIndex((curQues) => curQues.question === action.payload.question)} `
      );
      return {
        ...quiz,
        ...addAnalysis(quiz, action.payload.question, action.payload.questionAnalysis),
      };
    case QuizActionType.RETAKE_QUIZ:
      return { ...quiz, ...action.payload.quiz };
    case QuizActionType.RESET_QUIZ:
      return initialReducerState;
    default:
      return quiz;
  }
}

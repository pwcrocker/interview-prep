/* eslint-disable no-console */
import { QuizAction, QuizActionType } from '@/store/QuizContextProvider';
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

  console.log(`SET USER ANSWER: ${JSON.stringify(updatedQuiz, null, 2)}`);
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

  console.log(`SET ANALYSIS: ${JSON.stringify(updatedQuiz, null, 2)}`);
  return updatedQuiz;
}

export default function quizReducer(quiz: Quiz, action: QuizAction) {
  switch (action.type) {
    case QuizActionType.MAKE_QUIZ:
      return { ...quiz, ...buildQuiz(action.payload) };
    case QuizActionType.ANSWER_QUESTION:
      return {
        ...quiz,
        ...answerQuestion(quiz, action.payload.questionIdx, action.payload.userAnswer),
      };
    case QuizActionType.ADD_ANALYSIS:
      return {
        ...quiz,
        ...addAnalysis(quiz, action.payload.question, action.payload.questionAnalysis),
      };
    default:
      return quiz;
  }
}

import { QuizAction, QuizActionType } from '@/store/QuizContextProvider';
import { Question, Quiz } from '@/types/quiz';
import { StitchedResponse } from '@/types/response';

function buildQuiz(stitchedRes: StitchedResponse) {
  const quiz: Quiz = {
    questions: [],
    attributes: {
      profession: stitchedRes.profession,
    },
  };

  stitchedRes.response.quizTopics.forEach((quizTopic) => {
    quizTopic.questions.forEach((question) => {
      const newQ: Question = { question, attributes: { topic: quizTopic.topic } };
      quiz.questions.push(newQ);
    });
  });

  // eslint-disable-next-line no-console
  console.log(`BUILT QUIZ: ${quiz}`);

  return quiz;
}

export default function quizReducer(quiz: Quiz, action: QuizAction) {
  switch (action.type) {
    case QuizActionType.MAKE_QUIZ:
      return buildQuiz(action.payload);
    default:
      return quiz;
  }
}

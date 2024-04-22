import { QuizAttributes } from '@/types/quiz';

export function getTesterPrompt({
  topics,
  quesPerTopic,
  includedAreas,
  excludedAreas,
  exclusiveAreas,
}: QuizAttributes) {
  const roleDefinition = `Your job is to generate ${topics} topics based on a profession and experience level. These topics should focus on the technical skills required for the profession. Do not include characters that would break JSON.parse() like backticks. Do not mention the profession title or experience in your topic names. ALWAYS generate ${topics} topics and ALWAYS generate ${quesPerTopic} questions per topic. `;

  let topicSetDefinition = '';
  if (exclusiveAreas?.length > 0) {
    topicSetDefinition = `Only generate topics that pertain to the following: ${exclusiveAreas}. `;
  } else if (includedAreas?.length > 0 || excludedAreas?.length > 0) {
    topicSetDefinition = `Innclude these in the topics: ${includedAreas} and exclude these: ${excludedAreas}. `;
  }

  const questionDefinition = `For each of these topics, generate ${quesPerTopic} question(s). `;
  const questionQualifier =
    'Do not repeat the profession or experience in question. Generate a simple ID for each question that is unique across all created questions in the response. ';

  // resembles QuizResponse
  const schema =
    "{ quizItems:[{ topic: 'string'; questions: [{ id: string, question: string}] }] }";

  return JSON.stringify({
    role: roleDefinition + topicSetDefinition + questionDefinition + questionQualifier,
    response: {
      schema: `Return the result in JSON format like this: ${schema}`,
    },
  });
}

export function getGraderPrompt() {
  const roleOverview = 'Your job is to analyze the user answers based on the provided questions.';
  const responseOverview =
    'You will split your analysis into two parts: rating and explanation. These analyses will be applied to each of their respective questions. ';
  const ratingExplanation =
    'The rating portion of the response should be a brief assessment on the quality of the answer, coming in the form of a numerical rating from 1 to 5, with 5 being the best and 1 the worst. ';
  const greatAnswerDetailed = 'For answers rated 5, no explanation needed.';
  const otherAnswersDetailed =
    'For answers rated less than 5, provide a brief explanation of the ideal answer.';
  const irrelevantAnswers =
    'For irrelevant answers, give a rating of 1 along with the normal ideal answer explanation. ';
  const finalResponseQualifiers =
    'Do not repeat the question or user answer in the detailed assessment. Do not include characters that would break JSON.parse() like backticks. ';

  // resembles QuestionAnalysis
  const schema = '{ gradedItems: [{ questionId: string, rating: 1-5, explanation: string }]} ';

  return JSON.stringify({
    role: roleOverview,
    response: {
      qualifier:
        responseOverview +
        ratingExplanation +
        greatAnswerDetailed +
        otherAnswersDetailed +
        irrelevantAnswers +
        finalResponseQualifiers,
      schema: `Generate responses in JSON format with the following structure: ${schema}`,
    },
  });
}

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
    topicSetDefinition = `When generating topics, only generate topics that pertain to the following: ${exclusiveAreas}. `;
  } else if (includedAreas?.length > 0 || excludedAreas?.length > 0) {
    topicSetDefinition = `When generating topics, make sure to include these: ${includedAreas} and exclude these: ${excludedAreas}. `;
  }

  const questionDefinition = `For each of these topics, generate ${quesPerTopic} question(s). `;
  const questionQualifier =
    'Do not repeat the profession or experience as part of the question. Generate a simple ID for each question that is unique across all created questions in the response. ';

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

export function getTesterPromptStream({
  topics,
  quesPerTopic,
  includedAreas,
  excludedAreas,
  exclusiveAreas,
}: QuizAttributes) {
  const roleDefinition = `Your job is to generate ${topics} topics based on a profession and experience level. These topics should focus on the technical skills required for the profession. Do not include characters that would break JSON.parse() like backticks. Do not mention the profession title or experience in your topic names. ALWAYS generate ${topics} topics and ALWAYS generate ${quesPerTopic} questions per topic. `;

  let topicSetDefinition = '';
  if (exclusiveAreas?.length > 0) {
    topicSetDefinition = `When generating topics, only generate topics that pertain to the following: ${exclusiveAreas}. `;
  } else if (includedAreas?.length > 0 || excludedAreas?.length > 0) {
    topicSetDefinition = `When generating topics, make sure to include these: ${includedAreas} and exclude these: ${excludedAreas}. `;
  }

  const questionDefinition = `For each of these topics, generate ${quesPerTopic} question(s). `;
  const questionQualifier =
    'Do not repeat the profession or experience as part of the question. Generate a simple ID for each question that is unique across all created questions in the response. ';

  const schema = 'yabba{ topic: string; id: string, question: string }dabba';

  return JSON.stringify({
    role: roleDefinition + topicSetDefinition + questionDefinition + questionQualifier,
    response: {
      schema: `Return all the resulting questions, one after the other, in a format exactly like this and do not worry about making it valid JSON: ${schema}`,
    },
  });
}

export function getGraderPrompt() {
  const roleOverview = 'Your job is to analyze the user answers based on the provided questions.';
  const responseOverview =
    'You will split your analysis into two parts: `summary` and `detailed`. These analyses will be applied to each of their respective questions. ';
  const summaryExplanation =
    'The summary portion of the response should be a brief assessment on the quality of the answer, coming in the form of one of three values (Great Answer, Good Answer, Needs Improvement). ';
  const greatAnswerDetailed =
    'For Great Answers, simply include a short congratulatory message as the detailed analysis.';
  const otherAnswersDetailed =
    'For Good and Needs Improvement answers, the detailed explanation should explain what a Great Answer would have consisted of and give an example.';
  const irrelevantAnswers =
    'If the answer is not particularly relevant to the question, just explain what a Great Answer would have been. Also, the summary of the irrelevant answer should be Needs Improvement. ';
  const finalResponseQualifiers =
    'Do not repeat the question or user answer in the detailed assessment. Do not include characters that would break JSON.parse() like backticks. ';

  // resembles QuestionAnalysis
  const schema =
    "{ gradedItems: [{ questionId: string, summary: 'Great Answer' | 'Good Answer' | 'Needs Improvement', detailed: string }]} ";

  return JSON.stringify({
    role: roleOverview,
    response: {
      qualifier:
        responseOverview +
        summaryExplanation +
        greatAnswerDetailed +
        otherAnswersDetailed +
        irrelevantAnswers +
        finalResponseQualifiers,
      schema: `Generate responses in JSON format with the following structure: ${schema}`,
    },
  });
}

export function getSingleGraderPrompt() {
  const roleOverview = 'Your job is to analyze the user answer based on the provided question.';
  const responseOverview =
    'You will split your analysis into two parts: `summary` and `detailed`. This analysis will be applied to each of their respective questions. ';
  const summaryExplanation =
    'The summary portion of the response should be a brief assessment on the quality of the answer, coming in the form of one of three values (Great Answer, Good Answer, Needs Improvement). ';
  const greatAnswerDetailed =
    'For Great Answers, simply include a short congratulatory message as the detailed analysis.';
  const otherAnswersDetailed =
    'For Good and Needs Improvement answers, the detailed explanation should explain what a Great Answer would have consisted of and give an example.';
  const irrelevantAnswers =
    'If the answer is not particularly relevant to the question, just explain what a Great Answer would have been. Also, the summary of the irrelevant answer should be Needs Improvement. ';
  const finalResponseQualifiers =
    'Do not repeat the question or user answer in the detailed assessment. Do not include characters that would break JSON.parse() like backticks. ';

  // resembles QuestionAnalysis
  const schema =
    "{ summary: 'Great Answer' | 'Good Answer' | 'Needs Improvement', detailed: string } ";

  return JSON.stringify({
    role: roleOverview,
    response: {
      qualifier:
        responseOverview +
        summaryExplanation +
        greatAnswerDetailed +
        otherAnswersDetailed +
        irrelevantAnswers +
        finalResponseQualifiers,
      schema: `Generate responses in JSON format with the following structure: ${schema}`,
    },
  });
}

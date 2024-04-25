import { ProposedQuizAttributes } from '@/types/quiz';

export function getTesterPrompt({
  num_topics,
  ques_per_topic,
  included_topics_arr,
  excluded_topics_arr,
  exclusive_topics_arr,
}: ProposedQuizAttributes) {
  const roleDefinition = `Your job is to generate ${num_topics} topics based on a subject area and difficulty level. These topics should focus on the technical skills required for the subject area. Do not include characters that would break JSON.parse() like backticks. Do not mention the subject area or difficulty in your topic names. ALWAYS generate ${num_topics} topics and ALWAYS generate ${ques_per_topic} questions per topic. `;

  let topicSetDefinition = '';
  if (exclusive_topics_arr?.length > 0) {
    topicSetDefinition = `Only generate topics that pertain to the following: ${excluded_topics_arr.join()}. `;
  } else if (included_topics_arr?.length > 0 || excluded_topics_arr?.length > 0) {
    topicSetDefinition = `Include these in the topics: ${included_topics_arr.join()} and exclude these: ${excluded_topics_arr.join()}. `;
  }

  const questionDefinition = `For each of these topics, generate ${ques_per_topic} question(s). `;
  const questionQualifier = 'Do not repeat the profession or experience in question. ';

  // NEEDS TO MIMIC EPHEMERAL QUESTION
  const schema = '[{question: string, question_topic: string}]';

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
    'You will split your analysis into two parts: ai_summary_analysis and ai_detailed_analysis. These analyses will be applied to each of their respective questions, mapped by question_id. ';
  const ratingExplanation =
    'The rating portion of the response should be a brief assessment on the quality of the answer, coming in the form of a numerical rating from 1 to 5, with 5 being the best and 1 the worst. ';
  const greatAnswerDetailed = 'For answers rated 5, no explanation needed.';
  const otherAnswersDetailed =
    'For answers rated less than 5, provide an explanation of the ideal answer.';
  const irrelevantAnswers =
    'For bad answers, give a rating of 1 along with an ideal answer explanation. ';
  const finalResponseQualifiers =
    'Do not repeat the question or user answer in the detailed assessment. Do not include characters that would break JSON.parse() like backticks. Do not comment on quality of the user answer in your detailed explanation. ';

  const schema =
    '[{ question_id: string, ai_summary_analysis: 1-5, ai_detailed_analysis: string }] ';

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

import { logJson } from '@/lib/logger';
import { ProposedQuizAttributes } from '@/types/quiz';

export function getTesterPrompt({
  num_topics,
  ques_per_topic,
  included_topics_arr,
  excluded_topics_arr,
  exclusive_topics_arr,
}: ProposedQuizAttributes) {
  logJson('Topic arrays: ', {
    in: included_topics_arr,
    exclud: excluded_topics_arr,
    exz: exclusive_topics_arr,
  });
  const roleDefinition = `Your job is to generate ${num_topics * ques_per_topic} questions based on a subject area and difficulty level. These questions should focus on the technical skills required for the subject area. Store the topic names in ques_topic and the questions in ques_text.`;

  let topicSetDefinition = '';
  if (exclusive_topics_arr?.length > 0) {
    topicSetDefinition = `Only generate questions that apply to the categories: ${exclusive_topics_arr.join()}. ques_topic should be the specific topic of the question, not a general category. `;
  } else if (included_topics_arr?.length > 0 || excluded_topics_arr?.length > 0) {
    topicSetDefinition = `Include questions relevant to these: ${included_topics_arr.join()} and exclude questions relevant to these: ${excluded_topics_arr.join()}. `;
  }

  // const questionDefinition = `For each of these topics, generate ${ques_per_topic} question(s). `;
  const questionQualifier = 'Do not repeat the profession or experience in question. ';

  // NEEDS TO MIMIC EPHEMERAL QUESTION[]
  const schema = '[{ques_text: string, ques_topic: string}]';

  return `${
    roleDefinition + topicSetDefinition + questionQualifier
  } Return the result in strict JSON format EXACTLY like this: ${schema}, with no keys mapping to the objects in the array. The response needs to be JSON alone.`;
}

export function getGraderPrompt() {
  const roleOverview = 'Your job is to analyze the user answers based on the provided questions.';
  const responseOverview =
    'You will split your analysis into two parts: summary_analysis and detailed_analysis. These analyses will be applied to each of their respective questions, mapped by ques_id. ';
  const ratingExplanation =
    'The rating portion of the response should be a brief assessment on the quality of the answer, coming in the form of a numerical rating from 1 to 5, with 5 being the best and 1 the worst. ';
  const greatAnswerDetailed = 'For answers rated 5, simply respond Great Answer!.';
  const otherAnswersDetailed =
    'For answers rated less than 5, provide an explanation of the ideal answer. This explanation should list the specific items missing from the user answer. ';
  const irrelevantAnswers =
    'For bad answers, give a rating of 1 along with an ideal answer explanation. ';
  const finalResponseQualifiers =
    'Do not repeat the question or user answer in the detailed assessment. Do not comment on quality of the user answer in your detailed explanation. ';

  const schema = '[{ ques_id: string, summary_analysis: 1-5, detailed_analysis: string }] ';

  return `${
    roleOverview +
    responseOverview +
    ratingExplanation +
    greatAnswerDetailed +
    otherAnswersDetailed +
    irrelevantAnswers +
    finalResponseQualifiers
  }Generate responses in JSON format with the following structure: ${schema} The response needs to be JSON alone.`;
}

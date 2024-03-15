'use server';

/* eslint-disable no-console */

import OpenAI from 'openai';
import promptConfig from '@/config/promptConfig.json';
import { Profession } from '@/types/profession';
import { Nullable } from '@/types/nullability';
import { QuestionRequest, QuizResponse } from '@/types/response';
import { QuestionAnalysis } from '@/types/quiz';

const { tester, grader } = promptConfig.system;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getTesterSystemPrompt() {
  return tester.role + tester.response.schema;
}

export async function fetchQuizResponse(profession: Profession) {
  // TODO gonna try this with focusAreas provided regardless
  const userPrompt = JSON.stringify(profession);
  let responseContent: Nullable<string>;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: getTesterSystemPrompt() },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'gpt-3.5-turbo',
    });
    console.log(`USER PROMPT: ${userPrompt}`);

    responseContent = response?.choices[0].message.content;
    if (!responseContent) {
      throw Error('Response content was null');
    }
  } catch (e) {
    console.log('Failed to fetch questions: ', e);
    throw e;
  }
  // TODO need schema validation ??
  return JSON.parse(responseContent) as QuizResponse;
}

function getGraderSystemPrompt() {
  const prompt = grader.role + grader.response.qualifier + grader.response.schema;

  console.log(`Grader prompt: ${prompt}`);

  return prompt;
}

export async function checkAnswer(quesReq: QuestionRequest) {
  let responseContent: Nullable<string>;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: getGraderSystemPrompt() },
        {
          role: 'user',
          content: JSON.stringify(quesReq),
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    responseContent = response.choices[0].message.content;

    if (!responseContent) {
      throw Error('Response content was null');
    }
  } catch (e) {
    console.log('Failed to fetch questions: ', e);
    throw e;
  }
  // TODO need schema validation ??
  console.log(`Content: ${responseContent}`);
  return JSON.parse(responseContent) as QuestionAnalysis;
}

// function getTeacherSystemPrompt() {
//   // const prompt =
//   //   'Only respond to user prompts and keep responses short unless asked for explanation. Your job is to ask 3 questions per request that cover interview material for a given profession ' +
//   //   'based on question difficulty, topic, and potential focus areas. You will also generate a summary label that covers the subject matter of the questions being asked, which will be used prevent repeated questions going forward.' +
//   //   'Your JSON response should resemble this structure: { questions: string[], summaryLabel: string, difficulty: string, profession: string }';

//   const interactionPrompt = teacher.role;
//   const overallPrompt = interactionPrompt + teacher.response.schema;

//   console.log(`Teacher prompt: ${overallPrompt}`);

//   return overallPrompt;
// }

// export async function explainMore(answer: AnswerContext) {
//   const response = await openai.chat.completions.create({
//     messages: [
//       { role: 'system', content: getTeacherSystemPrompt() },
//       {
//         role: 'user',
//         content: `Explain more regarding this: ${JSON.stringify(answer)}`,
//       },
//     ],
//     model: 'gpt-3.5-turbo',
//   });

//   return response.choices[0].message.content;
// }

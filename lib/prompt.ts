/* eslint-disable no-restricted-syntax */
'use server';

/* eslint-disable no-console */

import OpenAI from 'openai';
import {
  getTesterPrompt,
  getGraderPrompt,
  getSingleGraderPrompt,
  getTesterPromptStream,
} from '@/config/promptConfig';
import { QuizResponse } from '@/types/createQuiz';
import { QuizAttributes, SimpleQuestion } from '@/types/quiz';
import { GradedQuiz } from '@/types/gradeQuiz';
import { RetryAnalysis } from '@/types/questionRetry';
import { log } from './logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AI_MODEL = 'gpt-3.5-turbo';

export async function fetchQuiz(quizAttr: QuizAttributes) {
  const userPrompt = JSON.stringify(quizAttr.profession);
  const testerPrompt = getTesterPrompt(quizAttr);
  console.log(`TESTER: ${JSON.stringify(testerPrompt, null, 2)}`);

  let responseContent;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: testerPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: AI_MODEL,
    });
    console.log(`USER PROMPT: ${JSON.stringify(userPrompt, null, 2)}`);

    responseContent = response?.choices[0].message.content;
    console.log(`RESPONSE: ${responseContent}`);

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

export async function gradeQuiz(finalAnswers: SimpleQuestion[]) {
  let responseContent;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: getGraderPrompt() },
        {
          role: 'user',
          content: JSON.stringify(finalAnswers),
        },
      ],
      model: AI_MODEL,
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
  return JSON.parse(responseContent) as GradedQuiz;
}

export async function checkSingleAnswer(ques: SimpleQuestion) {
  let responseContent;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: getSingleGraderPrompt() },
        {
          role: 'user',
          content: JSON.stringify(ques),
        },
      ],
      model: AI_MODEL,
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
  return JSON.parse(responseContent) as RetryAnalysis;
}

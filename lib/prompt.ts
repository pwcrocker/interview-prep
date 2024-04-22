'use server';

/* eslint-disable no-restricted-syntax */

import OpenAI from 'openai';
import { getTesterPrompt, getGraderPrompt } from '@/config/promptConfig';
import { QuizResponse } from '@/types/createQuiz';
import { QuizAttributes, SimpleQuestion } from '@/types/quiz';
import { GradedQuiz } from '@/types/gradeQuiz';
import { log, logErr, logJson } from './logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AI_MODEL = 'gpt-3.5-turbo';

export async function fetchQuiz(quizAttr: QuizAttributes) {
  const userPrompt = JSON.stringify(quizAttr.profession);
  const testerPrompt = getTesterPrompt(quizAttr);

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
    logJson('Tester system prompt: ', testerPrompt);
    logJson('Tester user prompt: ', userPrompt);

    log('Token Report');
    log(`Prompt tokens: ${response?.usage?.prompt_tokens}`);
    log(`Completion tokens: ${response?.usage?.completion_tokens}`);
    log(`Total tokens: ${response?.usage?.total_tokens}`);

    responseContent = response?.choices[0].message.content;

    if (!responseContent) {
      throw Error('Response content was null');
    }
  } catch (e) {
    logErr('Failed to fetch questions: ', e);
    throw e;
  }
  // TODO need schema validation ??
  return JSON.parse(responseContent) as QuizResponse;
}

export async function gradeQuiz(finalAnswers: SimpleQuestion[]) {
  let responseContent;
  const graderPrompt = getGraderPrompt();
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: graderPrompt },
        {
          role: 'user',
          content: JSON.stringify(finalAnswers),
        },
      ],
      model: AI_MODEL,
    });
    logJson('Grader system prompt: ', graderPrompt);
    logJson('Grader user prompt: ', finalAnswers);

    log('Token Report');
    log(`Prompt tokens: ${response?.usage?.prompt_tokens}`);
    log(`Completion tokens: ${response?.usage?.completion_tokens}`);
    log(`Total tokens: ${response?.usage?.total_tokens}`);

    responseContent = response.choices[0].message.content;

    if (!responseContent) {
      throw Error('Response content was null');
    }
  } catch (e) {
    logErr('Failed to fetch questions: ', e);
    throw e;
  }
  // TODO need schema validation ??
  return JSON.parse(responseContent) as GradedQuiz;
}

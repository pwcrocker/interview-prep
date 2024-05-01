'use server';

/* eslint-disable no-restricted-syntax */

import { getSession } from '@auth0/nextjs-auth0';
import OpenAI from 'openai';
import { getTesterPrompt, getGraderPrompt } from '@/config/promptConfig';
import { ProposedQuizAttributes } from '@/types/quiz';
import { log, logErr, logJson, logWarn } from './logger';
import { findUserBySub, insertAnswers, insertQuiz, isQuizGraded } from './db';
import { EphemeralQuestion } from '@/types/question';
import {
  EphemeralAnalysisResponse,
  EphemeralGradedUserAnswer,
  EphemeralUserAnswer,
} from '@/types/answer';
import { ResponseParseError } from '@/errors/ResponseParseError';
import { ResponseFetchError } from '@/errors/ResponseFetchError';
import { ActionDisallowedError } from '@/errors/ActionDisallowedError';
import { EntityPersistError } from '@/errors/EntityPersistError';
import { UnknownUserError } from '@/errors/UnknownUserError';
import { AlreadyGradedError } from '@/errors/AlreadyGradedError';

const openai = new OpenAI({
  apiKey: process.env.PREP_OPENAI_API_KEY,
});

const AI_MODEL = 'gpt-3.5-turbo';

async function getUserSubFromSession() {
  const session = await getSession();
  if (!session || !session.user.sub) {
    logErr('Could not get session for user');
    throw new UnknownUserError('Could not get session for user');
  }
  log(`user sub: ${session.user.sub}`);
  return session.user.sub;
}

async function userAllowedToCreateQuiz(sub: string) {
  let result = null;
  try {
    result = await findUserBySub(sub, ['paid_tier']);
    // TODO prob check rate limit things here as well
  } catch (err) {
    logWarn('Failed to find user to check if allowed to create quiz');
    return null;
  }
  return result;
}

async function fetchAiResponse(systemPrompt: string, userPrompt: string) {
  return openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    model: AI_MODEL,
  });
}

async function fetchTesterResponse(proposedQuiz: ProposedQuizAttributes) {
  const { subject_area, difficulty } = proposedQuiz;
  const userPrompt = JSON.stringify({ subject_area, difficulty });
  const testerPrompt = getTesterPrompt(proposedQuiz);
  logJson('Tester system prompt: ', testerPrompt);
  logJson('Tester user prompt: ', userPrompt);

  return fetchAiResponse(testerPrompt, userPrompt);
}

async function fetchGraderResponse(answers: EphemeralUserAnswer[]) {
  const graderPrompt = getGraderPrompt();
  const answerSubmission = JSON.stringify(answers);
  logJson('Grader system prompt: ', graderPrompt);
  logJson('Grader user prompt: ', answerSubmission);

  return fetchAiResponse(graderPrompt, answerSubmission);
}

function parseResponseContent<T>(response: OpenAI.Chat.Completions.ChatCompletion) {
  const responseContent = response?.choices[0].message.content?.replace(/`/g, '');
  if (!responseContent) {
    logErr(`Failed to fetch quiz: ${responseContent}`);
    throw new ResponseFetchError('Failed to determine response content');
  }
  let parsedResult;
  try {
    parsedResult = JSON.parse(responseContent) as T;
  } catch (err) {
    logErr('Failed to parse generated questions: ', err);
    throw new ResponseParseError('Failed to parse questions');
  }
  return parsedResult;
}

function logAiTokenReport(responseUsage: any) {
  if (!responseUsage) {
    logErr('Bad AI token report');
    return;
  }
  // TODO valuable info that needs to be tracked
  const { prompt_tokens, completion_tokens, total_tokens } = responseUsage;
  log('---- AI Token Report ----');
  log(`Prompt tokens: ${prompt_tokens}`);
  log(`Completion tokens: ${completion_tokens}`);
  log(`Total tokens: ${total_tokens}`);
}

/**
 * Stitches analyses from AI into existing ephemeral answers based on ques_id
 * @param answers
 * @param parsedAnalyses
 * @param sub
 * @returns graded user answers that need to be persisted
 */
function stitchAnalysesIntoAnswers(
  answers: EphemeralUserAnswer[],
  parsedAnalyses: EphemeralAnalysisResponse[],
  sub: string
): EphemeralGradedUserAnswer[] {
  return Array.from(
    [...answers, ...parsedAnalyses]
      .reduce((map, current) => {
        map.set(current.ques_id, {
          ...map.get(current.ques_id),
          ...current,
          user_sub: sub,
        });
        return map;
      }, new Map())
      .values()
  );
}

export async function fetchQuiz(userSub: string, proposedQuiz: ProposedQuizAttributes) {
  logJson('Proposed quiz: ', proposedQuiz);
  const sub = await getUserSubFromSession();
  const isAllowed = await userAllowedToCreateQuiz(sub);
  if (!isAllowed) {
    logErr('User is not allowed to create quiz at this time');
    throw new ActionDisallowedError('User not allowed to create quiz');
  }

  let parsedQuesArr;
  try {
    const response = await fetchTesterResponse(proposedQuiz);
    logJson('response', response);
    parsedQuesArr = parseResponseContent<EphemeralQuestion[]>(response);
    logAiTokenReport(response?.usage);
  } catch (err) {
    logErr('Failed to fetch questions: ', err);
    throw new ResponseFetchError('Failed to fetch quiz');
  }

  let result;
  try {
    log(`user sub: ${userSub}`);
    result = await insertQuiz(userSub, proposedQuiz, parsedQuesArr);
  } catch (err) {
    logErr('Failed to save quiz to database', err);
    throw new EntityPersistError('Failed to save the quiz');
  }

  return result;
}

export async function gradeQuiz(quizId: string, answers: EphemeralUserAnswer[]) {
  let parsedAnalyses;
  try {
    const isGraded = await isQuizGraded(quizId);
    if (isGraded) {
      throw new AlreadyGradedError('Quiz is already graded');
    }
    const response = await fetchGraderResponse(answers);
    parsedAnalyses = parseResponseContent<EphemeralAnalysisResponse[]>(response);
    logAiTokenReport(response.usage);
  } catch (e) {
    logErr('Failed to grade quiz: ', e);
    throw new ResponseFetchError('Failed to grade quiz');
  }

  const sub = await getUserSubFromSession();
  // need to stitch analysis into proper answer by question_id
  const gradedAnswers = stitchAnalysesIntoAnswers(answers, parsedAnalyses, sub);
  logJson('Stitched/graded answers: ', gradedAnswers);
  let result;
  try {
    result = await insertAnswers(quizId, gradedAnswers);
  } catch (err) {
    logErr('Failed to save answers to database', err);
    throw new EntityPersistError('Failed to save answers');
  }

  return result;
}

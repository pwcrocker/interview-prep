'use server';

/* eslint-disable no-restricted-syntax */

import OpenAI from 'openai';
import { getTesterPrompt, getGraderPrompt } from '@/config/promptConfig';
import { AnsweredQuiz, EphemeralQuiz, ProposedQuizAttributes } from '@/types/quiz';
import { log, logErr, logJson, logWarn } from './logger';
import { checkUserTokens, spendTokensReturningUpdatedCount } from './tokens';
import { insertAnswers, insertQuiz } from './db';
import { EphemeralQuestion } from '@/types/question';
import {
  EphemeralAnalysisResponse,
  EphemeralGradedUserAnswer,
  PersistedUserAnswer,
} from '@/types/answer';

const openai = new OpenAI({
  apiKey: process.env.PREP_OPENAI_API_KEY,
});

const AI_MODEL = 'gpt-3.5-turbo';

const QUIZ_CREATE_COST = parseInt(process.env.PREP_QUIZ_COST!, 10);

export async function getQuizCost() {
  log(`${QUIZ_CREATE_COST}`);
  return QUIZ_CREATE_COST;
}

export async function hasEnoughTokens(userSub: string) {
  return checkUserTokens(userSub, QUIZ_CREATE_COST);
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

export async function fetchQuiz(userSub: string, proposedQuiz: ProposedQuizAttributes) {
  const enough = await hasEnoughTokens(userSub);
  if (!enough) {
    logWarn('User does not have enough tokens for request');
    return null;
  }
  const { subject_area, difficulty_modifier } = proposedQuiz;
  const userPrompt = JSON.stringify({ subject_area, difficulty_modifier });
  const testerPrompt = getTesterPrompt(proposedQuiz);

  let parsedQuesArr;
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

    const responseContent = response?.choices[0].message.content;
    if (!responseContent) {
      logErr(`Failed to retrieve response: ${responseContent}`);
      return null;
    }
    try {
      parsedQuesArr = JSON.parse(responseContent) as EphemeralQuestion[];
    } catch (err) {
      logErr('Failed to parse create quiz response: ', err);
      return null;
    }
    logAiTokenReport(response?.usage);
  } catch (e) {
    logErr('Failed to fetch questions: ', e);
    return null;
  }

  const quizToSave: EphemeralQuiz = {
    ...proposedQuiz,
    quiz_questions: parsedQuesArr,
  };
  const persistedQuiz = await insertQuiz(userSub, quizToSave);

  const updatedTokens = await spendTokensReturningUpdatedCount(userSub, QUIZ_CREATE_COST);
  const result = {
    tokens: updatedTokens,
    quiz: persistedQuiz,
  };
  return result;
}

export async function gradeQuiz(finalQuiz: AnsweredQuiz) {
  const graderPrompt = getGraderPrompt();
  const answerSubmission = JSON.stringify(
    finalQuiz.quiz_questions.map((ques) => ({
      question_id: ques.question_id,
      question: ques.question,
      user_answer: ques.question_answer.user_answer,
    }))
  );
  let parsedAnalysis: EphemeralAnalysisResponse[];
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: graderPrompt },
        {
          role: 'user',
          content: answerSubmission,
        },
      ],
      model: AI_MODEL,
    });
    logJson('Grader system prompt: ', graderPrompt);
    logJson('Grader user prompt: ', answerSubmission);

    log('---- AI Token Report ----');
    log(`Prompt tokens: ${response?.usage?.prompt_tokens}`);
    log(`Completion tokens: ${response?.usage?.completion_tokens}`);
    log(`Total tokens: ${response?.usage?.total_tokens}`);

    const responseContent = response?.choices[0].message.content;
    if (!responseContent) {
      logErr(`Failed to retrieve response: ${responseContent}`);
      return null;
    }
    try {
      parsedAnalysis = JSON.parse(responseContent);
    } catch (err) {
      logErr('Failed to parse grade response: ', err);
      return null;
    }
    logAiTokenReport(response?.usage);
  } catch (e) {
    logErr('Failed to grade quiz: ', e);
    throw e;
  }

  // need to stitch analysis into proper answer by question_id
  const curAnswerArr = finalQuiz.quiz_questions.map((qq) => qq.question_answer);

  logJson('current answers: ', curAnswerArr);
  logJson('parsedAnalysis: ', parsedAnalysis);

  const answeredQuestions: EphemeralGradedUserAnswer[] = Array.from(
    [
      ...finalQuiz.quiz_questions.map((qq) => ({
        ...qq.question_answer,
        question_id: qq.question_id,
      })),
      ...parsedAnalysis,
    ]
      .reduce((map, current) => {
        map.set(current.question_id, {
          ...map.get(current.question_id),
          ...current,
          user_sub: finalQuiz.user_sub,
        });
        return map;
      }, new Map())
      .values()
  );
  logJson('answered questions: ', answeredQuestions);
  // need to save answers to db
  const savedAnswers: PersistedUserAnswer[] = await insertAnswers(
    finalQuiz.quiz_id,
    answeredQuestions
  );
  // return what?

  return savedAnswers;
}

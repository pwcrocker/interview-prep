'use server';

import { logWarn } from './logger';
import { findUserBySub, updateUserTokensReturningTokens } from './db';

const TOKEN_INCREASE = 100;

export async function getTokensForUser(userSub: string) {
  const user = await findUserBySub(userSub);
  return user?.tokens;
}

export async function checkUserTokens(userSub: string, requestCost: number) {
  const curTokens = await getTokensForUser(userSub);
  return curTokens >= requestCost;
}

export async function buyTokens(userSub: string) {
  const updatedTokenCount = updateUserTokensReturningTokens(userSub, TOKEN_INCREASE);
  return updatedTokenCount;
}

export async function spendTokensReturningUpdatedCount(userSub: string, requestCost: number) {
  const curTokenCount = await getTokensForUser(userSub);

  if (curTokenCount < Math.abs(requestCost)) {
    logWarn('User does not have enough tokens to complete request');
    return curTokenCount;
  }

  const updatedTokenCount = updateUserTokensReturningTokens(userSub, requestCost * -1);
  return updatedTokenCount;
}

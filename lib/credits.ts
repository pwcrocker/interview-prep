'use server';

import { log } from 'console';
import sql from './db';
import { logJson } from './logger';

export async function getUser(id: string) {
  const userResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.MGMT_API_ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
    redirect: 'follow',
  });

  const userResult = await userResponse.json();
  return userResult;
}

const CREDIT_INCREASE = 100;

export async function buyCredits(userId: string) {
  // TODO
  // send stripe request here to create a payment intent?

  const userResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.MGMT_API_ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
    redirect: 'follow',
  });

  const userResult = await userResponse.json();
  logJson('schema: ', userResult);

  const payload = {
    app_metadata: {
      creditsRemaining: userResult.app_metadata.creditsRemaining + CREDIT_INCREASE,
    },
  };

  const headers = {
    Authorization: `Bearer ${process.env.MGMT_API_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const options = {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
  };

  const res = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}`, options);

  const result = await res.json();

  logJson('Found this: ', result);
}

export async function loseCredits(userId: string) {
  // TODO
  // send stripe request here to create a payment intent?

  const userResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.MGMT_API_ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
    redirect: 'follow',
  });

  const userResult = await userResponse.json();
  logJson('schema: ', userResult);

  const newCredits = userResult.app_metadata.creditsRemaining - CREDIT_INCREASE;

  const payload = {
    app_metadata: {
      creditsRemaining: newCredits < 0 ? 0 : newCredits,
    },
  };

  const headers = {
    Authorization: `Bearer ${process.env.MGMT_API_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const options = {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload),
  };

  const res = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}`, options);

  const result = await res.json();

  logJson('Found this: ', result);
}

export async function buyCreditsDb(userSub: string) {
  const user = await sql`SELECT * FROM _users WHERE sub = ${userSub}`;
  logJson('user ===> ', user);
  return user;
}

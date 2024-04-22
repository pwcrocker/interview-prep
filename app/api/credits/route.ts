import { log, logJson } from '@/lib/logger';

const CREDIT_INCREASE = 100;

export async function POST(req: Request) {
  const data = await req.json();

  if (!data.id || !data.credits) {
    return new Response('Bad request', {
      status: 400,
    });
  }

  log(`id: ${data.id}`);

  const userResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${data.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.MGMT_API_ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
    redirect: 'follow',
  });

  const userResult = await userResponse.json();

  const payload = {
    app_metadata: {
      creditsRemaining: data.credits + CREDIT_INCREASE,
      credits_remaining: null,
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

  const res = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${data.id}`, options);

  const result = await res.json();

  // log(`Found this: ${result}`);
  logJson('Found this: ', result);

  return new Response(result);
}

import { Session, handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
import { findUserBySub, insertUser } from '@/lib/db';
import { log } from '@/lib/logger';

// default setup
// export const GET = handleAuth();

const afterCallback = async (req: NextRequest, session: Session) => {
  const user = await findUserBySub(session?.user.sub);
  if (!user) {
    log('Registration flow -- creating user');
    await insertUser(session.user.sub, session.user.email);
  } else {
    log('Login flow -- not creating user');
  }
  return session;
};

export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
});

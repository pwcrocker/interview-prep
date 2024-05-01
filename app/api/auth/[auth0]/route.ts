import { Session, handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
import { findUserBySub, insertUser } from '@/lib/db';
import { log } from '@/lib/logger';

// default setup
// export const GET = handleAuth();

const afterCallback = async (req: NextRequest, session: Session) => {
  try {
    await findUserBySub(session?.user.sub);
    log('Login flow -- not creating user');
  } catch (err) {
    // if can't find user, create
    log('Registration flow -- creating user');
    await insertUser(session.user.sub, session.user.email);
  }
  return session;
};

export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
});

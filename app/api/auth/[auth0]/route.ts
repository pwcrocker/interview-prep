import { AppRouteHandlerFnContext, Session, handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
import { logJson } from '@/lib/logger';
import { findUserBySub, insertUser } from '@/lib/db';

// export const GET = handleAuth();

const afterCallback = async (req: NextRequest, session: Session) => {
  const user = await findUserBySub(session?.user.sub);
  if (!user) {
    await insertUser(session.user.sub, session.user.email);
  }
  return session;
};

export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
});

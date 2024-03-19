import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: ['/setup/:path*', '/prep/:path*', '/user/:path*'],
  // turn off middleware to allow LAN
  // matcher: [],
};

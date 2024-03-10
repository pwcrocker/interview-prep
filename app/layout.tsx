import '@mantine/core/styles.css';
import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';
import QuizContextProvider from '@/store/QuizContextProvider';
import AppWrapper from '@/components/Layout/AppWrapper';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <UserProvider>
        <body>
          <MantineProvider theme={theme}>
            <AppWrapper>
              <QuizContextProvider>{children}</QuizContextProvider>
            </AppWrapper>
          </MantineProvider>
        </body>
      </UserProvider>
    </html>
  );
}

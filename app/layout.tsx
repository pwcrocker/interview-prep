import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';
import QuizContextProvider from '@/store/QuizContextProvider';
import Navbar from '@/components/Layout/Navbar';
import { UserProvider } from '@auth0/nextjs-auth0/client';

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
                        <Navbar>
                            <QuizContextProvider>{children}</QuizContextProvider>
                        </Navbar>
                    </MantineProvider>
                </body>
            </UserProvider>
        </html>
    );
}

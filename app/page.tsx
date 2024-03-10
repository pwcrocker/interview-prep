'use client';

import { useContext } from 'react';
import { Button, Center } from '@mantine/core';
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { QuizContext } from '@/store/QuizContextProvider';
import Quiz from '@/components/Quiz/Quiz';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function HomePage() {
    const { quiz } = useContext(QuizContext);
    const { user } = useUser();

    return (
        <>
            {quiz.questions?.length ? (
                <Quiz />
            ) : (
                <>
                    <Welcome />
                    <ColorSchemeToggle />
                    {
                        !user && <Center mih="10rem" mt="5rem">
                            <Button
                                component="a"
                                href="/api/auth/login"
                                variant="outline"
                                color="lime"
                                size="md"
                                radius="xl"
                            >
                                Get Started
                            </Button>
                        </Center>
                    }
                </>
            )}
        </>
    );
}

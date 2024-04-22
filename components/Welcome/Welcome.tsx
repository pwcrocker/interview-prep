'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Title, Text, Code } from '@mantine/core';
import classes from './Welcome.module.css';
import { getUser } from '@/lib/credits';

export function Welcome() {
  const { user, isLoading } = useUser();
  const [userRes, setUserRes] = useState();

  useEffect(() => {
    const ugh = async () => {
      if (user?.sub) {
        const result = await getUser(user?.sub);
        setUserRes(result);
      }
    };
    if (!isLoading) {
      ugh();
    }
  }, [isLoading]);

  return (
    <>
      {!isLoading && <Code block>{JSON.stringify(user, null, 2)}</Code>}
      {!isLoading && userRes && <Code block>{JSON.stringify(userRes, null, 2)}</Code>}
      <Title className={classes.title} ta="center" mt={100}>
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: 'burntorange.0', to: 'yellow' }}
        >
          prepforwork.ai
        </Text>
      </Title>
    </>
  );
}

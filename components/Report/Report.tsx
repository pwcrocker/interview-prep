'use client';

import { Button, Center, Container, Grid, Text } from '@mantine/core';
import { Fragment, useContext, useState } from 'react';
import { QuizContext } from '@/store/QuizContextProvider';

export default function Report() {
  const { quiz } = useContext(QuizContext);
  const [openIdx, setOpenIdx] = useState(-1);

  function handleClick(questionIdx: number) {
    if (questionIdx === openIdx) {
      setOpenIdx(-1);
    } else {
      setOpenIdx(questionIdx);
    }
  }

  return (
    <Container size="md" mt="xl" bg="rgba(0, 0, 0, .3)">
      <Grid>
        <Grid.Col span={6}>
          <Text fw={700}>Question</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text fw={700}>Result</Text>
        </Grid.Col>
        {quiz.questions.map((curQues, idx) => (
          <Fragment key={`${idx}row`}>
            <Grid.Col key={`${idx}ques`} span={6}>
              {curQues.question}
            </Grid.Col>
            <Grid.Col key={`${idx}summary`} span={3}>
              {curQues.analysis?.summary}
            </Grid.Col>
            {curQues.analysis?.summary.toLocaleLowerCase() !== 'correct' && (
              <>
                <Button onClick={() => handleClick(idx)}>Explain</Button>
                {openIdx === idx && (
                  <Fragment key={`${idx}explainrow`}>
                    <Center bg="rgba(100, 100, 100, .3)" p="2rem" mb="1rem">
                      {curQues.analysis?.detailed}
                    </Center>
                  </Fragment>
                )}
              </>
            )}
          </Fragment>
        ))}
      </Grid>
    </Container>
  );
}

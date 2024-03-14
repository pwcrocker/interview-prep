'use client';

import { ActionIcon, Center, Container, Grid, Popover, Text } from '@mantine/core';
import { IconQuestionMark } from '@tabler/icons-react';
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
    <Container size="md" bg="rgba(0, 0, 0, .3)">
      <Grid gutter="xs">
        <Grid.Col span={6}>
          <Text fw={700}>Question</Text>
        </Grid.Col>
        <Grid.Col span={3} ta="center">
          <Text fw={700}>Result</Text>
        </Grid.Col>
        <Grid.Col span={3} ta="center">
          <Text fw={700}>Actions</Text>
        </Grid.Col>
        {quiz.questions.map((curQues, idx) => (
          <Fragment key={`${idx}row`}>
            <Grid.Col key={`${idx}ques`} span={6}>
              {curQues.question}
            </Grid.Col>
            <Grid.Col key={`${idx}summary`} span={3} ta="center">
              {curQues.analysis?.summary}
            </Grid.Col>
            <Grid.Col ta="center" span={3}>
              {curQues.analysis?.detailed && (
                <Popover width="80%" position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <ActionIcon variant="default" size="lg" onClick={() => handleClick(idx)}>
                      <IconQuestionMark />
                    </ActionIcon>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Center bg="rgba(100, 100, 100, .3)" p="2rem" mb="1rem">
                      {curQues.analysis?.detailed}
                    </Center>
                  </Popover.Dropdown>
                </Popover>
              )}
            </Grid.Col>
          </Fragment>
        ))}
      </Grid>
    </Container>
  );
}

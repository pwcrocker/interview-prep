'use client';

import { useContext, useState } from 'react';
import { Accordion, ActionIcon, Group, Stack, Text } from '@mantine/core';
import { IconRefreshAlert } from '@tabler/icons-react';
import { Question } from '@/types/quiz';
import { checkAnswer } from '@/lib/prompt';
import { QuestionRequest } from '@/types/response';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';

interface AccordionItemProps {
  idx: number;
  question: Question;
}

interface AccordionLabelProps {
  topic: string;
  question: string;
  summary: string | undefined;
}

function AccordionLabel({ topic, question, summary }: AccordionLabelProps) {
  return (
    <Group wrap="nowrap">
      <div>
        <Text size="md" td="underline" mb="1rem">
          {topic}
        </Text>
        <Text fs="italic">{question}</Text>
        {summary && (
          <Text size="md" fw={700} mt="1rem">
            {summary}
          </Text>
        )}
      </div>
    </Group>
  );
}

function AccordionControl({ question }: { question: Question }) {
  return (
    <Accordion.Control>
      <AccordionLabel
        topic={question.attributes.topic}
        question={question.question}
        summary={question.analysis?.summary}
      />
    </Accordion.Control>
  );
}

function AccordionPanel({ question }: { question: Question }) {
  return (
    <Accordion.Panel>
      <Stack mt="1rem">
        <Text size="sm" td="underline" fw={700}>
          User answer:
        </Text>
        <Text size="sm">{question.userAnswer}</Text>
        {question.analysis?.detailed && (
          <>
            <Text size="sm" td="underline" fw={700}>
              Analysis:
            </Text>
            <Text size="sm">{question.analysis?.detailed}</Text>
          </>
        )}
      </Stack>
    </Accordion.Panel>
  );
}

export default function AccordionItem({ idx, question }: AccordionItemProps) {
  const { dispatch } = useContext(QuizContext);
  const [refetching, setRefetching] = useState(false);

  async function handleResubmitAnswer(quesReq: QuestionRequest) {
    setRefetching(true);
    const anaylsis = await checkAnswer(quesReq);
    dispatch({
      type: QuizActionType.ADD_ANALYSIS,
      payload: { question: quesReq.question, questionAnalysis: anaylsis },
    });
    setRefetching(false);
  }

  return (
    <Accordion.Item value={`${idx}ques`} key={question.question}>
      <AccordionControl question={question} />
      {question.analysis?.summary.toLowerCase() === 'failed' && (
        <ActionIcon
          onClick={() => {
            handleResubmitAnswer({
              question: question.question,
              userAnswer: question.userAnswer || '',
            });
          }}
          size="lg"
          variant="subtle"
          color="gray"
          loading={refetching}
          disabled={refetching}
        >
          <IconRefreshAlert />
        </ActionIcon>
      )}
      <AccordionPanel question={question} />
    </Accordion.Item>
  );
}

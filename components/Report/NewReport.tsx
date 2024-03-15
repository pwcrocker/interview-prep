'use client';

import { useContext } from 'react';
import { Accordion, ActionIcon, Group, Stack, Text } from '@mantine/core';
import { IconRefreshAlert } from '@tabler/icons-react';
import { QuizContext } from '@/store/QuizContextProvider';

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

export default function NewReport() {
  const { quiz } = useContext(QuizContext);

  const items = quiz.questions.map((question, idx) => (
    <Accordion.Item value={`${idx}ques`} key={question.question}>
      <Accordion.Control>
        <AccordionLabel
          topic={question.attributes.topic}
          question={question.question}
          summary={question.analysis?.summary}
        />
      </Accordion.Control>
      {question.analysis?.summary.toLowerCase() === 'failed' && (
        <ActionIcon size="lg" variant="subtle" color="gray">
          <IconRefreshAlert />
        </ActionIcon>
      )}
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
    </Accordion.Item>
  ));

  return (
    <Accordion chevronPosition="right" variant="contained">
      {items}
    </Accordion>
  );
}

import { Accordion, Group, Stack, Text } from '@mantine/core';
import { Question } from '@/types/quiz';
import SummaryLabel from './SummaryLabel';

interface QuestionLabelProps {
  topic: string;
  question: string;
  summary: string | undefined;
}

function QuestionLabel({ topic, question, summary }: QuestionLabelProps) {
  return (
    <Group wrap="nowrap">
      <div>
        <Text size="md" td="underline" mb="1rem">
          {topic}
        </Text>
        <Text fs="italic">{question}</Text>
        {summary && <SummaryLabel summary={summary} />}
      </div>
    </Group>
  );
}

function QuestionControl({ question }: { question: Question }) {
  return (
    <Accordion.Control>
      <QuestionLabel
        topic={question.attributes.topic}
        question={question.question}
        summary={question.analysis?.summary}
      />
    </Accordion.Control>
  );
}

function QuestionPanel({ question }: { question: Question }) {
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

interface ReportItemProps {
  idx: number;
  question: Question;
}

export default function ReportItem({ idx, question }: ReportItemProps) {
  return (
    <Accordion.Item value={`${idx}ques`} key={question.question}>
      <QuestionControl question={question} />
      <QuestionPanel question={question} />
    </Accordion.Item>
  );
}

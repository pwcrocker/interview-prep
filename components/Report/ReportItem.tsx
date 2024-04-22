import { Accordion, Group, Stack, Text } from '@mantine/core';
import { Question } from '@/types/quiz';
import RatingLabel from './RatingLabel';

interface QuestionLabelProps {
  topic: string;
  question: string;
  rating: number;
}

function QuestionLabel({ topic, question, rating }: QuestionLabelProps) {
  return (
    <Group wrap="nowrap">
      <div>
        <Text size="md" td="underline" mb="1rem">
          {topic}
        </Text>
        <Text fs="italic">{question}</Text>
        {rating && <RatingLabel rating={rating} />}
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
        rating={question.analysis?.rating || 0}
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
        {question.analysis?.explanation && (
          <>
            <Text size="sm" td="underline" fw={700}>
              Analysis:
            </Text>
            <Text size="sm">{question.analysis?.explanation}</Text>
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

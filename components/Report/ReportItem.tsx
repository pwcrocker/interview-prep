import { Accordion, Group, Stack, Text } from '@mantine/core';
import RatingLabel from './RatingLabel';
import { StateQuestion } from '@/types/state';

interface QuestionLabelProps {
  label_key: string;
  ques_topic: string;
  ques_text: string;
  rating: number;
}

function QuestionLabel({ label_key, ques_topic, ques_text, rating }: QuestionLabelProps) {
  return (
    <Group key={`${label_key}queslabel`} wrap="nowrap">
      <div>
        <Text size="md" fs="italic" mb="1rem">
          {ques_topic}
        </Text>
        <Text fs="italic">{ques_text}</Text>
        {rating && <RatingLabel rating={rating} />}
      </div>
    </Group>
  );
}

function QuestionControl({ quiz_question }: { quiz_question: StateQuestion }) {
  return (
    <Accordion.Control key={`${quiz_question.ques_id}acccon`}>
      <QuestionLabel
        label_key={quiz_question.ques_id!}
        ques_topic={quiz_question?.ques_topic || 'Something went wrong...'}
        ques_text={quiz_question?.ques_text || 'Something went wrong...'}
        rating={quiz_question?.question_answer?.summary_analysis || 0}
      />
    </Accordion.Control>
  );
}

function QuestionPanel({ quiz_question }: { quiz_question: StateQuestion }) {
  return (
    <Accordion.Panel key={`${quiz_question.ques_id}accpan`}>
      <Stack mt="1rem">
        <Text size="sm" fs="italic" fw={700}>
          User answer:
        </Text>
        <Text size="sm">
          {quiz_question?.question_answer?.user_answer || 'Something went wrong'}
        </Text>
        {quiz_question?.question_answer?.detailed_analysis && (
          <>
            <Text size="sm" fs="italic" fw={700}>
              Analysis:
            </Text>
            <Text size="sm">
              {quiz_question?.question_answer?.detailed_analysis || 'Something went wrong'}
            </Text>
          </>
        )}
      </Stack>
    </Accordion.Panel>
  );
}

interface ReportItemProps {
  idx: number;
  quiz_question: StateQuestion;
}

export default function ReportItem({ idx, quiz_question }: ReportItemProps) {
  return (
    <Accordion.Item key={quiz_question.ques_id} value={`${idx}ques`}>
      <QuestionControl key={`${quiz_question.ques_id}ctrl`} quiz_question={quiz_question} />
      <QuestionPanel key={`${quiz_question.ques_id}panel`} quiz_question={quiz_question} />
    </Accordion.Item>
  );
}

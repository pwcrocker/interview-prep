import { Accordion, Group, Stack, Text } from '@mantine/core';
import RatingLabel from './RatingLabel';
import { FinalizedQuestion } from '@/types/question';

interface QuestionLabelProps {
  question_topic: string;
  question: string;
  rating: number;
}

function QuestionLabel({ question_topic, question, rating }: QuestionLabelProps) {
  return (
    <Group wrap="nowrap">
      <div>
        <Text size="md" td="underline" mb="1rem">
          {question_topic}
        </Text>
        <Text fs="italic">{question}</Text>
        {rating && <RatingLabel rating={rating} />}
      </div>
    </Group>
  );
}

function QuestionControl({ quiz_question }: { quiz_question: FinalizedQuestion }) {
  return (
    <Accordion.Control>
      <QuestionLabel
        question_topic={quiz_question.question_topic}
        question={quiz_question.question}
        rating={quiz_question.question_answer.ai_summary_analysis || 0}
      />
    </Accordion.Control>
  );
}

function QuestionPanel({ quiz_question }: { quiz_question: FinalizedQuestion }) {
  return (
    <Accordion.Panel>
      <Stack mt="1rem">
        <Text size="sm" td="underline" fw={700}>
          User answer:
        </Text>
        <Text size="sm">{quiz_question.question_answer.user_answer}</Text>
        {quiz_question.question_answer.ai_detailed_analysis && (
          <>
            <Text size="sm" td="underline" fw={700}>
              Analysis:
            </Text>
            <Text size="sm">{quiz_question.question_answer.ai_detailed_analysis}</Text>
          </>
        )}
      </Stack>
    </Accordion.Panel>
  );
}

interface ReportItemProps {
  idx: number;
  quiz_question: FinalizedQuestion;
}

export default function ReportItem({ idx, quiz_question }: ReportItemProps) {
  return (
    <Accordion.Item key={quiz_question.question_id} value={`${idx}ques`}>
      <QuestionControl quiz_question={quiz_question} />
      <QuestionPanel quiz_question={quiz_question} />
    </Accordion.Item>
  );
}

import { Text, Textarea } from '@mantine/core';

interface QuizQuestionProps {
  topic: string;
  question: string;
  answer: string;
  maxLen: number;
  handleChange: (value: string) => void;
}

export default function QuizQuestion({
  topic,
  question,
  answer,
  maxLen,
  handleChange,
}: QuizQuestionProps) {
  return (
    <>
      <Text fs="italic">{topic}</Text>
      <Text fw={700}>{question}</Text>
      <Textarea
        autosize
        minRows={4}
        maxLength={maxLen}
        description={`(${answer.length}/${maxLen} characters)`}
        value={answer}
        onChange={(e) => handleChange(e.currentTarget.value)}
      />
    </>
  );
}

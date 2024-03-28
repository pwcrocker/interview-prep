import type { Meta, StoryObj } from '@storybook/react';
import QuizQuestion from './QuizQuestion';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof QuizQuestion> = {
  component: QuizQuestion,
};

export default meta;
type Story = StoryObj<typeof QuizQuestion>;

export const ExistingAnswer: Story = {
  args: {
    topic: 'mock topic',
    question: 'mock question',
    answer: 'mock answer',
    maxLen: 500,
    handleChange: () => {},
  },
};

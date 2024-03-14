import type { Meta, StoryObj } from '@storybook/react';
import QuizHeader from './QuizHeader';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof QuizHeader> = {
  component: QuizHeader,
};

export default meta;
type Story = StoryObj<typeof QuizHeader>;

export const StartProgress: Story = {
  args: {
    job: 'mock job',
    experience: '5-7 years',
    totalQuestions: 10,
    curQuesIdx: 0,
  },
};

export const InProgress: Story = {
  args: {
    job: 'mock job',
    experience: '5-7 years',
    totalQuestions: 10,
    curQuesIdx: 6,
  },
};

export const EndProgress: Story = {
  args: {
    job: 'mock job',
    experience: '5-7 years',
    totalQuestions: 10,
    curQuesIdx: 10,
  },
};

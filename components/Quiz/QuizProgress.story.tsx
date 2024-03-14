import type { Meta, StoryObj } from '@storybook/react';
import QuizProgress from './QuizProgress';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof QuizProgress> = {
  component: QuizProgress,
};

export default meta;
type Story = StoryObj<typeof QuizProgress>;

export const FirstStory: Story = {
  args: {
    totalQuesNum: 100,
    curQuesNum: 37,
  },
};

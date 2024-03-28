import type { Meta, StoryObj } from '@storybook/react';
import FinalQuizSubmit from './FinalQuizSubmit';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof FinalQuizSubmit> = {
  component: FinalQuizSubmit,
};

export default meta;
type Story = StoryObj<typeof FinalQuizSubmit>;

export const SimpleStory: Story = {
  args: {
    handlePrev: () => {},
    handleSubmit: () => {},
  },
};

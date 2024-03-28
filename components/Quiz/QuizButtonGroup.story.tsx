import type { Meta, StoryObj } from '@storybook/react';
import QuizButtonGroup from './QuizButtonGroup';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof QuizButtonGroup> = {
  component: QuizButtonGroup,
};

export default meta;
type Story = StoryObj<typeof QuizButtonGroup>;

export const ShowPrevIsSubmittable: Story = {
  args: {
    showPrev: true,
    isSubmittable: true,
    handlePrev: () => {},
    handleNext: () => {},
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import LoadingText from './LoadingText';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof LoadingText> = {
  component: LoadingText,
};

export default meta;
type Story = StoryObj<typeof LoadingText>;

export const FirstStory: Story = {
  args: {
    label: 'Test',
  },
};

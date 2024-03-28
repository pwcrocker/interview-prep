import type { Meta, StoryObj } from '@storybook/react';
import Rating from './Rating';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Rating> = {
  component: Rating,
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Simple: Story = {
  args: {
    analysisSummary: 'Good Answer',
  },
};

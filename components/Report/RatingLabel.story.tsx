import type { Meta, StoryObj } from '@storybook/react';
import RatingLabel from './RatingLabel';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof RatingLabel> = {
  component: RatingLabel,
};

export default meta;
type Story = StoryObj<typeof RatingLabel>;

export const NeedsImprovement: Story = {
  args: {
    rating: 1,
  },
};

export const GoodAnswer: Story = {
  args: {
    rating: 3,
  },
};

export const GreatAnswer: Story = {
  args: {
    rating: 5,
  },
};

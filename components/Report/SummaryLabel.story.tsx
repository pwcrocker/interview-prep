import type { Meta, StoryObj } from '@storybook/react';
import SummaryLabel from './SummaryLabel';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof SummaryLabel> = {
  component: SummaryLabel,
};

export default meta;
type Story = StoryObj<typeof SummaryLabel>;

export const NeedsImprovement: Story = {
  args: {
    summary: 'Needs Improvement',
  },
};

export const GoodAnswer: Story = {
  args: {
    summary: 'Good Answer',
  },
};

export const GreatAnswer: Story = {
  args: {
    summary: 'Great Answer',
  },
};

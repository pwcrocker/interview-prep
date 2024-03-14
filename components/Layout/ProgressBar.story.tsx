import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from './ProgressBar';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof ProgressBar> = {
  component: ProgressBar,
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const StartProgress: Story = {
  args: {
    total: 100,
    current: 0,
  },
};

export const InProgress: Story = {
  args: {
    total: 100,
    current: 37,
  },
};

export const EndProgress: Story = {
  args: {
    total: 100,
    current: 100,
  },
};

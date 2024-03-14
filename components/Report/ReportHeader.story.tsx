import type { Meta, StoryObj } from '@storybook/react';
import ReportHeader from './ReportHeader';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof ReportHeader> = {
  component: ReportHeader,
};

export default meta;
type Story = StoryObj<typeof ReportHeader>;

export const Simple: Story = {
  args: {},
};

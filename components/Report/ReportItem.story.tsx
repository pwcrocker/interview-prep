import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '@mantine/core';
import ReportItem from './ReportItem';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof ReportItem> = {
  component: ReportItem,
};

export default meta;
type Story = StoryObj<typeof ReportItem>;

export const Simple: Story = {
  decorators: [
    (Story) => (
      <Accordion chevronPosition="right" variant="contained">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </Accordion>
    ),
  ],
  args: {
    idx: 0,
    question: {
      id: 'mock id',
      attributes: { topic: 'mock topic' },
      question: 'mock question',
      userAnswer: 'mock answer',
      analysis: { rating: 3, explanation: 'mock explanation' },
    },
  },
};

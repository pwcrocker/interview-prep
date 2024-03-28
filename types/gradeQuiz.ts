import { QuestionAnalysis } from './quiz';

interface GradedItem extends QuestionAnalysis {
  questionId: string;
}

export interface GradedQuiz {
  gradedItems: GradedItem[];
}

import { QuestionAnalysis } from './quiz';

export interface RetryAnalysis extends QuestionAnalysis {
  questionId: string;
}

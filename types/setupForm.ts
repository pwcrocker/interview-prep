import { EXPERIENCE } from './experience';

export interface SetupFormValues {
  job: string;
  experience: EXPERIENCE;
  topics: number;
  quesPerTopic: number;
  includedAreas: string[];
  excludedAreas: string[];
  exclusiveAreas: string[];
}

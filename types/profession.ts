import { EXPERIENCE } from './experience';
import { Nullable } from './nullability';

export interface Profession {
  job: Nullable<string>;
  experience: Nullable<EXPERIENCE>;
  focusAreas?: string[];
}

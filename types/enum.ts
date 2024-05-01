export enum USER_TIER {
  // potentially can take one pre-canned per day?
  NONE,
  // configure your own quiz criteria, but no storage
  BASE,
  // your quizzes are saved and you can retake them
  STANDARD,
  // REST access to your quizzes
  // PLUS,
}

export enum QUIZ_TYPE {
  PROFESSION = 'Profession',
  CERTIFICATE = 'Certificate',
  GENERAL = 'General',
}

export enum QUIZ_DIFFICULTY {
  BEGINNER,
  INTERMEDIATE,
  ADVANCED,
  MASTER,
}

export const PROFESSION_LABELS = {
  [QUIZ_DIFFICULTY.BEGINNER]: '0-2 years',
  [QUIZ_DIFFICULTY.INTERMEDIATE]: '3-5 years',
  [QUIZ_DIFFICULTY.ADVANCED]: '6-10 years',
  [QUIZ_DIFFICULTY.MASTER]: '10+ years',
};

// I have decided I hate enums in js/ts
export const GRADE_LABELS = [
  'Uh oh',
  'Irrelevant',
  'Needs Improvement',
  'Average',
  'Good',
  'Great',
];

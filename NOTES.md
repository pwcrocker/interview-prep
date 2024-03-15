todo

**fundamental**

- questions

  - max quiz length
  - storing quiz state in db

- tech debt

  - general
    - need more code splitting and storybook setup for quicker iteration
    - icons might need to be wrapped for styling
    - skeletons different sizes in nav
    - maybe create more specific skeletons
    - db
    - error state handling
    - unit testing
    - maybe storybook
  - ui
    - scalable quiz progress
    - handle loading state through isLoading + skeletons or maybe suspense
    - maybe use a timeout for waiting on async fetches at end of quiz

- ai

  - deterministic values for summary from ai (i.e. correct, partially correct, incorrect)
  - sometimes questions don't fully explain correct answer in detailed section
  - maybe too much repeating of user answer

**free tier**

- rate questions
- dispute AI answer

**paid**

- save questions/quizzes to bank
- potentially generate quiz from bank of saved
- SME can sell access to their quizzes
- deep dive
- flash cards

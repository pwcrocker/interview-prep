'use client';

import { useContext, useEffect, useState } from 'react';
import { Stepper, Button, Group, StepperProps } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import styles from './StepForm.module.css';
import { ProposedQuizAttributes } from '@/types/quiz';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';
import LoadingText from '../Layout/LoadingText';
import SetupPayload from './SetupPayload';
import OverviewSection from './OverviewSection';
import QuizAttributeSection from './QuizAttributeSection';
import { logErr } from '@/lib/logger';
import PromptSubmitButton from './PromptSubmitButton';
import { PROFESSION_LABELS, QUIZ_DIFFICULTY, QUIZ_TYPE } from '@/types/enum';
import { fetchQuiz } from '@/lib/prompt';

const FOCUS_AREA_GROUPS = ['Include/Exclude', 'Exclusive'];

function StyledStepper(props: StepperProps) {
  const atLeastWidth = useMediaQuery('(min-width: 48em)', true);
  return atLeastWidth ? (
    <Stepper color="burntorange.0" {...props} />
  ) : (
    <Stepper color="burntorange.0" {...props} size="sm" orientation="vertical" />
  );
}

export default function SetupForm() {
  const { quiz, dispatch } = useContext(QuizContext);
  const router = useRouter();
  const { user, isLoading } = useUser();

  const [active, setActive] = useState(0);
  const [focusAreaGroup, setFocusAreaGroup] = useState<string | null>();
  const [isBuilding, setIsBuilding] = useState(false);

  const form = useForm<ProposedQuizAttributes>({
    initialValues: {
      subject_area: '',
      quiz_type: QUIZ_TYPE.PROFESSION,
      difficulty: PROFESSION_LABELS[QUIZ_DIFFICULTY.INTERMEDIATE],
      num_topics: 3,
      ques_per_topic: 1,
      included_topics_arr: [],
      excluded_topics_arr: [],
      exclusive_topics_arr: [],
    },
    validate: (values) => {
      if (active === 0) {
        return {
          job:
            values.subject_area.trim().length < 4
              ? 'Subject Area must include at least 4 characters'
              : null,
        };
      }

      return {};
    },
  });

  useEffect(() => {
    if (quiz.quiz_questions?.length > 0) {
      // router.push('/prep');
      router.push(`/prep/question/${quiz.quiz_questions[0].ques_id}`);
    }
  }, [quiz]);

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 3 ? current + 1 : current;
    });

  const cleanUpTopicArrays = (curFocusGroup?: string | null) => {
    const areaGroup = curFocusGroup;
    if (areaGroup) {
      if (areaGroup === FOCUS_AREA_GROUPS[0]) {
        form.values.exclusive_topics_arr = [];
      } else {
        form.values.included_topics_arr = [];
        form.values.excluded_topics_arr = [];
      }
    } else {
      form.values.included_topics_arr = [];
      form.values.excluded_topics_arr = [];
      form.values.exclusive_topics_arr = [];
    }
  };

  const handleFocusAreaTypeChange = (value: string | null) => {
    setFocusAreaGroup(value);
    cleanUpTopicArrays(value);
  };

  // const handleDifficultyChange = (quizDiffvalue: QUIZ_DIFFICULTY) => {
  //   form.setFieldValue('difficulty', `${quizDiffvalue}`);
  // };

  const sendPrompt = async () => {
    nextStep();
    setIsBuilding(true);
    cleanUpTopicArrays(focusAreaGroup);

    try {
      if (!user?.sub) {
        throw new Error('User information not available for quiz creation');
      }
      // const proposedQuiz = {
      //   ...form.values,
      //   difficulty: QUIZ_DIFFICULTY[parseInt(form.values.difficulty)],
      // } as ProposedQuizAttributes;
      const result = await fetchQuiz(user.sub, form.values);
      if (!result || !result.persistedQuiz || !result.persistedQuestions) {
        // TODO handle retry flow?
        throw new Error("Couldn't create quiz");
      }
      dispatch({
        type: QuizActionType.MAKE_QUIZ,
        payload: result,
      });
    } catch (err) {
      setIsBuilding(false);
      prevStep();
      logErr('Failed to create quiz', err);
    }
  };

  return (
    <div className={styles.container}>
      <StyledStepper active={active}>
        <Stepper.Step label="Subject Area" description="Scope of questions">
          <OverviewSection
            subjectAreaInputProps={form.getInputProps('subject_area')}
            difficultyModifierInputProps={form.getInputProps('difficulty')}
            // difficultyChangeHandler={handleDifficultyChange}
          />
        </Stepper.Step>
        <Stepper.Step label="Quiz Attributes" description="Characteristics of quiz">
          <QuizAttributeSection
            topicsProps={form.getInputProps('num_topics')}
            quesProps={form.getInputProps('ques_per_topic')}
            focusAreaProps={{
              data: FOCUS_AREA_GROUPS,
              value: focusAreaGroup,
              onChange: (value: string | null) => handleFocusAreaTypeChange(value),
            }}
            showIncludeExclude={
              (focusAreaGroup && focusAreaGroup === FOCUS_AREA_GROUPS[0]) as boolean
            }
            showExclusive={(focusAreaGroup && focusAreaGroup === FOCUS_AREA_GROUPS[1]) as boolean}
            includeProps={form.getInputProps('included_topics_arr')}
            excludeProps={form.getInputProps('excluded_topics_arr')}
            exclusiveProps={form.getInputProps('exclusive_topics_arr')}
          />
        </Stepper.Step>
        <Stepper.Step label="Confirmation" description="Kick off the session">
          <SetupPayload values={form.values} />
        </Stepper.Step>
        <Stepper.Completed>
          <LoadingText label="Creating quiz..." mt="2rem" />
        </Stepper.Completed>
      </StyledStepper>
      {!isBuilding && (
        <Group justify="flex-end" mt="xl">
          {active !== 0 && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {active <= 1 ? (
            <Button color="burntorange.0" onClick={nextStep}>
              Next step
            </Button>
          ) : (
            <PromptSubmitButton
              clickHandler={sendPrompt}
              loading={isLoading}
              disabled={false}
              // disabled={!hasEnough}
              tooltip="TODO temporary"
            />
          )}
        </Group>
      )}
    </div>
  );
}

'use client';

import { useContext, useEffect, useState } from 'react';
import { Stepper, Button, Group, StepperProps } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import styles from './StepForm.module.css';
import { fetchQuiz } from '@/lib/prompt';
import { EXPERIENCE } from '@/types/experience';
import { QuizAttributes } from '@/types/quiz';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';
import LoadingText from '../Layout/LoadingText';
import SetupPayload from './SetupPayload';
import { SetupForm } from '@/types/setupForm';
import OverviewSection from './OverviewSection';
import QuizAttributeSection from './QuizAttributeSection';

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
  const { isLoading } = useUser();

  const [active, setActive] = useState(0);
  const [focusAreaGroup, setFocusAreaGroup] = useState<string | null>();
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState<Error>();

  const form = useForm<SetupForm>({
    initialValues: {
      job: '',
      experience: EXPERIENCE.INTERMEDIATE,
      topics: 3,
      quesPerTopic: 1,
      includedAreas: [],
      excludedAreas: [],
      exclusiveAreas: [],
    },
    validate: (values) => {
      if (active === 0) {
        return {
          job: values.job.trim().length < 4 ? 'Job must include at least 4 characters' : null,
        };
      }

      return {};
    },
  });

  // have to do this to trigger error.tsx
  // idk why
  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (quiz.questions?.length > 0) {
      router.push('/prep');
    }
  }, [quiz]);

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 3 ? current + 1 : current;
    });

  const cleanUpFocusAreas = (curFocusGroup?: string | null) => {
    const areaGroup = curFocusGroup;
    if (areaGroup) {
      if (areaGroup === FOCUS_AREA_GROUPS[0]) {
        form.values.exclusiveAreas = [];
      } else {
        form.values.includedAreas = [];
        form.values.excludedAreas = [];
      }
    } else {
      form.values.includedAreas = [];
      form.values.excludedAreas = [];
      form.values.exclusiveAreas = [];
    }
  };

  const handleFocusAreaTypeChange = (value: string | null) => {
    setFocusAreaGroup(value);
    cleanUpFocusAreas(value);
  };

  const buildQuizAttrObj = (): QuizAttributes => {
    const { job, experience, topics, quesPerTopic, includedAreas, excludedAreas, exclusiveAreas } =
      form.values;
    return {
      profession: {
        job,
        experience,
      },
      topics,
      quesPerTopic,
      includedAreas,
      excludedAreas,
      exclusiveAreas,
    };
  };

  const sendPrompt = async () => {
    nextStep();
    cleanUpFocusAreas(focusAreaGroup);
    setIsBuilding(true);
    const attr = buildQuizAttrObj();
    try {
      const prelimQuiz = await fetchQuiz(attr);
      dispatch({
        type: QuizActionType.MAKE_QUIZ,
        payload: {
          quiz: prelimQuiz,
          attributes: attr,
        },
      });
    } catch (err: any) {
      // doing this to trigger redirect to error.tsx
      // idk why i have to do this
      setError(err);
    }
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  return (
    <div className={styles.container}>
      <StyledStepper active={active}>
        <Stepper.Step label="Job Overview" description="What are you applying for?">
          <OverviewSection
            jobInputProps={form.getInputProps('job')}
            expInputProps={form.getInputProps('experience')}
          />
        </Stepper.Step>
        <Stepper.Step label="Quiz Attributes" description="Define characteristics of quiz">
          <QuizAttributeSection
            topicsProps={form.getInputProps('topics')}
            quesProps={form.getInputProps('quesPerTopic')}
            focusAreaProps={{
              data: FOCUS_AREA_GROUPS,
              value: focusAreaGroup,
              onChange: (value: string | null) => handleFocusAreaTypeChange(value),
            }}
            showIncludeExclude={
              (focusAreaGroup && focusAreaGroup === FOCUS_AREA_GROUPS[0]) as boolean
            }
            showExclusive={(focusAreaGroup && focusAreaGroup === FOCUS_AREA_GROUPS[1]) as boolean}
            includeProps={form.getInputProps('includedAreas')}
            excludeProps={form.getInputProps('excludedAreas')}
            exclusiveProps={form.getInputProps('exclusiveAreas')}
          />
        </Stepper.Step>
        <Stepper.Step label="Confirmation" description="Confirm and Start">
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
            <Button
              color="burntorange.0"
              onClick={sendPrompt}
              loading={isLoading}
              disabled={isLoading}
            >
              Yes, Let&apos;s Begin
            </Button>
          )}
        </Group>
      )}
    </div>
  );
}

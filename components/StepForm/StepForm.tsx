'use client';

/* eslint-disable no-console */

import { useContext, useEffect, useState } from 'react';
import {
  Stepper,
  Button,
  Group,
  TextInput,
  Text,
  Select,
  TagsInput,
  StepperProps,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import styles from './StepForm.module.css';
import { fetchQuizResponse } from '@/lib/prompt';
import { EXPERIENCE } from '@/types/experience';
import { Profession } from '@/types/profession';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';
import LoadingText from '../Layout/LoadingText';

function StyledStepper(props: StepperProps) {
  const atLeastWidth = useMediaQuery('(min-width: 48em)');
  return atLeastWidth ? (
    <Stepper {...props} />
  ) : (
    <Stepper {...props} size="sm" orientation="vertical" />
  );
}

export default function StepForm() {
  const [active, setActive] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const { quiz, dispatch } = useContext(QuizContext);
  const router = useRouter();
  const [error, setError] = useState<Error>();

  const form = useForm({
    initialValues: {
      job: '',
      experience: EXPERIENCE.INTERMEDIATE,
      focusAreas: [] as string[],
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

  const sendPrompt = async () => {
    nextStep();
    setIsBuilding(true);
    try {
      const res = await fetchQuizResponse(form.values as Profession);
      dispatch({
        type: QuizActionType.MAKE_QUIZ,
        payload: {
          response: res,
          profession: { job: form.values.job, experience: form.values.experience },
        },
      });
    } catch (err: any) {
      // doing this to trigger redirect to error.tsx
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
          <TextInput
            label="What profession are you applying for?"
            placeholder="i.e. Software Engineer"
            {...form.getInputProps('job')}
          />
          <Select
            label="What experience level?"
            data={[...Object.values(EXPERIENCE)]}
            defaultValue={EXPERIENCE.INTERMEDIATE}
            {...form.getInputProps('experience')}
          />
        </Stepper.Step>
        <Stepper.Step label="Areas of focus" description="Any focus areas?">
          <TagsInput
            label="OPTIONAL: requests specific topics to be included"
            placeholder="USE ENTER to submit"
            defaultValue={[]}
            clearable
            {...form.getInputProps('focusAreas')}
          />
        </Stepper.Step>
        <Stepper.Step label="Confirmation" description="Confirm and Start">
          <Text size="lg" fw={700} className={styles.summary_title}>
            Everything appear correct?
          </Text>
          <Text>{`Profession: ${form.values.job}`}</Text>
          <Text>{`Experience: ${form.values.experience}`}</Text>
          {form.values.focusAreas?.length > 0 && (
            <Text>{`Focus Areas: ${form.values.focusAreas}`}</Text>
          )}
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
            <Button onClick={nextStep}>Next step</Button>
          ) : (
            <Button onClick={sendPrompt}>Yes, Let&apos;s Begin</Button>
          )}
        </Group>
      )}
    </div>
  );
}

'use client';

/* eslint-disable no-console */

import { useContext, useState } from 'react';
import {
  Stepper,
  Button,
  Group,
  TextInput,
  Text,
  Select,
  Code,
  TagsInput,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import styles from './StepForm.module.css';
import { buildQuiz } from '@/lib/prompt';
import { EXPERIENCE } from '@/types/experience';
import { Profession } from '@/types/profession';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';

export default function StepForm() {
  const [active, setActive] = useState(0);
  const [isBuildingQuiz, setIsBuildingQuiz] = useState(false);
  // const [response, setResponse] = useState<QuizResponse | null>(null);
  const { quiz, dispatch } = useContext(QuizContext);

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

  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 3 ? current + 1 : current;
    });

  const sendPrompt = async () => {
    nextStep();
    setIsBuildingQuiz(true);
    const res = await buildQuiz(form.values as Profession);
    setIsBuildingQuiz(false);
    // setResponse(res);
    dispatch({
      type: QuizActionType.MAKE_QUIZ,
      payload: {
        response: res,
        profession: { job: form.values.job, experience: form.values.experience },
      },
    });
    console.log(`Response: ${res}`);
  };

  const prevStep = () => {
    // setResponse(null);
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  return (
    <div className={styles.container}>
      <LoadingOverlay
        visible={isBuildingQuiz}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <Stepper active={active}>
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
            label="Optionally use Enter to submit focus area(s)"
            placeholder="USE ENTER to submit focus area(s)"
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
          <Text> {`Experience: ${form.values.experience}`}</Text>
          {form.values.focusAreas?.length > 0 && (
            <Text> {`Focus Areas: ${form.values.focusAreas}`}</Text>
          )}
        </Stepper.Step>
        <Stepper.Completed>
          {quiz.questions?.length && (
            <>
              {/* <Text>
                Question count:{' '}
                {response.quizTopics.reduce(
                  (accumulator, curTopic) => accumulator + curTopic.questions.length,
                  0
                )}
              </Text> */}
              <Code block>{JSON.stringify(quiz, null, 2)}</Code>
            </>
          )}
        </Stepper.Completed>
      </Stepper>

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
    </div>
  );
}

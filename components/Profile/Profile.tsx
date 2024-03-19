'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion, ActionIcon, Center, Title } from '@mantine/core';
import { IconRepeat } from '@tabler/icons-react';
import { getUser } from '@/lib/db/database';
import { User } from '@/types/user';
import { Question, Quiz } from '@/types/quiz';
import { QuizActionType, QuizContext } from '@/store/QuizContextProvider';

function QuestionAccordion({ questions, quizIdx }: { questions: Question[]; quizIdx: number }) {
  return (
    <Accordion key={`question accordion${quizIdx}`}>
      {questions.map((question, idx) => (
        <Accordion.Item key={`question${idx}`} value={question.question}>
          <Accordion.Control>{question.question}</Accordion.Control>
          <Accordion.Panel fs="italic">Topic: {question.attributes.topic}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

function QuizAccordion({ curQuiz, quizIdx }: { curQuiz: Quiz; quizIdx: number }) {
  const { quiz, dispatch } = useContext(QuizContext);
  const router = useRouter();

  useEffect(() => {
    if (quiz.questions?.length > 0) {
      router.push('/prep');
    }
  }, [quiz]);

  function handleRetake(quizToRetake: Quiz) {
    dispatch({ type: QuizActionType.RETAKE_QUIZ, payload: { quiz: quizToRetake } });
  }

  return (
    <Accordion chevronPosition="left">
      <Accordion.Item
        key={`quiz accordion${quizIdx}`}
        value={curQuiz.attributes.profession.job! + quizIdx}
      >
        <Center>
          <Accordion.Control>{curQuiz.attributes.profession.job}</Accordion.Control>
          <ActionIcon size="lg" variant="subtle" color="gray" onClick={() => handleRetake(curQuiz)}>
            <IconRepeat />
          </ActionIcon>
        </Center>
        <Accordion.Panel>
          <QuestionAccordion questions={curQuiz.questions} quizIdx={quizIdx} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default function Profile({ authId }: { authId: string }) {
  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    async function loadUser() {
      const user = await getUser(decodeURIComponent(authId));
      if (!user) {
        throw Error('No user found');
      }
      setProfile(user);
    }

    loadUser();
  }, []);

  return (
    <>
      <Title mt="md" mb="md">
        Past Quizzes
      </Title>
      {profile?.quizzes &&
        profile.quizzes.map((qz, idx) => <QuizAccordion curQuiz={qz} quizIdx={idx} />)}
    </>
  );
}

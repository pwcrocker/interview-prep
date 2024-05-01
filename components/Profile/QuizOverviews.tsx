import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect, useRouter } from 'next/navigation';
import { Button, Container, Group, Stack, Text } from '@mantine/core';
import { logWarn } from '@/lib/logger';
import { getUserBySub, getQuizOverviewsByUser } from '@/lib/user';
import { UserDAO } from '@/types/dao';
import classes from './QuizOverviews.module.css'; // Import CSS for card styles
import FlippableCard from '../Layout/FlippableCard';
import { QuizOverview } from '@/types/quiz';

const DEFAULT_LIMIT = 8;

const snakeToUpperFirstCase = (str: string) =>
  str.replace(/^([a-z])|_([a-z])/g, (match, p1, p2) =>
    p1 ? p1.toUpperCase() : ` ${p2.toUpperCase()}`
  );

function QuizCardFront({ item }: { item: QuizOverview }) {
  return (
    <Stack style={{ height: '100%' }} justify="space-around">
      <section>
        <div key="createdat">
          {/* <span className={classes['card-key']}>Taken: </span> */}
          <span className={classes['card-key']}>
            {`${item.created_at.toLocaleDateString()} ${item.created_at.toLocaleTimeString([], { hour12: true })}`}
          </span>
        </div>
        <div key="subjectarea">
          <span className={classes['card-key']}>Subject Area: </span>
          <span className={classes['card-value']}>{item.subject_area}</span>
        </div>
        <div key="difficulty">
          <span className={classes['card-key']}>Difficulty: </span>
          <span className={classes['card-value']}>{item.difficulty}</span>
        </div>
      </section>
      <section>
        {Object.entries(item).map(([key, value]) => {
          if (typeof value === 'number' && value > 0) {
            return (
              <div key={key}>
                <span className={classes['card-value']}>{value}</span>
                <span className={classes['card-key']}>{` ${snakeToUpperFirstCase(key)}`}</span>
              </div>
            );
          }
          return null;
        })}
      </section>
    </Stack>
  );
}

function QuizCardBack({ item }: { item: QuizOverview }) {
  return (
    <Stack style={{ height: '100%' }} justify="space-around">
      {Array.isArray(item.topics) &&
        item.topics.map((topic: string, idx: number) => <div key={idx}>{`- ${topic}`}</div>)}
    </Stack>
  );
}

const sortArray = <T extends QuizOverview>(arrToSort: T[], direction: 'asc' | 'desc') => {
  const arrCopy = [...arrToSort];
  return arrCopy.sort((a, b) => {
    if (direction === 'desc') {
      return a.created_at > b.created_at ? -1 : 1;
    }
    return a.created_at < b.created_at ? -1 : 1;
  });
};

export default function QuizOverviews() {
  const { user, isLoading } = useUser();
  const [profile, setProfile] = useState<Partial<UserDAO>>();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [curPage, setCurPage] = useState(0);
  const [hasAll, setHasAll] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const initProfile = async () => {
        if (!user || !user.sub) {
          logWarn('User does not exist');
          redirect('/api/auth/login');
        }
        const userProf = await getUserBySub(user.sub);
        setProfile(userProf);
      };
      initProfile();
    }
  }, [isLoading]);

  useEffect(() => {
    if (profile && profile.user_sub) {
      const initQuizzes = async () => {
        const quizOvrRows = await getQuizOverviewsByUser(profile.user_sub!, DEFAULT_LIMIT, curPage);
        const sortedQuizOvr = sortArray(quizOvrRows, sortDirection);
        setQuizzes(sortedQuizOvr);
      };
      initQuizzes();
    }
  }, [profile]);

  async function getNextPage() {
    if (profile?.user_sub) {
      const qs = await getQuizOverviewsByUser(profile.user_sub, DEFAULT_LIMIT, curPage + 1);
      if (!qs || qs.length <= 0) {
        setHasAll(true);
      }
      setQuizzes((prev) => [...prev, ...qs]);
      setCurPage((prev) => prev + 1);
    }
  }

  function handleClick() {
    router.push('/prep');
  }

  return (
    <Container mt="md" ta="center">
      <Text fz="1.2rem" fw={700} fs="italic" c="burntorange.0">
        Past Quizzes
      </Text>
      <Group py="md" justify="center">
        {quizzes &&
          quizzes.map((q) => (
            <Stack gap="xs">
              <FlippableCard
                key={q.quiz_id}
                front={<QuizCardFront item={q} />}
                back={<QuizCardBack item={q} />}
              />
              <Button
                className={classes['review-btn']}
                // variant="light"
                // color="cyan"
                onClick={handleClick}
              >
                Review
              </Button>
            </Stack>
          ))}
      </Group>
      <Container mt="md" ta="center">
        {!hasAll && (
          <Button variant="outline" color="cyan" onClick={getNextPage}>
            Get more
          </Button>
        )}
      </Container>
    </Container>
  );
}

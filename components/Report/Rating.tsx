'use client';

import { useEffect, useState } from 'react';
import { IconStar } from '@tabler/icons-react';
import { Group } from '@mantine/core';

function EmptyStar() {
  return <IconStar color="darkorange" />;
}

function FilledStar() {
  return <IconStar color="darkorange" fill="darkorange" />;
}

export default function Rating({ analysisSummary }: { analysisSummary: string }) {
  const [stars, setStars] = useState([
    <EmptyStar />,
    <EmptyStar />,
    <EmptyStar />,
    <EmptyStar />,
    <EmptyStar />,
  ]);

  function createStarRating(summary: string) {
    const str = summary.toLowerCase();
    if (str.includes('great answer')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setStars([<FilledStar />, <FilledStar />, <FilledStar />, <FilledStar />, <FilledStar />]);
    } else if (str.includes('good answer')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setStars([<FilledStar />, <FilledStar />, <FilledStar />, <EmptyStar />, <EmptyStar />]);
    } else if (str.includes('needs improvement')) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setStars([<FilledStar />, <EmptyStar />, <EmptyStar />, <EmptyStar />, <EmptyStar />]);
    }
  }

  useEffect(() => {
    createStarRating(analysisSummary);
    // eslint-disable-next-line no-plusplus
  }, []);

  return <Group gap="0">{stars.map((x) => x)}</Group>;
}

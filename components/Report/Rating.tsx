'use client';

import { useEffect, useState } from 'react';
import { IconStar } from '@tabler/icons-react';
import { Group } from '@mantine/core';
import { logWarn } from '@/lib/logger';

// function EmptyStar() {
//   return <IconStar color="darkorange" />;
// }

function FilledStar() {
  return <IconStar color="darkorange" fill="darkorange" />;
}

export default function Rating({ rating }: { rating: number }) {
  const [stars, setStars] = useState([] as JSX.Element[]);

  function createStarRating(starRating: number) {
    switch (starRating) {
      case 5:
        setStars([<FilledStar />, <FilledStar />, <FilledStar />, <FilledStar />, <FilledStar />]);
        break;
      case 4:
        setStars([<FilledStar />, <FilledStar />, <FilledStar />, <FilledStar />]);
        break;
      case 3:
        setStars([<FilledStar />, <FilledStar />, <FilledStar />]);
        break;
      case 2:
        setStars([<FilledStar />, <FilledStar />]);
        break;
      case 1:
        setStars([<FilledStar />]);
        break;
      default:
        logWarn(`Encountered weird rating value: ${starRating}`);
        break;
    }
  }

  useEffect(() => {
    createStarRating(rating);
  }, []);

  return <Group gap="0">{stars.map((x) => x)}</Group>;
}

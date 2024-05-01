import { useState } from 'react';
import { IconRotate, IconView360 } from '@tabler/icons-react';
import classes from './FlippableCard.module.css'; // Import CSS for card styles

export default function FlippableCard({ front, back }: { front: JSX.Element; back: JSX.Element }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={[classes['flip-card'], flipped ? classes.flip : ''].join(' ')}
      onClick={handleFlip}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handleFlip();
        }
      }}
    >
      <IconRotate className={classes['top-right-icon']} />
      <IconRotate className={classes['top-right-icon-flipped']} />
      <div className={classes['flip-card-inner']}>
        <div className={classes['flip-card-front']}>{front}</div>
        <div className={classes['flip-card-back']}>{back}</div>
      </div>
    </div>
  );
}

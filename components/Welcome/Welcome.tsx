import { Title, Text } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: 'burntorange.0', to: 'yellow' }}
        >
          prepforwork.ai
        </Text>
      </Title>
    </>
  );
}

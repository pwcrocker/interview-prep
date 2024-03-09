import { Center, Text } from '@mantine/core';
import styles from './LoadingText.module.css';

export default function LoadingText({ label, ...props }: { label: string; [key: string]: any }) {
  return (
    <Center mih="10rem" bg="rgba(0, 0, 0, .3)" {...props}>
      <Text className={styles['loading-text']} fw={700} size="xl">
        {label}
      </Text>
    </Center>
  );
}

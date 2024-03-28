import Link from 'next/link';
import Image from 'next/image';
import { Group, Text } from '@mantine/core';

export default function Logo() {
  return (
    <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
      <Group>
        <Image src="/neontietrimmed.png" alt="prepforwork icon" width={30} height={50} />
        <Text fw={700} variant="gradient" gradient={{ from: 'burntorange.0', to: 'yellow' }}>
          prepforwork.ai
        </Text>
      </Group>
    </Link>
  );
}

import Link from 'next/link';
import { Group, UnstyledButton } from '@mantine/core';
import classes from './GeneralLinks.module.css';

export default function GeneralLinks() {
  return (
    <Group wrap="nowrap" mr="1rem" gap="0">
      <UnstyledButton className={classes.control} component={Link} href="/about">
        About
      </UnstyledButton>
      <UnstyledButton className={classes.control} component={Link} href="/contact">
        Contact
      </UnstyledButton>
    </Group>
  );
}

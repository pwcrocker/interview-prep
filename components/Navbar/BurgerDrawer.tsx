import { UnstyledButton } from '@mantine/core';

export default function BurgerDrawer() {
  return (
    <>
      <UnstyledButton component="a" href="/">
        Home
      </UnstyledButton>
      <UnstyledButton variant="transparent" component="a" href="/about">
        About
      </UnstyledButton>
      <UnstyledButton variant="transparent" component="a" href="/contact">
        Contact
      </UnstyledButton>
    </>
  );
}

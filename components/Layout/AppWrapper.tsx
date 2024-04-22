'use client';

import { AppShell, Burger, Flex, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useUser } from '@auth0/nextjs-auth0/client';
import Logo from '../Navbar/Logo';
import GeneralLinks from '../Navbar/GeneralLinks';
import DesktopActionButtons from '../Navbar/DesktopActionButtons';
import MobileActionButtons from '../Navbar/MobileActionButtons';
import BurgerDrawer from '../Navbar/BurgerDrawer';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [burgerOpened, { toggle }] = useDisclosure();
  const { user, isLoading } = useUser();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !burgerOpened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={burgerOpened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" align="center" style={{ flex: 1 }}>
            <Logo />
            {/* Desktop (bigger screen) section */}
            <Flex align="center" ml="xl" gap="1rem" visibleFrom="sm">
              <GeneralLinks />
              <DesktopActionButtons user={user} isLoading={isLoading} />
            </Flex>
            {/* Mobile (smaller screen) section */}
            <Flex gap="1rem" justify="center" align="center" hiddenFrom="sm">
              <MobileActionButtons user={user} isLoading={isLoading} />
            </Flex>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <BurgerDrawer />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

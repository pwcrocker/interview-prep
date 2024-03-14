import { Skeleton } from '@mantine/core';

export default function DefaultSkeleton({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children: React.ReactNode;
}) {
  return <Skeleton visible={isVisible}>{children}</Skeleton>;
}

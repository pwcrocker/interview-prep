import { Stack } from '@mantine/core';
import ReportHeader from '@/components/Report/ReportHeader';
import Report from '@/components/Report/Report';

export default function ReportPage() {
  return (
    <Stack gap="xl" px="lg">
      <ReportHeader />
      <Report />
    </Stack>
  );
}

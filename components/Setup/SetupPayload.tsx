import { SetupFormValues } from '@/types/setupForm';
import PayloadHeader from './PayloadHeader';
import PayloadBody from './PayloadBody';

export default function SetupPayload({ values }: { values: SetupFormValues }) {
  return (
    <>
      <PayloadHeader />
      <PayloadBody {...values} />
    </>
  );
}

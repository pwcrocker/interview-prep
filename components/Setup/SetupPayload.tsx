import PayloadHeader from './PayloadHeader';
import PayloadBody from './PayloadBody';
import { ProposedQuizAttributes } from '@/types/quiz';

export default function SetupPayload({ values }: { values: ProposedQuizAttributes }) {
  return (
    <>
      <PayloadHeader />
      <PayloadBody {...values} />
    </>
  );
}

import Profile from '@/components/Profile/Profile';

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  return <Profile authId={params.userId} />;
}

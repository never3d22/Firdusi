import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user.role === 'ADMIN') {
    return <Redirect href="/admin" />;
  }

  return <Redirect href="/(tabs)/menu" />;
}

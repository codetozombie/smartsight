import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to splash screen on app start
    router.replace('/(auth)/SplashScreen');
  }, []);

  return <View style={{ flex: 1, backgroundColor: '#06b6d4' }} />;
}
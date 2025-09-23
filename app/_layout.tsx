/**
 * SmartSight Root Layout
 * Main app navigation structure with authentication flow
 */

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useOnboardingStatus } from '../hooks/useAsyncStorage';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isComplete, isLoading } = useOnboardingStatus();

  useEffect(() => {
    if (!isLoading) {
      // Hide splash screen once we know onboarding status
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    // Keep splash screen visible while loading
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isComplete ? (
        // Authentication flow
        <>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </>
      ) : (
        // Main app flow
        <>
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}
/**
 * SmartSight Root Layout
 * Main app navigation structure with authentication flow
 */

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
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
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1}}> {/* Added paddingTop */}
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { 
              backgroundColor: Colors.background,
              paddingTop: 16, // Additional padding
            },
          }}
        >
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
/**
 * SmartSight Root Layout
 * Main app navigation structure with authentication flow
 */

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay to let the app initialize
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
        }}
        initialRouteName="(auth)"
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="modal" />
      </Stack>
    </SafeAreaProvider>
  );
}
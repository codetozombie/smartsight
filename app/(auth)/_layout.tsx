/**
 * SmartSight Authentication Layout
 * Stack navigation for splash screen and onboarding
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SplashScreen"
    >
      <Stack.Screen name="SplashScreen" />
      <Stack.Screen name="Onboarding" />
    </Stack>
  );
}
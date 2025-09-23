/**
 * SmartSight Settings Layout
 * Stack navigation for settings screens
 */

import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="AboutScreen" />
      <Stack.Screen name="PrivacyPolicyScreen" />
      <Stack.Screen name="ContactScreen" />
    </Stack>
  );
}

/**
 * SmartSight Settings Layout
 * Stack navigation for settings screens
 */

import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Hide header for the main settings screen
        }}
      />
      <Stack.Screen
        name="AboutScreen"
        options={{
          title: 'About',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        options={{
          title: 'Privacy Policy',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="ContactScreen"
        options={{
          title: 'Contact Us',
          headerBackTitle: 'Settings',
        }}
      />
    </Stack>
  );
}

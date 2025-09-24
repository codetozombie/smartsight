/**
 * SmartSight Settings Layout
 * Stack navigation for settings screens
 */

import { Stack } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
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
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        options={{
          title: 'Privacy Policy',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ContactScreen"
        options={{
          title: 'Contact Us',
          headerShown: true,
        }}
      />
    </Stack>
  );
}

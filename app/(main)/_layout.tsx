/**
 * SmartSight Main App Layout
 * Tab navigation for the main app screens
 */

import Icon from '@/components/Icon';
import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="🏠" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="CameraScreen"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, size }) => (
            <Icon name="📷" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="HistoryScreen"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Icon name="📋" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="SettingsScreen"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Icon name="⚙️" size={size} color={color} />
          ),
        }}
      />
      
      {/* Hidden screens */}
      <Tabs.Screen
        name="AnalysisScreen"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="ResultScreen"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="DetailedResultScreen"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

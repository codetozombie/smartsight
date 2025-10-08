/**
 * SmartSight Main App Layout
 * Tab navigation for the main app screens
 */

import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
  name: IconName;
  focusedName: IconName;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, color, size, name, focusedName }) => (
  <Ionicons 
    name={focused ? focusedName : name} 
    size={size} 
    color={color} 
  />
);

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 90 : 70,
          shadowColor: Colors.black,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size || 24}
              name="home-outline"
              focusedName="home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="CameraScreen"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size || 24}
              name="camera-outline"
              focusedName="camera"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="HistoryScreen"
        options={{
          title: 'History',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size || 24}
              name="time-outline"
              focusedName="time"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="SettingsScreen"  // 👈 Use your actual file name
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size || 24}
              name="settings-outline"
              focusedName="settings"
            />
          ),
        }}
      />
      
      {/* Hide screens from tab bar */}
      <Tabs.Screen
        name="AnalysisScreen"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="ResultScreen"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="DetailedResultScreen"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { NavigationParams } from './utils/types';
import { colors } from './utils/colors';

// Screens (adjust imports if your paths differ)
import OnboardingScreen from './app/(auth)/OnboardingScreen';
import SplashScreen from './app/(auth)/SplashScreen';
import AnalysisScreen from './app/(main)/AnalysisScreen';
import CameraScreen from './app/(main)/CameraScreen';
import DetailedResultScreen from './app/(main)/DetailedResultScreen';
import HistoryScreen from './app/(main)/HistoryScreen';
import HomeScreen from './app/(main)/HomeScreen';
import ResultScreen from './app/(main)/ResultScreen';
import AboutScreen from './app/settings/AboutScreen';
import ContactScreen from './app/settings/ContactScreen';
import PrivacyPolicyScreen from './app/settings/PrivacyPolicyScreen';
import SettingsScreen from './app/settings/SettingsScreen';

const Stack = createNativeStackNavigator<NavigationParams>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
  },
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        {/* Auth / onboarding */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />

        {/* Main flow */}
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="AnalysisScreen" component={AnalysisScreen} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />

        {/* History */}
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
        <Stack.Screen name="DetailedResultScreen" component={DetailedResultScreen} />

        {/* Settings */}
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="ContactScreen" component={ContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  HomeScreen: undefined;
  CameraScreen: undefined;
  AnalysisScreen: { imageUri: string };
  HistoryScreen: undefined;
};

export type CameraScreenNavigationProp = {
  navigate: (screen: 'AnalysisScreen', params: { imageUri: string }) => void;
  goBack: () => void;
};

export type RootStackParamList = {
  '(auth)': undefined;
  '(main)': undefined;
  settings: undefined;
};

export type AsyncStorageKeys = {
  onboardingSeen: 'true' | 'false';
};

export type EyeResult = 'healthy' | 'monitor' | 'critical';

export interface AnalysisResult {
  result: EyeResult;
  confidence: number;
  timestamp: string;
  imageUri: string;
}

export type AnalysisScreenParams = {
  imageUri: string;
};

export interface SavedResult {
  id: string;
  result: EyeResult;
  confidence: number;
  timestamp: string;
  imageUri: string;
  notes?: string;
}

export interface ResultScreenParams {
  result: EyeResult;
  confidence: string;
  timestamp: string;
  imageUri: string;
}

export interface ResultDisplayConfig {
  icon: string;
  color: string;
  title: string;
  description: string;
  recommendations: string[];
}

export interface SavedRecord {
  id: string;
  date: string;
  result: EyeResult;
  imageUri: string;
  confidence?: number;
  notes?: string;
}

export interface DetailedResultScreenParams {
  recordId: string;
  result: EyeResult;
  confidence?: string;
  date: string;
  imageUri: string;
  notes?: string;
}

export interface RecommendationConfig {
  title: string;
  description: string;
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  followUpDays?: number;
}

export interface HistoryItemProps {
  item: SavedResult;
  onPress: (result: SavedResult) => void;
}

export interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

// Settings stack route types
export type SettingsStackParamList = {
  SettingsScreen: undefined;
  PrivacyPolicyScreen: undefined;
  AboutScreen: undefined;
  ContactScreen: undefined;
};

// Optional helper type for useNavigation
export type SettingsNav<T extends keyof SettingsStackParamList> =
  NativeStackNavigationProp<SettingsStackParamList, T>;
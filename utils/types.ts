/**
 * SmartSight TypeScript Type Definitions
 * All app-wide types and interfaces
 */

/**
 * Test outcome types
 */
export type TestOutcome = 'healthy' | 'monitor' | 'critical';

/**
 * Eye result types (alias for TestOutcome)
 */
export type EyeResult = TestOutcome;

/**
 * Analysis result from the model
 */
export interface AnalysisResult {
  id: string; // ✅ Added ID
  timestamp: string; // This will map to 'date' in SavedRecord
  imageUri: string;
  result: TestOutcome;
  confidence: number;
  details: {
    detected_features?: string[];
    probabilities?: number[];
    [key: string]: any;
  };
  notes?: string; // ✅ Added optional notes
}

/**
 * Saved record structure
 */
export interface SavedRecord {
  id: string;
  date: string; // ISO date string
  result: EyeResult;
  imageUri: string;
  confidence?: number;
  notes?: string;
  details?: {
    detected_features?: string[];
    probabilities?: number[];
    [key: string]: any;
  };
}

/**
 * Recommendation configuration
 */
export interface RecommendationConfig {
  description: string;
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  followUpDays?: number;
}

/**
 * Test result structure
 */
export interface TestResult {
  id: string;
  timestamp: string;
  imageUri: string;
  outcome: TestOutcome;
  confidence: number;
  analysis?: AnalysisResult;
}

// Fix SavedResult to include all needed properties
export interface SavedResult extends TestResult {
  id: string;
  date: string;
  result: EyeResult; // Add this for compatibility
  notes?: string;   // Add notes property
}

export interface UserSettings {
  hasCompletedOnboarding: boolean;
  language: string;
  notifications: boolean;
  dataConsent: boolean;
}

// Navigation parameter types
export interface CameraScreenParams {
  returnTo?: string;
}

export interface AnalysisScreenParams {
  imageUri: string;
}

export interface ResultScreenParams {
  result: string;
  confidence: string;
  timestamp: string;
  imageUri: string;
}

export type DetailedResultScreenParams = {
  resultId?: string;
  recordId?: string;
  date?: string;
  result?: string;
  imageUri?: string;
  confidence?: string;
  notes?: string;
};

// Add navigation types for settings
export type SettingsStackParamList = {
  index: undefined;
  AboutScreen: undefined;
  PrivacyPolicyScreen: undefined;
  ContactScreen: undefined;
};

// Add main navigation types
export type MainStackParamList = {
  HomeScreen: undefined;
  CameraScreen: undefined;
  AnalysisScreen: { imageUri: string };
  ResultScreen: {
    imageUri: string;
    prediction: string;
    confidence: string;
    details?: string;
  };
  DetailedResultScreen: { result: AnalysisResult };
  HistoryScreen: undefined;
  settings: undefined;
};

// Root navigation types
export type RootStackParamList = {
  '(auth)': undefined;
  '(main)': undefined;
  settings: undefined;
};

// Storage Types
export interface StorageKeys {
  TEST_RESULTS: 'smartsight_test_results';
  APP_STATE: 'smartsight_app_state';
  SETTINGS: 'smartsight_settings';
  ONBOARDING_COMPLETE: 'smartsight_onboarding_complete';
}

export type AsyncStorageKeys = {
  onboardingSeen: 'true' | 'false';
} & StorageKeys;

export interface AsyncStorageHook<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  save: (data: T) => Promise<void>;
  remove: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface ModelHook {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  analyze: (imageUri: string) => Promise<AnalysisResult>;
  loadModel: () => Promise<void>;
}

// Utility types for form validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Error types
export type AppError = 
  | 'CAMERA_PERMISSION_DENIED'
  | 'CAMERA_NOT_AVAILABLE'
  | 'IMAGE_PROCESSING_FAILED'
  | 'MODEL_LOAD_FAILED'
  | 'MODEL_INFERENCE_FAILED'
  | 'STORAGE_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface ErrorState {
  type: AppError;
  message: string;
  details?: any;
  timestamp: string;
}

// Theme and styling types
export interface ThemeColors {
  primary: string;
  success: string;
  warning: string;
  error: string;
  text: string;
  textDark: string;
  textLight: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  transparent: string;
  black: string;
  white: string;
}

export interface ButtonVariant {
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
}

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

// API response types (if using external services)
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Export const for storage keys
export const STORAGE_KEYS: StorageKeys = {
  TEST_RESULTS: 'smartsight_test_results',
  APP_STATE: 'smartsight_app_state',
  SETTINGS: 'smartsight_settings',
  ONBOARDING_COMPLETE: 'smartsight_onboarding_complete',
} as const;
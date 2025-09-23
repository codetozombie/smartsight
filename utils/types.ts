/**
 * SmartSight TypeScript Type Definitions
 * All app-wide types and interfaces
 */

export type TestOutcome = 'healthy' | 'monitor' | 'critical';
export type EyeResult = TestOutcome;

export interface TestResult {
  id: string;
  timestamp: string;
  imageUri: string;
  outcome: TestOutcome;
  confidence: number;
  analysis?: AnalysisResult;
}

export interface AnalysisResult {
  result: TestOutcome;
  confidence: number;
  timestamp: string;
  imageUri: string;
  details?: {
    processedAt: string;
    modelVersion: string;
    processing_time: number;
    [key: string]: any;
  };
}

export interface SavedResult extends TestResult {
  id: string;
  date: string;
}

export interface SavedRecord {
  id: string;
  date: string;
  result: EyeResult;
  imageUri: string;
  confidence?: number;
  notes?: string;
}

export interface UserSettings {
  hasCompletedOnboarding: boolean;
  language: string;
  notifications: boolean;
  dataConsent: boolean;
}

// Recommendation types
export interface RecommendationConfig {
  description: string;
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  followUpDays: number;
}

// Navigation parameter types - Fix constraint issues
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

// Fix this interface to work with Expo Router constraints
export type DetailedResultScreenParams = {
  resultId?: string;
  recordId?: string;
  date?: string;
  result?: string;
  imageUri?: string;
  confidence?: string;
  notes?: string;
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
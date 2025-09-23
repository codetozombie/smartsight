import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestResult, UserSettings } from './types';

export const StorageKeys = {
  ONBOARDING: 'hasCompletedOnboarding',
  ONBOARDING_SEEN: 'smartsight_onboarding_seen',
  TEST_RESULTS: 'testResults',
  SAVED_RESULTS: 'smartsight_saved_results',
  USER_SETTINGS: 'userSettings',
} as const;

// Legacy interfaces for compatibility
export interface SavedRecord {
  id: string;
  date: string;
  result: 'healthy' | 'monitor' | 'critical';
  imageUri: string;
  confidence?: number;
  notes?: string;
}

export interface SavedResult extends TestResult {
  id: string;
  date: string;
}

// Storage utility functions
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
    throw error;
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get ${key}:`, error);
    return null;
  }
};

// Test Results Functions
export const saveTestResult = async (result: TestResult): Promise<void> => {
  try {
    const existingResults = await getTestResults();
    const updatedResults = [result, ...existingResults];
    
    await AsyncStorage.setItem(
      StorageKeys.TEST_RESULTS,
      JSON.stringify(updatedResults)
    );
  } catch (error) {
    console.error('Failed to save test result:', error);
    throw new Error('Failed to save test result');
  }
};

export const getTestResults = async (): Promise<TestResult[]> => {
  try {
    const stored = await AsyncStorage.getItem(StorageKeys.TEST_RESULTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get test results:', error);
    return [];
  }
};

// Saved Results Functions (for DetailedResultScreen)
export const getSavedResults = async (): Promise<SavedResult[]> => {
  try {
    const stored = await AsyncStorage.getItem(StorageKeys.SAVED_RESULTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get saved results:', error);
    return [];
  }
};

export const getRecordById = async (id: string): Promise<SavedRecord | null> => {
  try {
    const results = await getSavedResults();
    const record = results.find(r => r.id === id);
    return record || null;
  } catch (error) {
    console.error('Failed to get record by ID:', error);
    return null;
  }
};

export const deleteRecord = async (id: string): Promise<void> => {
  try {
    const results = await getSavedResults();
    const filtered = results.filter(result => result.id !== id);
    
    await AsyncStorage.setItem(
      StorageKeys.SAVED_RESULTS,
      JSON.stringify(filtered)
    );
  } catch (error) {
    console.error('Failed to delete record:', error);
    throw new Error('Failed to delete record');
  }
};

export const deleteResult = async (id: string): Promise<void> => {
  try {
    const results = await getTestResults();
    const filtered = results.filter(result => result.id !== id);
    
    await AsyncStorage.setItem(
      StorageKeys.TEST_RESULTS,
      JSON.stringify(filtered)
    );
  } catch (error) {
    console.error('Failed to delete test result:', error);
    throw new Error('Failed to delete test result');
  }
};

export const deleteTestResult = async (id: string): Promise<void> => {
  return deleteResult(id);
};

export const clearTestResults = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(StorageKeys.TEST_RESULTS);
  } catch (error) {
    console.error('Failed to clear test results:', error);
    throw new Error('Failed to clear test results');
  }
};

// User Settings Functions
export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      StorageKeys.USER_SETTINGS,
      JSON.stringify(settings)
    );
  } catch (error) {
    console.error('Failed to save user settings:', error);
    throw new Error('Failed to save user settings');
  }
};

export const getUserSettings = async (): Promise<UserSettings | null> => {
  try {
    const stored = await AsyncStorage.getItem(StorageKeys.USER_SETTINGS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get user settings:', error);
    return null;
  }
};

// Onboarding Functions
export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(StorageKeys.ONBOARDING, 'true');
  } catch (error) {
    console.error('Failed to set onboarding completed:', error);
    throw new Error('Failed to save onboarding status');
  }
};

export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(StorageKeys.ONBOARDING);
    return completed === 'true';
  } catch (error) {
    console.error('Failed to check onboarding status:', error);
    return false;
  }
};
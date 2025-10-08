import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AnalysisResult } from './types';

const STORAGE_KEYS = {
  ANALYSIS_HISTORY: '@smartsight_analysis_history',
  ONBOARDING_COMPLETE: '@smartsight_onboarding_complete',
} as const;

/**
 * Save analysis result to history
 */
export const saveAnalysisResult = async (result: AnalysisResult): Promise<void> => {
  try {
    // Get existing history
    const history = await getAnalysisHistory();
    
    // Add new result at the beginning
    const updatedHistory = [result, ...history];
    
    // Limit to last 50 results
    const limitedHistory = updatedHistory.slice(0, 50);
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEYS.ANALYSIS_HISTORY,
      JSON.stringify(limitedHistory)
    );
    
    console.log('Analysis result saved to history');
  } catch (error) {
    console.error('Failed to save analysis result:', error);
    throw new Error('Failed to save to history');
  }
};

/**
 * Get all analysis history
 */
export const getAnalysisHistory = async (): Promise<AnalysisResult[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY);
    
    if (!historyJson) {
      return [];
    }
    
    const history = JSON.parse(historyJson) as AnalysisResult[];
    return history;
  } catch (error) {
    console.error('Failed to load analysis history:', error);
    return [];
  }
};

/**
 * Get a specific record by timestamp (ID)
 */
export const getRecordById = async (timestamp: string): Promise<AnalysisResult | null> => {
  try {
    const history = await getAnalysisHistory();
    const record = history.find(item => item.timestamp === timestamp);
    return record || null;
  } catch (error) {
    console.error('Failed to get record:', error);
    return null;
  }
};

/**
 * Delete a specific analysis result
 */
export const deleteAnalysisResult = async (timestamp: string): Promise<void> => {
  try {
    const history = await getAnalysisHistory();
    const updatedHistory = history.filter(item => item.timestamp !== timestamp);
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.ANALYSIS_HISTORY,
      JSON.stringify(updatedHistory)
    );
    
    console.log('Analysis result deleted');
  } catch (error) {
    console.error('Failed to delete analysis result:', error);
    throw new Error('Failed to delete from history');
  }
};

/**
 * Delete a record (alias for deleteAnalysisResult)
 */
export const deleteRecord = async (timestamp: string): Promise<void> => {
  return deleteAnalysisResult(timestamp);
};

/**
 * Clear all analysis history
 */
export const clearAnalysisHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ANALYSIS_HISTORY);
    console.log('Analysis history cleared');
  } catch (error) {
    console.error('Failed to clear analysis history:', error);
    throw new Error('Failed to clear history');
  }
};

/**
 * Get analysis statistics
 */
export const getAnalysisStatistics = async () => {
  try {
    const history = await getAnalysisHistory();
    
    const total = history.length;
    const healthy = history.filter(r => r.result === 'healthy').length;
    const monitor = history.filter(r => r.result === 'monitor').length;
    const critical = history.filter(r => r.result === 'critical').length;
    
    return {
      total,
      healthy,
      monitor,
      critical,
      lastAnalysis: history[0]?.timestamp || null,
    };
  } catch (error) {
    console.error('Failed to get statistics:', error);
    return {
      total: 0,
      healthy: 0,
      monitor: 0,
      critical: 0,
      lastAnalysis: null,
    };
  }
};

/**
 * Onboarding completion status
 */
export const setOnboardingComplete = async (complete: boolean = true): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, JSON.stringify(complete));
  } catch (error) {
    console.error('Failed to save onboarding status:', error);
  }
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  } catch (error) {
    console.error('Failed to check onboarding status:', error);
    return false;
  }
};
/**
 * SmartSight AsyncStorage Hook
 * Custom hook for managing AsyncStorage operations with React state
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import type { TestResult } from '../utils/types';

interface UseAsyncStorageReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  save: (newData: T) => Promise<void>;
  remove: () => Promise<void>;
  refresh: () => Promise<void>;
}

// Generic AsyncStorage hook
export function useAsyncStorage<T>(
  key: string,
  defaultValue: T | null = null
): UseAsyncStorageReturn<T> {
  const [data, setData] = useState<T | null>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored !== null) {
        const parsed = JSON.parse(stored) as T;
        setData(parsed);
      } else {
        setData(defaultValue);
      }
    } catch (err) {
      console.error(`Error loading data for key ${key}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(defaultValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  const save = useCallback(async (newData: T) => {
    setError(null);
    
    try {
      await AsyncStorage.setItem(key, JSON.stringify(newData));
      setData(newData);
    } catch (err) {
      console.error(`Error saving data for key ${key}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to save data');
      throw err;
    }
  }, [key]);

  const remove = useCallback(async () => {
    setError(null);
    
    try {
      await AsyncStorage.removeItem(key);
      setData(defaultValue);
    } catch (err) {
      console.error(`Error removing data for key ${key}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to remove data');
      throw err;
    }
  }, [key, defaultValue]);

  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    isLoading,
    error,
    save,
    remove,
    refresh,
  };
}

// Specialized hooks
export function useTestResults() {
  return useAsyncStorage<TestResult[]>('smartsight_test_results', []);
}

export function useOnboardingStatus() {
  const { data, save, isLoading } = useAsyncStorage('smartsight_onboarding_complete', false);
  
  const markComplete = useCallback(async () => {
    await save(true);
  }, [save]);
  
  return {
    isComplete: data || false,
    markComplete,
    isLoading,
  };
}

// Legacy export for backward compatibility
export { useAsyncStorage as default };

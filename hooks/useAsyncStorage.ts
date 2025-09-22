import { useEffect, useState } from 'react';
import { getSavedResults, saveResult } from '../utils/storage';
import { SavedResult } from '../utils/types';

export const useAsyncStorage = () => {
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await getSavedResults();
      setSavedResults(results);
    } catch (err) {
      setError('Failed to load results');
      console.error('Load results error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNewResult = async (result: SavedResult): Promise<boolean> => {
    try {
      setError(null);
      await saveResult(result);
      await loadResults(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to save result');
      console.error('Save result error:', err);
      return false;
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  return {
    savedResults,
    isLoading,
    error,
    saveNewResult,
    loadResults,
  };
};
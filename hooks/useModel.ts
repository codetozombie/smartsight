/**
 * SmartSight Model Hook
 * Custom hook for managing ONNX model operations
 */

import { useCallback, useEffect, useState } from 'react';
import { analyzeImage, disposeModel, getModelStatus, initSession } from '../utils/model';
import type { AnalysisResult, ModelHook } from '../utils/types';

export function useModel(): ModelHook {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModel = useCallback(async () => {
    if (isLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      await initSession();
      setIsLoaded(true);
      console.log('Model loaded successfully');
    } catch (err) {
      console.error('Failed to load model:', err);
      setError(err instanceof Error ? err.message : 'Failed to load model');
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isLoading]);

  const analyze = useCallback(async (imageUri: string): Promise<AnalysisResult> => {
    if (!isLoaded) {
      throw new Error('Model not loaded. Call loadModel() first.');
    }

    try {
      setError(null);
      const result = await analyzeImage(imageUri);
      return result;
    } catch (err) {
      console.error('Analysis failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isLoaded]);

  const checkStatus = useCallback(() => {
    const status = getModelStatus();
    setIsLoaded(status.isLoaded);
    setIsLoading(status.isLoading);
  }, []);

  const cleanup = useCallback(async () => {
    try {
      await disposeModel();
      setIsLoaded(false);
      setError(null);
    } catch (err) {
      console.error('Failed to dispose model:', err);
    }
  }, []);

  useEffect(() => {
    // Check initial status
    checkStatus();

    // Auto-load model on mount
    loadModel();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, []);

  return {
    isLoaded,
    isLoading,
    error,
    analyze,
    loadModel,
  };
}

// Legacy hook for backward compatibility
export const useModelStatus = () => {
  const [status, setStatus] = useState({
    isLoaded: false,
    isLoading: false,
    isReady: false,
  });

  const updateStatus = useCallback(() => {
    const modelStatus = getModelStatus();
    setStatus(modelStatus);
  }, []);

  useEffect(() => {
    updateStatus();
    
    // Check status periodically
    const interval = setInterval(updateStatus, 1000);
    
    return () => clearInterval(interval);
  }, [updateStatus]);

  return status;
};
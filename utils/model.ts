/**
 * SmartSight ONNX Model Inference Utilities
 * Enhanced eye health classification with proper error handling
 */

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import type { AnalysisResult, TestOutcome } from './types';

export class ModelError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ModelError';
  }
}

let isLoading = false;

const softmax = (arr: Float32Array): number[] => {
  const max = Math.max(...Array.from(arr));
  const exps = Array.from(arr).map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
};

/**
 * Mock analysis function for development
 * Replace with actual ONNX model inference
 */
export const mockAnalyzeImage = async (imageUri: string): Promise<AnalysisResult> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const outcomes: Array<TestOutcome> = ['healthy', 'monitor', 'critical'];
  const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  const confidence = 0.7 + Math.random() * 0.25;
  
  return {
    result: randomOutcome,
    confidence,
    timestamp: new Date().toISOString(),
    imageUri,
    details: {
      processedAt: new Date().toISOString(),
      modelVersion: '1.0.0',
      processing_time: 3.2,
      model_type: 'mock_classifier', // ✅ Added required field
      image_quality: 'good',
      detected_features: ['iris', 'pupil', 'sclera'],
    },
  };
};

/**
 * Initialize model session
 */
export const initSession = async (): Promise<void> => {
  if (isLoading) return;
  
  isLoading = true;
  try {
    // TODO: Load actual ONNX model
    console.log('Model session initialized (mock)');
  } catch (error) {
    console.error('Failed to initialize model session:', error);
    throw new ModelError('Failed to load AI model', 'MODEL_LOAD_ERROR');
  } finally {
    isLoading = false;
  }
};

/**
 * Preprocess image for model input
 */
const preprocess = async (imageUri: string): Promise<Float32Array> => {
  try {
    const target = { width: 224, height: 224 };
    const manipulatedImage = await manipulateAsync(
      imageUri,
      [{ resize: target }],
      { compress: 1, format: SaveFormat.PNG, base64: false }
    );

    // Placeholder preprocessing
    const data = new Float32Array(3 * 224 * 224);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random();
    }
    
    return data;
  } catch (error) {
    console.error('Image preprocessing failed:', error);
    throw new ModelError('Failed to process image', 'PREPROCESSING_ERROR');
  }
};

/**
 * Main analysis function
 */
export const analyzeImage = async (imageUri: string): Promise<AnalysisResult> => {
  const startTime = Date.now();
  
  try {
    await initSession();
    await preprocess(imageUri);
    
    // Use mock analysis for now
    const result = await mockAnalyzeImage(imageUri);
    
    const processingTime = (Date.now() - startTime) / 1000;
    
    // ✅ Fixed: Explicitly construct details with all required fields
    return {
      result: result.result,
      confidence: result.confidence,
      timestamp: result.timestamp,
      imageUri: result.imageUri,
      details: {
        processedAt: result.details.processedAt,
        modelVersion: result.details.modelVersion,
        processing_time: processingTime,
        model_type: result.details.model_type,
        image_quality: result.details.image_quality,
        detected_features: result.details.detected_features,
      },
    };
  } catch (error) {
    console.error('Analysis failed:', error);
    
    if (error instanceof ModelError) {
      throw error;
    }
    throw new ModelError('Analysis pipeline failed', 'PIPELINE_ERROR');
  }
};

/**
 * Get model status
 */
export const getModelStatus = () => {
  return {
    isLoaded: true, // Mock status
    isLoading,
    isReady: !isLoading,
  };
};

/**
 * Dispose model resources
 */
export const disposeModel = async (): Promise<void> => {
  // Cleanup resources
  console.log('Model disposed');
};

// Legacy exports
export const loadModel = initSession;
export const isModelReady = () => getModelStatus().isReady;
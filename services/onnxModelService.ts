/**
 * ONNX Eye Disease Classification Service
 * Using TensorFlow.js for Expo compatibility
 */

import * as tf from '@tensorflow/tfjs';
import { ModelError } from '../utils/errors';
import type { TestOutcome } from '../utils/types';

// Model configuration
const MODEL_CONFIG = {
  inputShape: [1, 3, 256, 256] as const,
  numClasses: 4,
  mean: [0.485, 0.456, 0.406],
  std: [0.229, 0.224, 0.225],
};

// Class labels mapping
const CLASS_LABELS = {
  0: 'Cataract',
  1: 'Diabetic Retinopathy',
  2: 'Glaucoma',
  3: 'Normal',
} as const;

// Confidence thresholds
const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.85,
  MEDIUM: 0.60,
  LOW: 0.60,
} as const;

let model: tf.GraphModel | null = null;
let isModelLoading = false;
let isModelLoaded = false;

/**
 * Initialize TensorFlow.js
 */
export const initializeTensorFlow = async () => {
  try {
    await tf.ready();
    console.log('TensorFlow.js initialized');
    console.log('Backend:', tf.getBackend());
  } catch (error) {
    console.error('Failed to initialize TensorFlow:', error);
    throw new ModelError('Failed to initialize TensorFlow', 'TF_INIT_ERROR');
  }
};

/**
 * Load model - For now using mock until TFJS model is converted
 */
export const loadONNXModel = async (): Promise<void> => {
  if (isModelLoaded) {
    console.log('Model already loaded');
    return;
  }

  if (isModelLoading) {
    console.log('Model is currently loading');
    return;
  }

  isModelLoading = true;

  try {
    console.log('Initializing TensorFlow...');
    await initializeTensorFlow();

    console.log('ONNX model loading skipped - using mock for now');
    // TODO: Convert ONNX to TensorFlow.js format
    // model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
    
    isModelLoaded = true;
    console.log('Model service ready (mock mode)');
  } catch (error) {
    console.error('Failed to load model:', error);
    isModelLoaded = false;
    throw new ModelError('Failed to load AI model', 'MODEL_LOAD_ERROR');
  } finally {
    isModelLoading = false;
  }
};

/**
 * Softmax function
 */
const softmax = (logits: number[]): number[] => {
  const maxLogit = Math.max(...logits);
  const exps = logits.map(x => Math.exp(x - maxLogit));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sumExps);
};

/**
 * Map prediction to outcome
 */
const mapPredictionToOutcome = (classIndex: number, confidence: number): TestOutcome => {
  const className = CLASS_LABELS[classIndex as keyof typeof CLASS_LABELS];
  
  if (className === 'Normal') {
    return confidence >= CONFIDENCE_THRESHOLDS.HIGH ? 'healthy' : 'monitor';
  }
  
  if (confidence >= CONFIDENCE_THRESHOLDS.HIGH) {
    return 'critical';
  } else if (confidence >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    return 'monitor';
  } else {
    return 'monitor';
  }
};

/**
 * Get confidence level
 */
const getConfidenceLevel = (confidence: number): string => {
  if (confidence >= CONFIDENCE_THRESHOLDS.HIGH) return 'High';
  if (confidence >= CONFIDENCE_THRESHOLDS.MEDIUM) return 'Medium';
  return 'Low';
};

/**
 * Run inference - Mock implementation
 */
export const runInference = async (
  imageData: Uint8ClampedArray,
  width: number,
  height: number
): Promise<{
  prediction: number;
  confidence: number;
  probabilities: number[];
  className: string;
  outcome: TestOutcome;
  confidenceLevel: string;
  allPredictions: Array<{ class: string; probability: number }>;
}> => {
  try {
    console.log('Running mock inference...');

    // Mock inference - generate random but realistic results
    const mockLogits = Array.from({ length: 4 }, () => Math.random() * 2 - 1);
    const probabilities = softmax(mockLogits);

    const prediction = probabilities.indexOf(Math.max(...probabilities));
    const confidence = probabilities[prediction];
    const className = CLASS_LABELS[prediction as keyof typeof CLASS_LABELS];

    const outcome = mapPredictionToOutcome(prediction, confidence);
    const confidenceLevel = getConfidenceLevel(confidence);

    const allPredictions = probabilities
      .map((prob, idx) => ({
        class: CLASS_LABELS[idx as keyof typeof CLASS_LABELS],
        probability: prob,
      }))
      .sort((a, b) => b.probability - a.probability);

    console.log('Mock inference complete:', {
      className,
      confidence: `${(confidence * 100).toFixed(2)}%`,
      outcome,
    });

    return {
      prediction,
      confidence,
      probabilities,
      className,
      outcome,
      confidenceLevel,
      allPredictions,
    };
  } catch (error) {
    console.error('Inference failed:', error);
    throw new ModelError('Inference failed', 'INFERENCE_ERROR');
  }
};

/**
 * Get model status
 */
export const getModelStatus = () => ({
  isLoaded: isModelLoaded,
  isLoading: isModelLoading,
  isReady: isModelLoaded && !isModelLoading,
});

/**
 * Dispose model
 */
export const disposeModel = async (): Promise<void> => {
  if (model) {
    model.dispose();
    model = null;
    isModelLoaded = false;
    console.log('Model disposed');
  }
};
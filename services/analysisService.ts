/**
 * Analysis Service
 * Main service for eye disease analysis using ONNX model
 */

import { ModelError } from '../utils/errors';
import { AnalysisResult, TestOutcome } from '../utils/types';
import { base64ToImageData, imageUriToBase64, resizeImageForModel } from './imageProcessingService';
import { getModelStatus, loadONNXModel, runInference } from './onnxModelService';

// Mock analysis fallback
const mockAnalyzeImage = async (imageUri: string): Promise<AnalysisResult> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const outcomes: TestOutcome[] = ['healthy', 'monitor', 'critical'];
  const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  const randomConfidence = 0.7 + Math.random() * 0.25;
  
  const now = new Date().toISOString();
  
  return {
    result: randomOutcome,
    confidence: randomConfidence,
    timestamp: now,
    imageUri: imageUri,
    details: {
      processedAt: now,
      modelVersion: 'mock-1.0.0',
      processing_time: 2.0,
      model_type: 'mock_analysis',
      image_quality: 'good',
      detected_features: ['iris', 'pupil', 'sclera'],
    },
  };
};

/**
 * Main analysis function using ONNX model
 */
export const analyzeImage = async (imageUri: string): Promise<AnalysisResult> => {
  const startTime = Date.now();
  
  try {
    if (!imageUri) {
      throw new ModelError('No image URI provided', 'INVALID_INPUT');
    }

    console.log('Starting image analysis...');

    // Ensure model is loaded
    const status = getModelStatus();
    if (!status.isLoaded) {
      console.log('Loading model...');
      await loadONNXModel();
    }

    // Resize image to model input size
    console.log('Resizing image...');
    const resizedImageUri = await resizeImageForModel(imageUri);

    // Convert to base64
    console.log('Converting to base64...');
    const base64Image = await imageUriToBase64(resizedImageUri);

    // Convert to image data array
    console.log('Preparing image data...');
    const imageData = await base64ToImageData(base64Image, 256, 256);

    // Run inference
    console.log('Running model inference...');
    const inferenceResult = await runInference(imageData, 256, 256);

    const processingTime = (Date.now() - startTime) / 1000;

    // Map to AnalysisResult
    const result: AnalysisResult = {
      result: inferenceResult.outcome,
      confidence: inferenceResult.confidence,
      timestamp: new Date().toISOString(),
      imageUri: imageUri,
      details: {
        processedAt: new Date().toISOString(),
        modelVersion: 'EfficientNet-B2-v1.0',
        processing_time: processingTime,
        model_type: 'onnx_eye_disease_classifier',
        image_quality: inferenceResult.confidenceLevel,
        detected_features: inferenceResult.allPredictions.map(p => 
          `${p.class}: ${(p.probability * 100).toFixed(1)}%`
        ),
      },
    };

    console.log('Analysis complete:', result);
    return result;

  } catch (error) {
    console.error('Analysis failed:', error);
    
    if (error instanceof ModelError) {
      throw error;
    }
    throw new ModelError('Analysis pipeline failed', 'PIPELINE_ERROR');
  }
};

/**
 * Analysis with automatic fallback to mock
 */
export const analyzeImageWithFallback = async (imageUri: string): Promise<AnalysisResult> => {
  try {
    return await analyzeImage(imageUri);
  } catch (error) {
    console.warn('ONNX analysis failed, using mock fallback:', error);
    return await mockAnalyzeImage(imageUri);
  }
};

/**
 * Initialize analysis service
 */
export const initializeAnalysisService = async (): Promise<void> => {
  try {
    await loadONNXModel();
    console.log('Analysis service initialized');
  } catch (error) {
    console.error('Failed to initialize analysis service:', error);
    throw new ModelError('Service initialization failed', 'INIT_ERROR');
  }
};

/**
 * Validate image for analysis
 */
export const validateImageForAnalysis = (imageUri: string): boolean => {
  if (!imageUri) return false;
  if (!imageUri.startsWith('file://') && !imageUri.startsWith('data:')) return false;
  return true;
};

/**
 * Get model information
 */
export const getAnalysisModelInfo = () => ({
  version: 'EfficientNet-B2-v1.0',
  type: 'onnx_eye_disease_classifier',
  classes: ['Cataract', 'Diabetic Retinopathy', 'Glaucoma', 'Normal'],
  supportedFormats: ['jpg', 'jpeg', 'png'],
  inputSize: { width: 256, height: 256 },
  confidenceThresholds: {
    high: 0.85,
    medium: 0.60,
    low: 0.60,
  },
});
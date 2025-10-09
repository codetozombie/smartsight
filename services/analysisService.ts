import { ModelError } from '../utils/errors';
import { AnalysisResult, TestOutcome } from '../utils/types';

// Mock analysis function for development/fallback
const mockAnalyzeImage = async (imageUri: string): Promise<AnalysisResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Weighted random result: 75% healthy, 12.5% monitor, 12.5% critical
  const rand = Math.random();
  let randomOutcome: TestOutcome;

  if (rand < 0.75) {
    randomOutcome = 'healthy';
  } else if (rand < 0.875) {
    randomOutcome = 'monitor';
  } else {
    randomOutcome = 'critical';
  }

  const randomConfidence = 0.7 + Math.random() * 0.25; // 70–95% confidence
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
      image_quality: Math.random() > 0.5 ? 'good' : 'fair',
      detected_features: ['iris', 'pupil', 'sclera'],
    },
  };
};

// Main analysis function (currently uses mock, will be updated for ONNX)
export const analyzeImage = async (imageUri: string): Promise<AnalysisResult> => {
  const startTime = Date.now();
  
  try {
    if (!imageUri) {
      throw new ModelError('No image URI provided', 'INVALID_INPUT');
    }

    // For now, use mock analysis
    // TODO: Replace with ONNX model when ready
    const result = await mockAnalyzeImage(imageUri);
    
    const processingTime = Date.now() - startTime;
    
    // Update processing time in details
    return {
      ...result,
      details: {
        ...result.details,
        processing_time: processingTime / 1000,
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

// Analysis with fallback - this is what your AnalysisScreen needs
export const analyzeImageWithFallback = async (imageUri: string): Promise<AnalysisResult> => {
  try {
    // Try main analysis first
    return await analyzeImage(imageUri);
  } catch (error) {
    console.warn('Main analysis failed, using fallback:', error);
    
    // Fallback to mock analysis
    try {
      return await mockAnalyzeImage(imageUri);
    } catch (fallbackError) {
      console.error('Fallback analysis also failed:', fallbackError);
      throw new ModelError('All analysis methods failed', 'ANALYSIS_FAILED');
    }
  }
};

// Utility functions
export const validateImageForAnalysis = (imageUri: string): boolean => {
  if (!imageUri) return false;
  if (!imageUri.startsWith('file://') && !imageUri.startsWith('data:')) return false;
  return true;
};

export const getAnalysisModelInfo = () => ({
  version: 'mock-1.0.0',
  type: 'mock_classifier',
  supportedFormats: ['jpg', 'jpeg', 'png'],
  inputSize: { width: 224, height: 224 },
});

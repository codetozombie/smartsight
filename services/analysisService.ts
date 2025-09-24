import { ModelError } from '../utils/errors';
import { AnalysisResult, TestOutcome } from '../utils/types';

// Mock analysis function for development
const mockAnalyzeImage = async (imageUri: string): Promise<AnalysisResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock random result for testing
  const outcomes: TestOutcome[] = ['healthy', 'monitor', 'critical'];
  const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  const randomConfidence = 0.7 + Math.random() * 0.25; // 70-95% confidence
  
  const now = new Date().toISOString();
  
  return {
    result: randomOutcome,
    confidence: randomConfidence,
    timestamp: now,
    imageUri: imageUri,
    details: {
      processedAt: now, // Ensure this is always a string
      modelVersion: '1.0.0', // Ensure this is always a string
      processing_time: 0, // Will be updated by analyzeImage function
      analysis_method: 'mock_analysis',
      image_quality: Math.random() > 0.5 ? 'good' : 'fair',
      detected_features: ['iris', 'pupil', 'sclera'],
    },
  };
};

export const analyzeImage = async (imageUri: string): Promise<AnalysisResult> => {
  const startTime = Date.now();
  
  try {
    if (!imageUri) {
      throw new ModelError('No image URI provided', 'INVALID_INPUT');
    }

    const result = await mockAnalyzeImage(imageUri);
    
    const processingTime = Date.now() - startTime;
    const currentTime = new Date().toISOString();
    
    // Create a properly typed AnalysisResult with all required properties
    const analysisResult: AnalysisResult = {
      result: result.result,
      confidence: result.confidence,
      timestamp: result.timestamp,
      imageUri: result.imageUri,
      details: {
        processedAt: result.details?.processedAt ?? currentTime,
        modelVersion: result.details?.modelVersion ?? '1.0.0',
        processing_time: processingTime / 1000,
        // Add any additional properties safely
        ...(result.details || {}),
      },
    };
    
    return analysisResult;
  } catch (error) {
    console.error('Analysis failed:', error);
    
    if (error instanceof ModelError) {
      throw error;
    }
    throw new ModelError('Analysis pipeline failed', 'PIPELINE_ERROR');
  }
};

// Additional utility functions
export const validateImage = (imageUri: string): boolean => {
  if (!imageUri) return false;
  if (!imageUri.startsWith('file://') && !imageUri.startsWith('data:')) return false;
  return true;
};

export const getModelInfo = () => ({
  version: '1.0.0',
  type: 'mock_classifier',
  supportedFormats: ['jpg', 'jpeg', 'png'],
  inputSize: { width: 224, height: 224 },
});
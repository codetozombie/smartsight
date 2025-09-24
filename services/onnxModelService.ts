import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import { Platform } from 'react-native';
import { ModelError } from '../utils/errors';
import { TestOutcome } from '../utils/types';

class OnnxModelService {
  private session: InferenceSession | null = null;
  private modelPath: string;

  constructor() {
    // For Expo SDK 54, use require for bundled assets
    this.modelPath = require('../assets/models/eye_model.onnx');
  }

  async initialize(): Promise<void> {
    try {
      if (this.session) return;

      console.log('Initializing ONNX model...');
      
      // Updated for ONNX Runtime React Native v1.22.0
      this.session = await InferenceSession.create(this.modelPath, {
        executionProviders: Platform.OS === 'ios' ? ['cpu'] : ['cpu'], // Adjust based on your needs
      });
      
      console.log('ONNX model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ONNX model:', error);
      throw new ModelError('Model initialization failed', 'MODEL_INIT_ERROR');
    }
  }

  async preprocessImage(imageUri: string): Promise<Tensor> {
    try {
      // This is a simplified version - you'll need actual image processing
      const tensorSize = 3 * 224 * 224; // RGB * width * height
      const tensorData = new Float32Array(tensorSize);
      
      // Normalize pixel values (0-1 range) - replace with actual image processing
      for (let i = 0; i < tensorSize; i++) {
        tensorData[i] = Math.random();
      }
      
      return new Tensor('float32', tensorData, [1, 3, 224, 224]);
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      throw new ModelError('Image preprocessing failed', 'PREPROCESSING_ERROR');
    }
  }

  async predict(inputTensor: Tensor): Promise<{ outcome: TestOutcome; confidence: number }> {
    try {
      if (!this.session) {
        await this.initialize();
      }

      if (!this.session) {
        throw new ModelError('Model not initialized', 'MODEL_NOT_INITIALIZED');
      }

      // Updated for v1.22.0 - input names may vary based on your model
      const feeds = { input: inputTensor }; // Adjust 'input' to your model's input name
      const results = await this.session.run(feeds);
      
      // Process output - adjust based on your model's output format
      const outputKey = Object.keys(results)[0]; // Get first output
      const output = results[outputKey] as Tensor;
      const predictions = output.data as Float32Array;
      
      const { outcome, confidence } = this.interpretPredictions(predictions);
      
      return { outcome, confidence };
    } catch (error) {
      console.error('Model prediction failed:', error);
      throw new ModelError('Prediction failed', 'PREDICTION_ERROR');
    }
  }

  private interpretPredictions(predictions: Float32Array): { outcome: TestOutcome; confidence: number } {
    const outcomes: TestOutcome[] = ['healthy', 'monitor', 'critical'];
    
    let maxIndex = 0;
    let maxValue = predictions[0];
    
    for (let i = 1; i < Math.min(predictions.length, outcomes.length); i++) {
      if (predictions[i] > maxValue) {
        maxValue = predictions[i];
        maxIndex = i;
      }
    }
    
    return {
      outcome: outcomes[maxIndex] || 'healthy',
      confidence: Math.min(maxValue, 1.0) // Ensure confidence is between 0-1
    };
  }

  async dispose(): Promise<void> {
    if (this.session) {
      await this.session.release();
      this.session = null;
    }
  }
}

export const onnxModelService = new OnnxModelService();
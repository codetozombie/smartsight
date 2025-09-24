import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import { Image } from 'react-native';
import { ModelError } from '../utils/errors';
import { TestOutcome } from '../utils/types';

class OnnxModelService {
  private session: InferenceSession | null = null;
  private modelPath: string;

  constructor() {
    // Reference the model file - Metro will handle bundling
    this.modelPath = require('../assets/models/eye_model.onnx');
  }

  async initialize(): Promise<void> {
    try {
      if (this.session) return; // Already initialized

      console.log('Initializing ONNX model...');
      this.session = await InferenceSession.create(this.modelPath);
      console.log('ONNX model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ONNX model:', error);
      throw new ModelError('Model initialization failed', 'MODEL_INIT_ERROR');
    }
  }

  async preprocessImage(imageUri: string): Promise<Tensor> {
    try {
      // Get image dimensions and data
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Convert to tensor format expected by your model
      // This is a simplified version - you'll need to adjust based on your model's requirements
      const imageData = await this.imageToTensor(imageUri);
      
      return new Tensor('float32', imageData, [1, 3, 224, 224]); // Adjust dimensions as needed
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      throw new ModelError('Image preprocessing failed', 'PREPROCESSING_ERROR');
    }
  }

  private async imageToTensor(imageUri: string): Promise<Float32Array> {
    return new Promise((resolve, reject) => {
      Image.getSize(
        imageUri,
        (width, height) => {
          // Create canvas-like processing for React Native
          // This is a simplified version - you might need react-native-image-processing
          // or similar library for actual image processing
          
          // For now, return dummy tensor data - replace with actual image processing
          const tensorSize = 3 * 224 * 224; // RGB * width * height
          const tensorData = new Float32Array(tensorSize);
          
          // Normalize pixel values (0-1 range)
          for (let i = 0; i < tensorSize; i++) {
            tensorData[i] = Math.random(); // Replace with actual pixel processing
          }
          
          resolve(tensorData);
        },
        (error) => reject(error)
      );
    });
  }

  async predict(inputTensor: Tensor): Promise<{ outcome: TestOutcome; confidence: number }> {
    try {
      if (!this.session) {
        await this.initialize();
      }

      if (!this.session) {
        throw new ModelError('Model not initialized', 'MODEL_NOT_INITIALIZED');
      }

      // Run inference
      const feeds = { input: inputTensor }; // Adjust input name as needed
      const results = await this.session.run(feeds);
      
      // Process output - adjust based on your model's output format
      const output = results.output as Tensor; // Adjust output name as needed
      const predictions = output.data as Float32Array;
      
      // Interpret predictions based on your model
      const { outcome, confidence } = this.interpretPredictions(predictions);
      
      return { outcome, confidence };
    } catch (error) {
      console.error('Model prediction failed:', error);
      throw new ModelError('Prediction failed', 'PREDICTION_ERROR');
    }
  }

  private interpretPredictions(predictions: Float32Array): { outcome: TestOutcome; confidence: number } {
    // This depends on your model's output format
    // Assuming 3-class classification: [healthy, monitor, critical]
    
    const outcomes: TestOutcome[] = ['healthy', 'monitor', 'critical'];
    
    // Find the class with highest probability
    let maxIndex = 0;
    let maxValue = predictions[0];
    
    for (let i = 1; i < predictions.length; i++) {
      if (predictions[i] > maxValue) {
        maxValue = predictions[i];
        maxIndex = i;
      }
    }
    
    return {
      outcome: outcomes[maxIndex] || 'healthy',
      confidence: maxValue
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
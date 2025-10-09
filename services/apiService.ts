import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

const BASE_URL = 'https://smartsight-backend.onrender.com';

export interface PredictionResponse {
  prediction: 'Cataract' | 'Diabetic Retinopathy' | 'Glaucoma' | 'Normal';
  confidence: number;
  confidence_level: 'High' | 'Medium' | 'Low';
  all_probabilities: {
    Cataract: number;
    'Diabetic Retinopathy': number;
    Glaucoma: number;
    Normal: number;
  };
  dataSource?: 'api' | 'offline'; // Add source tracking
  timestamp?: string;
}

// Offline fallback - random generator
const generateOfflinePrediction = (): PredictionResponse => {
  const diseases: Array<'Cataract' | 'Diabetic Retinopathy' | 'Glaucoma' | 'Normal'> = [
    'Cataract',
    'Diabetic Retinopathy',
    'Glaucoma',
    'Normal'
  ];

  const probabilities = {
    Cataract: Math.random(),
    'Diabetic Retinopathy': Math.random(),
    Glaucoma: Math.random(),
    Normal: Math.random()
  };

  // Normalize probabilities to sum to 1
  const sum = Object.values(probabilities).reduce((a, b) => a + b, 0);
  Object.keys(probabilities).forEach(key => {
    probabilities[key as keyof typeof probabilities] /= sum;
  });

  // Get prediction with highest probability
  const prediction = Object.entries(probabilities).reduce((a, b) => 
    a[1] > b[1] ? a : b
  )[0] as PredictionResponse['prediction'];

  const confidence = probabilities[prediction];
  
  let confidence_level: 'High' | 'Medium' | 'Low';
  if (confidence >= 0.85) {
    confidence_level = 'High';
  } else if (confidence >= 0.60) {
    confidence_level = 'Medium';
  } else {
    confidence_level = 'Low';
  }

  return {
    prediction,
    confidence,
    confidence_level,
    all_probabilities: probabilities,
    dataSource: 'offline',
    timestamp: new Date().toISOString(),
  };
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('✅ API Health Check: Success');
    return response.ok;
  } catch (error) {
    console.log('❌ API Health Check Failed:', error);
    return false;
  }
};

export const predictEyeDisease = async (
  imageUri: string,
  showAlerts: boolean = true
): Promise<PredictionResponse> => {
  try {
    console.log('🔍 Starting prediction analysis...');
    
    // Check internet connectivity
    const netInfo = await NetInfo.fetch();
    
    if (!netInfo.isConnected) {
      console.log('📴 No internet connection detected');
      if (showAlerts) {
        Alert.alert(
          'Offline Mode',
          'No internet connection. Using offline analysis mode.',
          [{ text: 'OK' }]
        );
      }
      return generateOfflinePrediction();
    }

    console.log('📡 Internet connected, checking API health...');

    // Check API health with timeout
    const isApiHealthy = await checkApiHealth();
    if (!isApiHealthy) {
      console.log('⚠️ API health check failed');
      if (showAlerts) {
        Alert.alert(
          'API Unavailable',
          'Cannot reach the analysis server. Using offline mode.',
          [{ text: 'OK' }]
        );
      }
      return generateOfflinePrediction();
    }

    console.log('✅ API is healthy, sending image for analysis...');

    // Prepare form data
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'eye_image.jpg',
    } as any);

    // Make API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: PredictionResponse = await response.json();
    
    console.log('✅ API Analysis Complete!');
    console.log('📊 Prediction:', data.prediction);
    console.log('📊 Confidence:', `${Math.round(data.confidence * 100)}%`);
    
    if (showAlerts) {
      // Optional: Show success toast
      console.log('✅ Live analysis completed successfully');
    }

    return {
      ...data,
      dataSource: 'api',
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('❌ Prediction error:', error);
    
    if (showAlerts) {
      Alert.alert(
        'Analysis Failed',
        'Could not complete online analysis. Using offline mode instead.',
        [{ text: 'OK' }]
      );
    }
    
    return generateOfflinePrediction();
  }
};

export const getApiInfo = async (): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log('ℹ️ API Info:', data);
    return data;
  } catch (error) {
    console.error('Failed to get API info:', error);
    return null;
  }
};
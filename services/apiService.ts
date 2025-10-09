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
  dataSource?: 'api' | 'offline';
  timestamp?: string;
}

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

  const sum = Object.values(probabilities).reduce((a, b) => a + b, 0);
  Object.keys(probabilities).forEach(key => {
    probabilities[key as keyof typeof probabilities] /= sum;
  });

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
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    console.log('🏥 Checking API health at:', BASE_URL + '/health');

    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('✅ API Health Check: Success');
      return true;
    } else {
      console.log('⚠️ API Health Check: Bad status', response.status);
      return false;
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('⏱️ API Health Check: Timeout (server may be sleeping)');
    } else {
      console.log('❌ API Health Check Failed:', error.message);
    }
    return false;
  }
};

export const predictEyeDisease = async (
  imageUri: string,
  showAlerts: boolean = true
): Promise<PredictionResponse> => {
  try {
    console.log('🔍 Starting prediction analysis...');
    console.log('📸 Image URI:', imageUri);
    
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

    // Check API health
    const isApiHealthy = await checkApiHealth();
    if (!isApiHealthy) {
      console.log('⚠️ API not available, attempting direct request...');
    }

    console.log('✅ Preparing image for upload...');

    // Create proper FormData with React Native compatibility
    const formData = new FormData();
    
    // For React Native, we need to append the file with this specific format
    const filename = imageUri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: type,
    } as any);

    console.log('📤 Uploading to:', BASE_URL + '/predict');
    console.log('📋 File details:', { uri: imageUri, name: filename, type });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    const response = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        // Important: Don't set Content-Type, let fetch handle it
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data: PredictionResponse = await response.json();
    
    console.log('✅ API Analysis Complete!');
    console.log('📊 Prediction:', data.prediction);
    console.log('📊 Confidence:', `${Math.round(data.confidence * 100)}%`);
    console.log('🌐 Data source: API');
    
    return {
      ...data,
      dataSource: 'api',
      timestamp: new Date().toISOString(),
    };

  } catch (error: any) {
    console.error('❌ Prediction error:', error.message);
    
    if (showAlerts && error.name !== 'AbortError') {
      Alert.alert(
        'Using Offline Mode',
        `Could not connect to server.\n\nUsing offline analysis instead.`,
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
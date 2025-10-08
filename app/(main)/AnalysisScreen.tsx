import { Colors, Spacing, Typography } from '@/constants/theme';
import { analyzeImageWithFallback } from '../../services/analysisService';
import { saveAnalysisResult } from '@/utils/storage';
import type { AnalysisResult } from '@/utils/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

// ✅ Add default export
export default function AnalysisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUri: string }>();
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Preparing image...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.imageUri) {
      Alert.alert('Error', 'No image provided');
      router.back();
      return;
    }

    performAnalysis();
  }, [params.imageUri]);

  const performAnalysis = async () => {
    try {
      setError(null);

      // Step 1: Initialize (10%)
      setProgress(10);
      setStatusMessage('Loading AI model...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Preprocessing (30%)
      setProgress(30);
      setStatusMessage('Processing image...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Running inference (60%)
      setProgress(60);
      setStatusMessage('Analyzing eye health...');

      const result: AnalysisResult = await analyzeImageWithFallback(params.imageUri);

      // Step 4: Processing results (90%)
      setProgress(90);
      setStatusMessage('Finalizing results...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Save to history
      console.log('Saving analysis result to history...');
      await saveAnalysisResult(result);
      console.log('Result saved successfully');

      // Step 5: Complete (100%)
      setProgress(100);
      setStatusMessage('Analysis complete!');

      // Navigate to results
      setTimeout(() => {
        router.replace({
          pathname: '/(main)/ResultScreen',
          params: {
            imageUri: result.imageUri,
            prediction: result.result,
            confidence: result.confidence.toString(),
            className: result.details.detected_features?.[0] || result.result,
            timestamp: result.timestamp,
          },
        });
      }, 500);

    } catch (error) {
      console.error('Analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setError(errorMessage);
      
      Alert.alert(
        'Analysis Failed',
        errorMessage + '\n\nWould you like to try again?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => router.back(),
          },
          {
            text: 'Retry',
            onPress: () => performAnalysis(),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <View style={styles.pulsingCircle}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Analyzing Image</Text>
        <Text style={styles.statusText}>{statusMessage}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Our AI is analyzing your eye image using advanced deep learning models.
            This may take a few moments.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.large,
  },
  animationContainer: {
    marginBottom: Spacing.extraLarge,
  },
  pulsingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.sizes.xxxlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.medium,
    textAlign: 'center',
  },
  statusText: {
    fontSize: Typography.sizes.large,
    color: Colors.textSecondary,
    marginBottom: Spacing.extraLarge,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  progressBackground: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.small,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: Spacing.medium,
    borderRadius: 8,
    marginTop: Spacing.medium,
    width: '100%',
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.medium,
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: Spacing.extraLarge,
    paddingHorizontal: Spacing.medium,
  },
  infoText: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
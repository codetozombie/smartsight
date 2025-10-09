import { predictEyeDisease, PredictionResponse } from '../../services/apiService';
import { Button } from '@/components/Button';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function AnalysisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const imageUri = typeof params.imageUri === 'string' ? params.imageUri : '';
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dotOpacity1 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity2 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity3 = useRef(new Animated.Value(0.3)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (imageUri) {
      startAnalysis();
      startAnimations();
    } else {
      setError('No image provided for analysis');
      setIsAnalyzing(false);
    }

    return () => {
      dotOpacity1.stopAnimation();
      dotOpacity2.stopAnimation();
      dotOpacity3.stopAnimation();
      pulseAnimation.stopAnimation();
    };
  }, [imageUri]);

  const startAnimations = () => {
    const animateDots = () => {
      const duration = 500;

      Animated.sequence([
        Animated.timing(dotOpacity1, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity2, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity3, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity1, {
          toValue: 0.3,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity2, {
          toValue: 0.3,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity3, {
          toValue: 0.3,
          duration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isAnalyzing) {
          animateDots();
        }
      });
    };

    const animatePulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateDots();
    animatePulse();
  };

  const startAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      console.log('🔍 Starting analysis for image:', imageUri);
      
      // Use the API service instead of analyzeImageWithFallback
      const result = await predictEyeDisease(imageUri, true);
      
      console.log('✅ Analysis complete:', result);
      
      setAnalysisResult(result);
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetry = () => {
    startAnalysis();
    startAnimations();
  };

  const handleViewResults = () => {
    if (analysisResult) {
      router.push({
        pathname: '/(main)/ResultScreen',
        params: {
          imageUri,
          prediction: analysisResult.prediction,
          confidence: analysisResult.confidence.toString(),
          confidenceLevel: analysisResult.confidence_level,
          probabilities: JSON.stringify(analysisResult.all_probabilities),
          dataSource: analysisResult.dataSource || 'unknown',
          timestamp: analysisResult.timestamp || new Date().toISOString(),
        },
      });
    }
  };

  const handleGoHome = () => {
    router.push('/(main)/HomeScreen');
  };

  const getResultColor = (prediction: string) => {
    switch (prediction) {
      case 'Normal':
        return Colors.success;
      case 'Cataract':
      case 'Diabetic Retinopathy':
      case 'Glaucoma':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  const getResultMessage = (prediction: string) => {
    switch (prediction) {
      case 'Normal':
        return 'Your eye appears healthy!';
      case 'Cataract':
        return 'Cataract detected';
      case 'Diabetic Retinopathy':
        return 'Diabetic Retinopathy detected';
      case 'Glaucoma':
        return 'Glaucoma detected';
      default:
        return 'Analysis complete';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Animated.View style={[
            styles.imageWrapper,
            { transform: [{ scale: pulseAnimation }] }
          ]}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
            {isAnalyzing && <View style={styles.imageOverlay} />}
          </Animated.View>
        </View>

        <View style={styles.statusContainer}>
          {isAnalyzing ? (
            <>
              <Text style={styles.analyzingText}>
                Analyzing your eye
                <Animated.Text style={[styles.dot, { opacity: dotOpacity1 }]}>.</Animated.Text>
                <Animated.Text style={[styles.dot, { opacity: dotOpacity2 }]}>.</Animated.Text>
                <Animated.Text style={[styles.dot, { opacity: dotOpacity3 }]}>.</Animated.Text>
              </Text>
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={styles.spinner}
              />
              <Text style={styles.subText}>
                Connecting to AI analysis server...
              </Text>
            </>
          ) : error ? (
            <>
              <Text style={styles.errorText}>Analysis Failed</Text>
              <Text style={styles.errorSubText}>{error}</Text>
              <Button
                title="Try Again"
                onPress={handleRetry}
                variant="primary"
                style={styles.actionButton}
              />
              <Button
                title="Go Home"
                onPress={handleGoHome}
                variant="secondary"
                style={styles.actionButton}
              />
            </>
          ) : analysisResult ? (
            <>
              <Text style={[
                styles.resultText,
                { color: getResultColor(analysisResult.prediction) }
              ]}>
                {getResultMessage(analysisResult.prediction)}
              </Text>
              <Text style={styles.confidenceText}>
                Confidence: {Math.round(analysisResult.confidence * 100)}%
              </Text>
              {analysisResult.dataSource && (
                <Text style={styles.sourceText}>
                  Source: {analysisResult.dataSource === 'api' ? '🌐 Online Analysis' : '📱 Offline Mode'}
                </Text>
              )}
              <Button
                title="View Detailed Results"
                onPress={handleViewResults}
                variant="primary"
                style={styles.actionButton}
              />
              <Button
                title="Analyze Another"
                onPress={() => router.push('/(main)/CameraScreen')}
                variant="secondary"
                style={styles.actionButton}
              />
            </>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.large,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxxlarge,
  },
  imageWrapper: {
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
  },
  statusContainer: {
    alignItems: 'center',
    paddingBottom: Spacing.xxxlarge,
  },
  analyzingText: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.large,
    textAlign: 'center',
  },
  dot: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  spinner: {
    marginVertical: Spacing.large,
  },
  subText: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  resultText: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    marginBottom: Spacing.medium,
  },
  confidenceText: {
    fontSize: Typography.sizes.large,
    color: Colors.textSecondary,
    marginBottom: Spacing.small,
    textAlign: 'center',
  },
  sourceText: {
    fontSize: Typography.sizes.medium,
    color: Colors.primary,
    marginBottom: Spacing.xxxlarge,
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
  },
  errorText: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.semibold,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.medium,
  },
  errorSubText: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxlarge,
    lineHeight: 24,
  },
  actionButton: {
    marginVertical: Spacing.small,
    minWidth: 200,
  },
});
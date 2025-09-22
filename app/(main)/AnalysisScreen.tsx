import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
import Button from '../../components/Button';
import { mockAnalyzeImage, ModelError } from '../../utils/model';
import { AnalysisResult, AnalysisScreenParams } from '../../utils/types';

const AnalysisScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<AnalysisScreenParams>();
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Animation values
  const dotOpacity1 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity2 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity3 = useRef(new Animated.Value(0.3)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (params.imageUri) {
      startAnalysis();
      startAnimations();
    } else {
      setError('No image provided for analysis');
      setIsAnalyzing(false);
    }

    return () => {
      // Cleanup animations
      dotOpacity1.stopAnimation();
      dotOpacity2.stopAnimation();
      dotOpacity3.stopAnimation();
      pulseAnimation.stopAnimation();
    };
  }, [params.imageUri]);

  const startAnimations = () => {
    // Animated dots
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

    // Pulse animation for image
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
      
      // Use mock analysis for development, replace with real analysis
      const result = await mockAnalyzeImage(params.imageUri!);
      // const result = await analyzeImage(params.imageUri!);
      
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      
      if (error instanceof ModelError) {
        setError(error.message);
      } else {
        setError('Analysis failed. Please try again.');
      }
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
        pathname: '/(main)/ResultsScreen',
        params: {
          result: analysisResult.result,
          confidence: analysisResult.confidence.toString(),
          timestamp: analysisResult.timestamp,
          imageUri: analysisResult.imageUri,
        },
      });
    }
  };

  const handleGoHome = () => {
    router.push('/(main)/HomeScreen');
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'healthy':
        return '#10b981';
      case 'monitor':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getResultMessage = (result: string) => {
    switch (result) {
      case 'healthy':
        return 'Your eye appears healthy!';
      case 'monitor':
        return 'Monitor recommended';
      case 'critical':
        return 'Immediate attention needed';
      default:
        return 'Analysis complete';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Image Display */}
        <View style={styles.imageContainer}>
          <Animated.View style={[
            styles.imageWrapper,
            { transform: [{ scale: pulseAnimation }] }
          ]}>
            <Image
              source={{ uri: params.imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
            {isAnalyzing && <View style={styles.imageOverlay} />}
          </Animated.View>
        </View>

        {/* Analysis Status */}
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
                color="#06b6d4"
                style={styles.spinner}
              />
              <Text style={styles.subText}>
                Using advanced AI to analyze your image
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
                { color: getResultColor(analysisResult.result) }
              ]}>
                {getResultMessage(analysisResult.result)}
              </Text>
              <Text style={styles.confidenceText}>
                Confidence: {Math.round(analysisResult.confidence * 100)}%
              </Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  imageWrapper: {
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
    shadowColor: '#000',
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
    paddingBottom: 40,
  },
  analyzingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  dot: {
    fontSize: 24,
    fontWeight: '600',
    color: '#06b6d4',
  },
  spinner: {
    marginVertical: 20,
  },
  subText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  confidenceText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorSubText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  actionButton: {
    marginVertical: 8,
    minWidth: 200,
  },
});

export default AnalysisScreen;
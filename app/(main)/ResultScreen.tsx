import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/Button';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';
import { EyeResult, ResultDisplayConfig, ResultScreenParams, SavedResult } from '../../utils/types';

const ResultScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<ResultScreenParams>();
  const { saveNewResult } = useAsyncStorage();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const resultConfig: Record<EyeResult, ResultDisplayConfig> = {
    healthy: {
      icon: 'checkmark-circle',
      color: '#10b981',
      title: 'Healthy Eye Detected',
      description: 'Your eye analysis shows normal, healthy patterns. No immediate concerns detected.',
      recommendations: [
        'Continue regular eye check-ups',
        'Maintain good eye hygiene',
        'Protect eyes from UV light',
        'Take regular breaks from screens',
      ],
    },
    monitor: {
      icon: 'warning',
      color: '#f59e0b',
      title: 'Monitor Recommended',
      description: 'Some patterns detected that may require monitoring. Consider consulting an eye care professional.',
      recommendations: [
        'Schedule an eye examination',
        'Monitor any symptoms',
        'Avoid eye strain',
        'Follow up in 2-4 weeks',
      ],
    },
    critical: {
      icon: 'close-circle',
      color: '#ef4444',
      title: 'Immediate Attention Needed',
      description: 'Critical patterns detected that require immediate professional attention.',
      recommendations: [
        'Contact an eye care professional immediately',
        'Do not delay seeking medical attention',
        'Avoid activities that strain your eyes',
        'Keep a record of any symptoms',
      ],
    },
  };

  const currentResult = params.result as EyeResult;
  const confidence = parseFloat(params.confidence);
  const config = resultConfig[currentResult];

  const handleSaveResult = async () => {
    try {
      setIsSaving(true);
      
      const resultToSave: SavedResult = {
        id: Date.now().toString(),
        result: currentResult,
        confidence,
        timestamp: params.timestamp,
        imageUri: params.imageUri,
      };

      const success = await saveNewResult(resultToSave);
      
      if (success) {
        setIsSaved(true);
        Alert.alert(
          'Result Saved',
          'Your analysis result has been saved successfully.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Save Failed',
          'Failed to save the result. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Save result error:', error);
      Alert.alert(
        'Save Failed',
        'An error occurred while saving the result.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetake = () => {
    router.push('/(main)/CameraScreen');
  };

  const handleGoHome = () => {
    router.push('/(main)/HomeScreen');
  };

  const handleViewHistory = () => {
    router.push('/(main)/HistoryScreen');
  };

  const getConfidenceLevel = (confidence: number): string => {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoHome} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analysis Results</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: params.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Result Status */}
        <View style={[styles.resultCard, { borderColor: config.color }]}>
          <View style={styles.resultHeader}>
            <Ionicons name={config.icon as any} size={48} color={config.color} />
            <Text style={[styles.resultTitle, { color: config.color }]}>
              {config.title}
            </Text>
          </View>
          
          <Text style={styles.resultDescription}>
            {config.description}
          </Text>

          {/* Confidence Score */}
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence Level</Text>
            <View style={styles.confidenceBar}>
              <View
                style={[
                  styles.confidenceFill,
                  {
                    width: `${confidence * 100}%`,
                    backgroundColor: getConfidenceColor(confidence),
                  },
                ]}
              />
            </View>
            <View style={styles.confidenceInfo}>
              <Text style={[styles.confidenceText, { color: getConfidenceColor(confidence) }]}>
                {Math.round(confidence * 100)}% ({getConfidenceLevel(confidence)})
              </Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          {config.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="checkmark" size={16} color={config.color} />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        {/* Timestamp */}
        <View style={styles.timestampContainer}>
          <Text style={styles.timestampText}>
            Analyzed on {new Date(params.timestamp).toLocaleString()}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={isSaved ? "Result Saved ✓" : "Save Result"}
            onPress={handleSaveResult}
            variant="primary"
            loading={isSaving}
            disabled={isSaved}
            style={[
              styles.actionButton,
              styles.saveButton,
              isSaved && styles.savedButton,
            ]}
          />

          <View style={styles.secondaryButtonsContainer}>
            <Button
              title="Retake"
              onPress={handleRetake}
              variant="secondary"
              style={[styles.actionButton, styles.retakeButton]}
            />

            <Button
              title="Home"
              onPress={handleGoHome}
              variant="secondary"
              style={[styles.actionButton, styles.homeButton]}
            />
          </View>

          {isSaved && (
            <Button
              title="View History"
              onPress={handleViewHistory}
              variant="tertiary"
              style={styles.actionButton}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
  },
  resultDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  confidenceContainer: {
    marginTop: 16,
  },
  confidenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceInfo: {
    alignItems: 'flex-end',
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  timestampContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timestampText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  buttonContainer: {
    gap: 12,
  },
  actionButton: {
    marginVertical: 4,
  },
  saveButton: {
    backgroundColor: '#06b6d4',
  },
  savedButton: {
    backgroundColor: '#10b981',
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeButton: {
    backgroundColor: '#f59e0b',
    flex: 1,
  },
  homeButton: {
    backgroundColor: '#64748b',
    flex: 1,
  },
});

export default ResultScreen;
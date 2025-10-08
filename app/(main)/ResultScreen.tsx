import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    imageUri: string;
    prediction: string;
    confidence: string;
    className?: string;
    timestamp?: string;
  }>();

  const confidence = parseFloat(params.confidence || '0');
  const prediction = params.prediction || 'unknown';
  const className = params.className || prediction;

  const getResultConfig = () => {
    switch (prediction) {
      case 'healthy':
        return {
          color: Colors.success,
          icon: 'checkmark-circle' as const,
          title: 'Healthy Eyes',
          message: 'No significant issues detected. Your eyes appear healthy!',
          recommendation: 'Continue regular eye check-ups and maintain good eye health habits.',
        };
      case 'monitor':
        return {
          color: Colors.warning,
          icon: 'alert-circle' as const,
          title: 'Needs Monitoring',
          message: 'Some concerns detected. Regular monitoring recommended.',
          recommendation: 'Schedule a check-up with an eye care professional for further evaluation.',
        };
      case 'critical':
        return {
          color: Colors.error,
          icon: 'warning' as const,
          title: 'Attention Required',
          message: 'Potential eye health issues detected.',
          recommendation: 'Please consult with an eye care professional as soon as possible.',
        };
      default:
        return {
          color: Colors.textSecondary,
          icon: 'help-circle' as const,
          title: 'Unknown Result',
          message: 'Unable to determine eye health status.',
          recommendation: 'Please retake the image or consult with a professional.',
        };
    }
  };

  const config = getResultConfig();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Result</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: params.imageUri }} style={styles.image} />
      </View>

      {/* Result Card */}
      <View style={[styles.resultCard, { borderColor: config.color }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
          <Ionicons name={config.icon} size={48} color={config.color} />
        </View>
        <Text style={[styles.resultTitle, { color: config.color }]}>{config.title}</Text>
        <Text style={styles.resultMessage}>{config.message}</Text>

        {/* Confidence */}
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Confidence Level</Text>
          <View style={styles.confidenceBar}>
            <View
              style={[
                styles.confidenceFill,
                { width: `${confidence * 100}%`, backgroundColor: config.color },
              ]}
            />
          </View>
          <Text style={styles.confidenceText}>{(confidence * 100).toFixed(1)}%</Text>
        </View>

        {/* Disease Class (if available) */}
        {className && className !== prediction && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Detected Condition:</Text>
            <Text style={styles.detailValue}>{className}</Text>
          </View>
        )}
      </View>

      {/* Recommendation */}
      <View style={styles.recommendationCard}>
        <View style={styles.recommendationHeader}>
          <Ionicons name="information-circle" size={24} color={Colors.primary} />
          <Text style={styles.recommendationTitle}>Recommendation</Text>
        </View>
        <Text style={styles.recommendationText}>{config.recommendation}</Text>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimerCard}>
        <Ionicons name="warning" size={20} color={Colors.warning} />
        <Text style={styles.disclaimerText}>
          This analysis is for informational purposes only and should not replace professional medical advice.
          Always consult with a qualified eye care professional for diagnosis and treatment.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(main)/HomeScreen')}
        >
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(main)/CameraScreen')}
        >
          <Ionicons name="camera" size={20} color={Colors.primary} />
          <Text style={styles.secondaryButtonText}>New Analysis</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.extraLarge,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.small,
  },
  headerTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  headerRight: {
    width: 40,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.large,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  resultCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.large,
    padding: Spacing.large,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  resultTitle: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.small,
  },
  resultMessage: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.large,
  },
  confidenceContainer: {
    width: '100%',
    marginTop: Spacing.medium,
  },
  confidenceLabel: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.small,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.small,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Spacing.medium,
    paddingTop: Spacing.medium,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailLabel: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  recommendationCard: {
    backgroundColor: Colors.primaryLight,
    marginHorizontal: Spacing.large,
    padding: Spacing.large,
    borderRadius: 12,
    marginBottom: Spacing.large,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  recommendationTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    marginLeft: Spacing.small,
  },
  recommendationText: {
    fontSize: Typography.sizes.medium,
    color: Colors.text,
    lineHeight: 22,
  },
  disclaimerCard: {
    flexDirection: 'row',
    backgroundColor: Colors.warningLight || '#fef3c7',
    marginHorizontal: Spacing.large,
    padding: Spacing.medium,
    borderRadius: 8,
    marginBottom: Spacing.large,
  },
  disclaimerText: {
    flex: 1,
    fontSize: Typography.sizes.small,
    color: Colors.warningDark || '#92400e',
    marginLeft: Spacing.small,
    lineHeight: 18,
  },
  actionsContainer: {
    paddingHorizontal: Spacing.large,
    gap: Spacing.medium,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.medium,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.medium,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: Spacing.small,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
  },
});
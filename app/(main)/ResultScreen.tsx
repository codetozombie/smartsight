import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, Image, ScrollView, Share, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import Icon from '@/components/Icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Strings } from '@/constants/strings';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function ResultScreen() {
  const router = useRouter();
  const { imageUri, prediction, confidence, details } = useLocalSearchParams<{
    imageUri: string;
    prediction: string;
    confidence: string;
    details: string;
  }>();

  const confidenceValue = parseFloat(confidence || '0');
  const analysisDetails = details ? JSON.parse(details) : {};

  const getConfidenceColor = (conf: number) => {
    if (conf > 0.8) return Colors.success;
    if (conf > 0.6) return Colors.warning;
    return Colors.error;
  };

  const getConfidenceText = (conf: number) => {
    if (conf > 0.8) return Strings.analysis.highConfidence;
    if (conf > 0.6) return Strings.analysis.mediumConfidence;
    return Strings.analysis.lowConfidence;
  };

  const getRecommendations = (pred: string, conf: number) => {
    if (conf < 0.6) {
      return [
        Strings.results.lowConfidenceRec1,
        Strings.results.lowConfidenceRec2,
        Strings.results.lowConfidenceRec3,
      ];
    }
    
    // You can add more specific recommendations based on the prediction
    return [
      Strings.results.generalRec1,
      Strings.results.generalRec2,
      Strings.results.generalRec3,
    ];
  };

  const handleShare = async () => {
    try {
      const message = `${Strings.results.shareMessage}\n\n${Strings.analysis.prediction}: ${prediction}\n${Strings.analysis.confidence}: ${Math.round(confidenceValue * 100)}%\n\n${Strings.appName}`;
      
      await Share.share({
        message,
        title: Strings.results.shareTitle,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert(Strings.errors.shareError, Strings.errors.tryAgain);
    }
  };

  const handleRetakePhoto = () => {
    router.push('/(main)/CameraScreen');
  };

  const handleViewHistory = () => {
    router.push('/(main)/HistoryScreen');
  };

  const recommendations = getRecommendations(prediction || '', confidenceValue);

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      
      <Header
        title={Strings.results.title}
        showBackButton={true}
        onBack={() => router.back()}
        rightComponent={
          <Button
            title={Strings.common.share}
            variant="ghost"
            onPress={handleShare}
            style={styles.shareButton}
          />
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image */}
        {imageUri && (
          <Card style={styles.imageCard}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          </Card>
        )}

        {/* Main Result */}
        <Card style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={[
              styles.statusIcon,
              { backgroundColor: getConfidenceColor(confidenceValue) }
            ]}>
              <Icon 
                name={confidenceValue > 0.8 ? "check" : confidenceValue > 0.6 ? "warning" : "error"} 
                size={32} 
                color={Colors.white} 
              />
            </View>
            <ThemedText style={styles.resultTitle}>
              {Strings.results.analysisComplete}
            </ThemedText>
          </View>

          <View style={styles.predictionContainer}>
            <ThemedText style={styles.predictionLabel}>
              {Strings.analysis.prediction}
            </ThemedText>
            <ThemedText style={styles.predictionText}>
              {prediction}
            </ThemedText>
          </View>

          <View style={styles.confidenceContainer}>
            <View style={styles.confidenceHeader}>
              <ThemedText style={styles.confidenceLabel}>
                {Strings.analysis.confidence}
              </ThemedText>
              <View style={[
                styles.confidenceBadge,
                { backgroundColor: getConfidenceColor(confidenceValue) }
              ]}>
                <ThemedText style={styles.confidenceValue}>
                  {Math.round(confidenceValue * 100)}%
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.confidenceBar}>
              <View 
                style={[
                  styles.confidenceFill,
                  { 
                    width: `${confidenceValue * 100}%`,
                    backgroundColor: getConfidenceColor(confidenceValue)
                  }
                ]}
              />
            </View>
            
            <ThemedText style={styles.confidenceDescription}>
              {getConfidenceText(confidenceValue)}
            </ThemedText>
          </View>
        </Card>

        {/* Recommendations */}
        <Card style={styles.recommendationsCard}>
          <View style={styles.sectionHeader}>
            <Icon name="info" size={24} color={Colors.primary} />
            <ThemedText style={styles.sectionTitle}>
              {Strings.results.recommendations}
            </ThemedText>
          </View>
          
          <View style={styles.recommendationsList}>
            {recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.bulletPoint} />
                <ThemedText style={styles.recommendationText}>
                  {rec}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>

        {/* Analysis Details */}
        {analysisDetails && Object.keys(analysisDetails).length > 0 && (
          <Card style={styles.detailsCard}>
            <View style={styles.sectionHeader}>
              <Icon name="search" size={24} color={Colors.primary} />
              <ThemedText style={styles.sectionTitle}>
                {Strings.results.technicalDetails}
              </ThemedText>
            </View>
            
            <View style={styles.detailsContainer}>
              {Object.entries(analysisDetails).map(([key, value]) => (
                <View key={key} style={styles.detailItem}>
                  <ThemedText style={styles.detailKey}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </ThemedText>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Disclaimer */}
        <Card style={styles.disclaimerCard} variant="outlined">
          <View style={styles.disclaimerHeader}>
            <Icon name="warning" size={20} color={Colors.warning} />
            <ThemedText style={styles.disclaimerTitle}>
              {Strings.results.disclaimer}
            </ThemedText>
          </View>
          <ThemedText style={styles.disclaimerText}>
            {Strings.results.disclaimerText}
          </ThemedText>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title={Strings.results.takeAnother}
            variant="primary"
            onPress={handleRetakePhoto}
            style={styles.actionButton}
          />
          <Button
            title={Strings.results.viewHistory}
            variant="outline"
            onPress={handleViewHistory}
            style={styles.actionButton}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.medium,
  },
  shareButton: {
    paddingHorizontal: 0,
    minWidth: 60,
  },
  imageCard: {
    marginTop: Spacing.medium,
    marginBottom: Spacing.large,
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  resultCard: {
    marginBottom: Spacing.large,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  resultTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    textAlign: 'center',
  },
  predictionContainer: {
    marginBottom: Spacing.large,
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.small,
  },
  predictionText: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  confidenceContainer: {
    marginBottom: Spacing.medium,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  confidenceLabel: {
    fontSize: Typography.sizes.medium,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  confidenceBadge: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: 16,
  },
  confidenceValue: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
    color: Colors.white,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.small,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceDescription: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  recommendationsCard: {
    marginBottom: Spacing.large,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  sectionTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginLeft: Spacing.small,
  },
  recommendationsList: {
    gap: Spacing.small,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 8,
    marginRight: Spacing.small,
  },
  recommendationText: {
    flex: 1,
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  detailsCard: {
    marginBottom: Spacing.large,
  },
  detailsContainer: {
    gap: Spacing.small,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailKey: {
    fontSize: Typography.sizes.small,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
    flex: 1,
  },
  detailValue: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    flex: 2,
    textAlign: 'right',
  },
  disclaimerCard: {
    marginBottom: Spacing.large,
    borderColor: Colors.warning,
    backgroundColor: Colors.warningLight,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  disclaimerTitle: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
    color: Colors.warningDark,
    marginLeft: Spacing.small,
  },
  disclaimerText: {
    fontSize: Typography.sizes.small,
    color: Colors.warningDark,
    lineHeight: 18,
  },
  actionButtons: {
    gap: Spacing.medium,
    marginBottom: Spacing.medium,
  },
  actionButton: {
    marginHorizontal: 0,
  },
  bottomSpacing: {
    height: Spacing.extraLarge,
  },
});
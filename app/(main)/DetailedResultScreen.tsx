import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { deleteRecord, getRecordById } from '../../utils/storage';
import {
  DetailedResultScreenParams,
  EyeResult,
  RecommendationConfig,
  SavedRecord
} from '../../utils/types';

const DetailedResultScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<DetailedResultScreenParams>();
  
  const [record, setRecord] = useState<SavedRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecord();
  }, [params.recordId]);

  const loadRecord = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (params.recordId) {
        const savedRecord = await getRecordById(params.recordId);
        if (savedRecord) {
          setRecord(savedRecord);
        } else {
          // Fallback to params if record not found in storage
          const fallbackRecord: SavedRecord = {
            id: params.recordId,
            date: params.date,
            result: params.result as EyeResult,
            imageUri: params.imageUri,
            confidence: params.confidence ? parseFloat(params.confidence) : undefined,
            notes: params.notes,
          };
          setRecord(fallbackRecord);
        }
      }
    } catch (err) {
      console.error('Failed to load record:', err);
      setError('Failed to load record details');
    } finally {
      setIsLoading(false);
    }
  };

  const getResultConfig = (result: EyeResult): RecommendationConfig & {
    color: string;
    icon: string;
    title: string;
  } => {
    switch (result) {
      case 'healthy':
        return {
          color: '#10b981',
          icon: 'checkmark-circle',
          title: 'Healthy Eye Detected',
          description: 'Your eye analysis shows normal, healthy patterns with no immediate concerns detected.',
          recommendations: [
            'Continue regular eye check-ups every 1-2 years',
            'Maintain good eye hygiene practices',
            'Protect your eyes from UV light with sunglasses',
            'Take regular breaks from digital screens (20-20-20 rule)',
            'Maintain a healthy diet rich in vitamins A, C, and E',
          ],
          urgencyLevel: 'low',
          followUpDays: 365,
        };
      case 'monitor':
        return {
          color: '#f59e0b',
          icon: 'warning',
          title: 'Monitor Recommended',
          description: 'Some patterns detected that may require monitoring. While not immediately concerning, professional consultation is recommended.',
          recommendations: [
            'Schedule an eye examination within 2-4 weeks',
            'Monitor any changes in vision or eye comfort',
            'Avoid prolonged eye strain and screen time',
            'Keep a log of any symptoms or changes',
            'Follow up with regular monitoring',
          ],
          urgencyLevel: 'medium',
          followUpDays: 28,
        };
      case 'critical':
        return {
          color: '#ef4444',
          icon: 'close-circle',
          title: 'Immediate Attention Needed',
          description: 'Critical patterns detected that require immediate professional medical attention. Please consult an eye care professional as soon as possible.',
          recommendations: [
            'Contact an eye care professional immediately',
            'Do not delay seeking medical attention',
            'Avoid activities that may strain your eyes',
            'Keep a detailed record of any symptoms',
            'Follow all medical advice strictly',
          ],
          urgencyLevel: 'high',
          followUpDays: 1,
        };
    }
  };

  const handleDeleteRecord = () => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this analysis record? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    if (!record) return;

    try {
      setIsDeleting(true);
      await deleteRecord(record.id);
      
      Alert.alert(
        'Record Deleted',
        'The analysis record has been successfully deleted.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      console.error('Delete failed:', err);
      Alert.alert(
        'Delete Failed',
        'Failed to delete the record. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleNewAnalysis = () => {
    router.push('/(main)/CameraScreen');
  };

  const handleShareRecord = () => {
    // Implement sharing functionality
    Alert.alert(
      'Share Record',
      'Sharing functionality will be implemented here.',
      [{ text: 'OK' }]
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#06b6d4" />
          <Text style={styles.loadingText}>Loading record...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !record) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Record Not Found</Text>
          <Text style={styles.errorMessage}>
            {error || 'The requested record could not be found.'}
          </Text>
          <Button
            title="Go Back"
            onPress={handleGoBack}
            variant="secondary"
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const config = getResultConfig(record.result);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analysis Details</Text>
          <TouchableOpacity onPress={handleShareRecord} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Saved Photo */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: record.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={[styles.resultBadge, { backgroundColor: config.color }]}>
            <Ionicons name={config.icon as any} size={20} color="#ffffff" />
            <Text style={styles.resultBadgeText}>{record.result.toUpperCase()}</Text>
          </View>
        </View>

        {/* Classification Result */}
        <View style={[styles.classificationCard, { borderColor: config.color }]}>
          <View style={styles.classificationHeader}>
            <Ionicons name={config.icon as any} size={32} color={config.color} />
            <Text style={[styles.classificationTitle, { color: config.color }]}>
              {config.title}
            </Text>
          </View>
          
          <Text style={styles.classificationDescription}>
            {config.description}
          </Text>

          {record.confidence && (
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>Analysis Confidence</Text>
              <View style={styles.confidenceBar}>
                <View
                  style={[
                    styles.confidenceFill,
                    {
                      width: `${record.confidence * 100}%`,
                      backgroundColor: config.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.confidenceText, { color: config.color }]}>
                {Math.round(record.confidence * 100)}%
              </Text>
            </View>
          )}
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsCard}>
          <View style={styles.recommendationsHeader}>
            <Ionicons name="medical" size={24} color="#374151" />
            <Text style={styles.recommendationsTitle}>Medical Recommendations</Text>
          </View>
          
          <View style={[styles.urgencyBadge, styles[`urgency${config.urgencyLevel}`]]}>
            <Text style={[styles.urgencyText, styles[`urgencyText${config.urgencyLevel}`]]}>
              {config.urgencyLevel.toUpperCase()} PRIORITY
            </Text>
          </View>

          {config.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.recommendationBullet}>
                <Text style={styles.recommendationNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}

          {config.followUpDays && (
            <View style={styles.followUpContainer}>
              <Ionicons name="calendar-outline" size={16} color="#6b7280" />
              <Text style={styles.followUpText}>
                Recommended follow-up: {config.followUpDays === 1 ? 'Within 24 hours' : `Within ${config.followUpDays} days`}
              </Text>
            </View>
          )}
        </View>

        {/* Analysis Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Analysis Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formatDate(record.date)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{formatTime(record.date)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Record ID:</Text>
            <Text style={styles.detailValue}>{record.id}</Text>
          </View>

          {record.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.detailLabel}>Notes:</Text>
              <Text style={styles.notesText}>{record.notes}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            title="New Analysis"
            onPress={handleNewAnalysis}
            variant="primary"
            style={styles.actionButton}
          />

          <View style={styles.secondaryActionsContainer}>
            <Button
              title="Back to History"
              onPress={handleGoBack}
              variant="secondary"
              style={[styles.actionButton, styles.secondaryButton]}
            />

            <Button
              title={isDeleting ? "Deleting..." : "Delete Record"}
              onPress={handleDeleteRecord}
              variant="secondary"
              loading={isDeleting}
              disabled={isDeleting}
              style={[styles.actionButton, styles.deleteButton]}
            />
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorButton: {
    minWidth: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerButton: {
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  resultBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  resultBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  classificationCard: {
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
  classificationHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  classificationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  classificationDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  confidenceContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
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
  confidenceText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
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
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 16,
  },
  urgencylow: {
    backgroundColor: '#d1fae5',
  },
  urgencymedium: {
    backgroundColor: '#fef3c7',
  },
  urgencyhigh: {
    backgroundColor: '#fee2e2',
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  urgencyTextlow: {
    color: '#065f46',
  },
  urgencyTextmedium: {
    color: '#92400e',
  },
  urgencyTexthigh: {
    color: '#991b1b',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#06b6d4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  recommendationNumber: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  followUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  followUpText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  notesText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    marginTop: 4,
  },
  actionContainer: {
    gap: 12,
  },
  actionButton: {
    marginVertical: 4,
  },
  secondaryActionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: '#64748b',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    flex: 1,
  },
});

export default DetailedResultScreen;
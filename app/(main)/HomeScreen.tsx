import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getResults } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

// Define colors inline
const Colors = {
  primary: '#0891b2',
  primaryPale: '#ecfeff',
  success: '#059669',
  successLight: '#d1fae5',
  warning: '#d97706',
  warningLight: '#fef3c7',
  error: '#dc2626',
  errorLight: '#fee2e2',
  text: '#111827',
  textSecondary: '#4b5563',
  textTertiary: '#6b7280',
  white: '#ffffff',
  background: '#f9fafb',
  backgroundSecondary: '#f3f4f6',
  borderLight: '#f3f4f6',
};

const Spacing = {
  xxxsmall: 2,
  xxsmall: 4,
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  xxxlarge: 40,
  huge: 48,
};

const Typography = {
  sizes: {
    xxsmall: 11,
    xsmall: 12,
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 24,
    xxxlarge: 28,
  },
  weights: {
    semibold: '600' as const,
    bold: '700' as const,
  },
};

const BorderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  xxlarge: 20,
  full: 9999,
};

// Match the exact type structure from HistoryScreen
interface TestResult {
  id: string;
  outcome: string;
  confidence: number;
  timestamp: string;
  imageUri?: string;
  analysis?: any;
}

export default function HomeScreen() {
  const router = useRouter();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [recentResults, setRecentResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const loadTestResults = async () => {
    try {
      console.log('🔄 Loading test results...');
      
      // Use the same function as HistoryScreen
      const results = await getResults();
      
      console.log('✅ Loaded results count:', results.length);
      if (results.length > 0) {
        console.log('📊 First result:', results[0]);
      }
      
      setTestResults(results);
      
      // Sort by timestamp and get the 3 most recent
      const sorted = [...results]
        .sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return dateB - dateA;
        })
        .slice(0, 3);
      
      console.log('📈 Recent results count:', sorted.length);
      setRecentResults(sorted);
      
    } catch (error) {
      console.error('❌ Error loading test results:', error);
      setTestResults([]);
      setRecentResults([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      
      // Animate fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTestResults();
  }, []);

  // Load data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🎯 Screen focused, loading data...');
      loadTestResults();
    }, [])
  );

  // Also load on mount
  useEffect(() => {
    loadTestResults();
  }, []);

  const handleStartTest = () => router.push('/(main)/CameraScreen');
  const   handleViewHistory = () => router.push('/(main)/HistoryScreen');
  const handleSettings = () => router.push('/(main)/SettingsScreen');
  
  const handleResultPress = (result: TestResult) => {
    router.push({
      pathname: '/(main)/DetailedResultScreen',
      params: {
        resultId: result.id,
        result: result.outcome,
        confidence: result.confidence?.toString(),
        imageUri: result.imageUri || '',
        date: result.timestamp,
      },
    });
  };

  const getHealthScore = () => {
    if (!testResults || testResults.length === 0) return null;
    const healthyCount = testResults.filter(r => 
      r.outcome?.toLowerCase() === 'healthy' || 
      r.outcome?.toLowerCase() === 'normal'
    ).length;
    return Math.round((healthyCount / testResults.length) * 100);
  };

  const healthScore = getHealthScore();

  const getOutcomeDisplay = (outcome: string) => {
    const lowerOutcome = outcome?.toLowerCase() || '';
    if (lowerOutcome === 'healthy' || lowerOutcome === 'normal') return 'Healthy';
    if (lowerOutcome === 'monitor' || lowerOutcome === 'warning') return 'Monitor';
    if (lowerOutcome === 'critical' || lowerOutcome === 'danger') return 'Critical';
    return outcome || 'Unknown';
  };

  const getOutcomeColor = (outcome: string) => {
    const lowerOutcome = outcome?.toLowerCase() || '';
    if (lowerOutcome === 'healthy' || lowerOutcome === 'normal') {
      return { bg: Colors.successLight, color: Colors.success, icon: 'checkmark-circle' };
    }
    if (lowerOutcome === 'monitor' || lowerOutcome === 'warning') {
      return { bg: Colors.warningLight, color: Colors.warning, icon: 'warning' };
    }
    return { bg: Colors.errorLight, color: Colors.error, icon: 'close-circle' };
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Welcome Header */}
        <Animated.View style={[styles.welcomeHeader, { opacity: fadeAnim }]}>
          <View style={styles.gradientContainer}>
            <View style={styles.welcomeContent}>
              <View>
                <ThemedText style={styles.greeting}>Welcome back!</ThemedText>
                <ThemedText style={styles.subtitle}>
                  Let's monitor your eye health
                </ThemedText>
              </View>
              
              {healthScore !== null && (
                <View style={styles.healthScoreContainer}>
                  <View style={styles.scoreCircle}>
                    <ThemedText style={styles.scoreNumber}>{healthScore}</ThemedText>
                    <ThemedText style={styles.scoreLabel}>Eye Score</ThemedText>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard} variant="elevated">
          <ThemedText style={styles.cardTitle}>Quick Actions</ThemedText>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleStartTest}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: Colors.primaryPale }]}
              >
                <Ionicons name="camera" size={28} color={Colors.primary} />
              </View>
              <ThemedText style={styles.actionTitle}>New Scan</ThemedText>
              <ThemedText style={styles.actionDescription}>
                Start analysis
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleViewHistory}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: Colors.successLight }]}
              >
                <Ionicons name="time" size={28} color={Colors.success} />
              </View>
              <ThemedText style={styles.actionTitle}>History</ThemedText>
              <ThemedText style={styles.actionDescription}>
                View records
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleSettings}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: Colors.warningLight }]}
              >
                <Ionicons name="settings" size={28} color={Colors.warning} />
              </View>
              <ThemedText style={styles.actionTitle}>Settings</ThemedText>
              <ThemedText style={styles.actionDescription}>
                Preferences
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Results */}
        <Card style={styles.recentCard} variant="elevated">
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="analytics" size={22} color={Colors.primary} />
              <ThemedText style={styles.cardTitle}>Recent Analysis</ThemedText>
            </View>
            {testResults && testResults.length > 3 && (
              <TouchableOpacity onPress={handleViewHistory}>
                <ThemedText style={styles.viewAllText}>View All</ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <ThemedText style={styles.loadingText}>Loading results...</ThemedText>
            </View>
          ) : recentResults.length > 0 ? (
            <View style={styles.resultsContainer}>
              {recentResults.map((result, index) => {
                const outcomeStyle = getOutcomeColor(result.outcome);
                return (
                  <TouchableOpacity
                    key={result.id}
                    style={[
                      styles.resultItem,
                      index < recentResults.length - 1 && styles.resultItemBorder
                    ]}
                    onPress={() => handleResultPress(result)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.resultLeft}>
                      <View style={[
                        styles.resultIndicator,
                        { backgroundColor: outcomeStyle.bg }
                      ]}>
                        <Ionicons 
                          name={outcomeStyle.icon as any}
                          size={24}
                          color={outcomeStyle.color}
                        />
                      </View>
                      <View style={styles.resultInfo}>
                        <ThemedText style={styles.resultOutcome}>
                          {getOutcomeDisplay(result.outcome)}
                        </ThemedText>
                        <ThemedText style={styles.resultDate}>
                          {new Date(result.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.resultRight}>
                      <View style={styles.confidenceBadge}>
                        <ThemedText style={styles.confidenceText}>
                          {Math.round(result.confidence * 100)}%
                        </ThemedText>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={Colors.textTertiary} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="eye-outline" size={48} color={Colors.textTertiary} />
              </View>
              <ThemedText style={styles.emptyTitle}>No scans yet</ThemedText>
              <ThemedText style={styles.emptyDescription}>
                Start your first eye health analysis
              </ThemedText>
              <Button
                title="Start First Scan"
                onPress={handleStartTest}
                variant="primary"
                style={styles.emptyButton}
              />
            </View>
          )}
        </Card>
        
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
  },
  scrollContent: {
    paddingBottom: Spacing.xxxlarge,
  },
  welcomeHeader: {
    marginBottom: Spacing.large,
  },
  gradientContainer: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: BorderRadius.xxlarge,
    borderBottomRightRadius: BorderRadius.xxlarge,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.xxxlarge,
    paddingHorizontal: Spacing.large,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: Typography.sizes.xxxlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginBottom: Spacing.xxsmall,
  },
  subtitle: {
    fontSize: Typography.sizes.medium,
    color: Colors.white,
    opacity: 0.9,
  },
  healthScoreContainer: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  scoreNumber: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  scoreLabel: {
    fontSize: Typography.sizes.xxsmall,
    color: Colors.white,
    marginTop: Spacing.xxxsmall,
  },
  quickActionsCard: {
    marginHorizontal: Spacing.medium,
    marginTop: -Spacing.xxlarge,
    marginBottom: Spacing.large,
  },
  cardTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.medium,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.small,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    // padding: Spacing.xxsmall,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.small,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.small,
    
  },
  actionTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xxxsmall,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: Typography.sizes.xsmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  recentCard: {
    marginHorizontal: Spacing.medium,
    marginBottom: Spacing.large,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
  },
  viewAllText: {
    fontSize: Typography.sizes.small,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  loadingContainer: {
    padding: Spacing.xlarge,
    alignItems: 'center',
    gap: Spacing.medium,
  },
  loadingText: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
  },
  resultsContainer: {
    gap: Spacing.xxxsmall,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.medium,
  },
  resultItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.medium,
  },
  resultIndicator: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultOutcome: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xxxsmall,
  },
  resultDate: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
  },
  resultRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
  },
  confidenceBadge: {
    backgroundColor: Colors.primaryPale,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.xxsmall,
    borderRadius: BorderRadius.small,
  },
  confidenceText: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxlarge,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xsmall,
  },
  emptyDescription: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.large,
  },
  emptyButton: {
    minWidth: 200,
  },
  bottomSpacing: {
    height: Spacing.large,
  },
});
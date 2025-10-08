import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import Icon from '@/components/Icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useAsyncStorage } from '@/hooks/useAsyncStorage';
import { TestResult } from '@/utils/types';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { data: testResults, isLoading } = useAsyncStorage<TestResult[]>('smartsight_test_results');
  const [recentResults, setRecentResults] = useState<TestResult[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (testResults) {
      const sorted = [...testResults]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 3);
      setRecentResults(sorted);
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [testResults]);

  const handleStartTest = () => router.push('/(main)/CameraScreen');
  const handleViewHistory = () => router.push('/(main)/HistoryScreen');
  const handleSettings = () => router.push('/(main)/SettingsScreen');
  const handleResultPress = (result: TestResult) => {
    router.push({
      pathname: '/(main)/DetailedResultScreen',
      params: {
        resultId: result.id,
        result: result.outcome,
        confidence: result.confidence?.toString(),
        imageUri: result.imageUri,
        date: result.timestamp,
      },
    });
  };

  const getHealthScore = () => {
    if (!testResults || testResults.length === 0) return null;
    const healthyCount = testResults.filter(r => r.outcome === 'healthy').length;
    return Math.round((healthyCount / testResults.length) * 100);
  };

  const healthScore = getHealthScore();

  const renderWelcomeHeader = () => (
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
                <ThemedText style={styles.scoreLabel}>Health Score</ThemedText>
              </View>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );

  const renderQuickActions = () => (
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
  );

  const renderRecentResults = () => (
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
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      ) : recentResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          {recentResults.map((result, index) => (
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
                  { backgroundColor: 
                    result.outcome === 'healthy' ? Colors.successLight :
                    result.outcome === 'monitor' ? Colors.warningLight :
                    Colors.errorLight
                  }
                ]}>
                  <Ionicons 
                    name={
                      result.outcome === 'healthy' ? 'checkmark-circle' :
                      result.outcome === 'monitor' ? 'warning' :
                      'close-circle'
                    }
                    size={24}
                    color={
                      result.outcome === 'healthy' ? Colors.success :
                      result.outcome === 'monitor' ? Colors.warning :
                      Colors.error
                    }
                  />
                </View>
                <View style={styles.resultInfo}>
                  <ThemedText style={styles.resultOutcome}>
                    {result.outcome === 'healthy' ? 'Healthy' :
                     result.outcome === 'monitor' ? 'Monitor' :
                     'Critical'}
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
          ))}
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
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderWelcomeHeader()}
        {renderQuickActions()}
        {renderRecentResults()}
        
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
  
  // Welcome Header
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
    ...Shadows.large,
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
  
  // Quick Actions
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
    gap: Spacing.medium,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.medium,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
  },
  actionDescription: {
    fontSize: Typography.sizes.xsmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  // Recent Results
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
  
  // Empty State
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
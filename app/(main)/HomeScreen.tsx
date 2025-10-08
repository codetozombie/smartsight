import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import Icon from '@/components/Icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAsyncStorage } from '@/hooks/useAsyncStorage';
import { TestResult } from '@/utils/types';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { data: testResults, isLoading } = useAsyncStorage<TestResult[]>('testResults', []);
  const [recentResults, setRecentResults] = useState<TestResult[]>([]);

  useEffect(() => {
    if (testResults && testResults.length > 0) {
      const recent = testResults
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 3);
      setRecentResults(recent);
    }
  }, [testResults]);

  const handleStartTest = () => {
    router.push('/(main)/CameraScreen');
  };

  const handleViewHistory = () => {
    router.push('/(main)/HistoryScreen');
  };

  const handleSettings = () => {
    router.push('/(main)/SettingsScreen');
  };

  const handleResultPress = (result: TestResult) => {
    router.push({
      pathname: '/(main)/DetailedResultScreen',
      params: { resultId: result.id }
    });
  };

  const renderQuickActions = () => (
    <Card style={styles.actionsCard}>
      <ThemedText style={styles.sectionTitle}>
        Quick Actions
      </ThemedText>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleStartTest}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
            <Icon name="camera" size={32} color={Colors.white} />
          </View>
          <ThemedText style={styles.actionText}>
            Start Test
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleViewHistory}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.success }]}>
            <Icon name="history" size={32} color={Colors.white} />
          </View>
          <ThemedText style={styles.actionText}>
            View History
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
          <View style={[styles.actionIcon, { backgroundColor: Colors.warning }]}>
            <Icon name="settings" size={32} color={Colors.white} />
          </View>
          <ThemedText style={styles.actionText}>
            Settings
          </ThemedText>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderRecentResults = () => (
    <Card style={styles.resultsCard}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>
          Recent Results
        </ThemedText>
        {testResults && testResults.length > 3 && (
          <TouchableOpacity onPress={handleViewHistory}>
            <ThemedText style={styles.viewAllText}>
              View All
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>
            Loading...
          </ThemedText>
        </View>
      ) : recentResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          {recentResults.map((result) => (
            <TouchableOpacity
              key={result.id}
              style={styles.resultItem}
              onPress={() => handleResultPress(result)}
            >
              <View style={styles.resultInfo}>
                <ThemedText style={styles.resultDate}>
                  {new Date(result.timestamp).toLocaleDateString()}
                </ThemedText>
                <ThemedText style={styles.resultOutcome}>
                  {result.outcome}
                </ThemedText>
              </View>
              <View style={[
                styles.confidenceIndicator,
                {
                  backgroundColor: result.confidence > 0.8 
                    ? Colors.success
                    : result.confidence > 0.6
                      ? Colors.warning
                      : Colors.error
                }
              ]}>
                <ThemedText style={styles.confidenceText}>
                  {Math.round(result.confidence * 100)}%
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="eye" size={48} color={Colors.textSecondary} />
          <ThemedText style={styles.emptyText}>
            No tests performed yet
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Take your first photo to get started
          </ThemedText>
        </View>
      )}
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      
      <Header
        title="SmartSight"
        showBackButton={false}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.welcomeTitle}>
            Welcome back!
          </ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>
            Ready to analyze your images with advanced AI technology?
          </ThemedText>
        </View>

        {renderQuickActions()}
        {renderRecentResults()}

        {(!testResults || testResults.length === 0) && (
          <View style={styles.getStartedSection}>
            <Button
              title="Get Started"
              variant="primary"
              onPress={handleStartTest}
              style={styles.getStartedButton}
            />
          </View>
        )}
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
  welcomeSection: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.small,
  },
  welcomeTitle: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.small,
  },
  welcomeSubtitle: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  actionsCard: {
    marginBottom: Spacing.large,
  },
  sectionTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.medium,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.small,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  actionText: {
    fontSize: Typography.sizes.small,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
  },
  resultsCard: {
    marginBottom: Spacing.large,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  viewAllText: {
    fontSize: Typography.sizes.small,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
  },
  loadingContainer: {
    padding: Spacing.large,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
  },
  resultsContainer: {
    gap: Spacing.small,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.medium,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultInfo: {
    flex: 1,
  },
  resultDate: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  resultOutcome: {
    fontSize: Typography.sizes.medium,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  confidenceIndicator: {
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: Typography.sizes.small,
    color: Colors.white,
    fontWeight: Typography.weights.semibold,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.extraLarge,
  },
  emptyText: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.medium,
    fontWeight: Typography.weights.medium,
  },
  emptySubtext: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.small,
  },
  getStartedSection: {
    paddingVertical: Spacing.large,
  },
  getStartedButton: {
    marginHorizontal: Spacing.medium,
  },
});
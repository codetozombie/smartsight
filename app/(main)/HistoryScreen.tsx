import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EmptyState from '../../components/EmptyState';
import HistoryItem from '../../components/HistoryItem';
import { deleteResult, getResults } from '../../utils/storage';
import { SavedResult } from '../../utils/types';

const HistoryScreen: React.FC = () => {
  const router = useRouter();
  
  const [results, setResults] = useState<SavedResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadResults = async () => {
    try {
      setError(null);
      const savedResults = await getResults();
      
      // Sort by timestamp (most recent first)
      const sortedResults = savedResults.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setResults(sortedResults);
    } catch (err) {
      console.error('Failed to load results:', err);
      setError('Failed to load history. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadResults();
  };

  const handleResultPress = (result: SavedResult) => {
    router.push({
      pathname: '/(main)/DetailedResultScreen',
      params: {
        resultId: result.id,
        result: result.result,
        confidence: result.confidence.toString(),
        timestamp: result.timestamp,
        imageUri: result.imageUri,
        notes: result.notes || '',
      },
    });
  };

  const handleDeleteResult = async (resultId: string) => {
    Alert.alert(
      'Delete Analysis',
      'Are you sure you want to delete this analysis? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteResult(resultId);
              await loadResults(); // Refresh the list
            } catch (err) {
              console.error('Failed to delete result:', err);
              Alert.alert('Error', 'Failed to delete analysis. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleStartNewAnalysis = () => {
    router.push('/(main)/CameraScreen');
  };

  const getResultsStats = () => {
    const total = results.length;
    const healthy = results.filter(r => (r.result || r.outcome) === 'healthy').length;
    const monitor = results.filter(r => (r.result || r.outcome) === 'monitor').length;
    const critical = results.filter(r => (r.result || r.outcome) === 'critical').length;

    return { total, healthy, monitor, critical };
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadResults();
    }, [])
  );

  const stats = getResultsStats();

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Analysis History</Text>
        <Text style={styles.subtitle}>
          {results.length} {results.length === 1 ? 'analysis' : 'analyses'} performed
        </Text>
      </View>

      {results.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: '#d1fae5' }]}>
            <Text style={[styles.statNumber, { color: '#065f46' }]}>{stats.healthy}</Text>
            <Text style={[styles.statLabel, { color: '#065f46' }]}>Healthy</Text>
          </View>
          
          <View style={[styles.statItem, { backgroundColor: '#fef3c7' }]}>
            <Text style={[styles.statNumber, { color: '#92400e' }]}>{stats.monitor}</Text>
            <Text style={[styles.statLabel, { color: '#92400e' }]}>Monitor</Text>
          </View>
          
          <View style={[styles.statItem, { backgroundColor: '#fee2e2' }]}>
            <Text style={[styles.statNumber, { color: '#991b1b' }]}>{stats.critical}</Text>
            <Text style={[styles.statLabel, { color: '#991b1b' }]}>Critical</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: SavedResult }) => (
    <HistoryItem item={item} onPress={handleResultPress} />
  );

  const renderEmptyState = () => (
    <EmptyState
      title="No Analysis History"
      message="You haven't performed any eye analyses yet. Start your first analysis to see your results here."
      actionText="Start Analysis"
      onAction={handleStartNewAnalysis}
      icon="eye-outline"
    />
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Failed to Load History</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadResults}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#06b6d4" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#06b6d4']}
              tintColor="#06b6d4"
            />
          }
          contentContainerStyle={
            results.length === 0 ? styles.emptyContainer : styles.listContainer
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  retryButton: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default HistoryScreen;
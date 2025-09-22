import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SavedResult } from '../../utils/types';
import { getSavedResults, deleteResult } from '../../utils/storage';
import EmptyState from '../../components/EmptyState';
import HistoryItem from '../../components/HistoryItem';
import Button from '../../components/Button';

const HistoryScreen: React.FC = () => {
  const router = useRouter();
  
  const [results, setResults] = useState<SavedResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadResults = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const savedResults = await getSavedResults();
      
      // Sort by timestamp (newest first)
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
    loadResults(true);
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
      'Delete Result',
      'Are you sure you want to delete this result? This action cannot be undone.',
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
              await loadResults();
              Alert.alert('Success', 'Result deleted successfully.');
            } catch (error) {
              console.error('Delete failed:', error);
              Alert.alert('Error', 'Failed to delete result. Please try again.');
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
    const healthy = results.filter(r => r.result === 'healthy').length;
    const monitor = results.filter(r => r.result === 'monitor').length;
    const critical = results.filter(r => r.result === 'critical').length;

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
      <View style={styles.header}>
        <Text style={styles.title}>Analysis History</Text>
        <TouchableOpacity 
          onPress={handleStartNewAnalysis}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {results.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#10b981' }]}>
                {stats.healthy}
              </Text>
              <Text style={styles.statLabel}>Healthy</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
                {stats.monitor}
              </Text>
              <Text style={styles.statLabel}>Monitor</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#ef4444' }]}>
                {stats.critical}
              </Text>
              <Text style={styles.statLabel}>Critical</Text>
            </View>
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
    />
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button
            title="Try Again"
            onPress={() => loadResults()}
            variant="primary"
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#06b6d4"
            colors={['#06b6d4']}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          results.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#06b6d4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
    minWidth: 120,
  },
});

export default HistoryScreen;
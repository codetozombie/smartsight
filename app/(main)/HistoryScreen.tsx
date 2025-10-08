import { Colors, Spacing, Typography } from '@/constants/theme';
import { clearAnalysisHistory, deleteAnalysisResult, getAnalysisHistory } from '@/utils/storage';
import type { AnalysisResult } from '@/utils/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Load history when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      setLoading(true);
      const historyData = await getAnalysisHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load history:', error);
      Alert.alert('Error', 'Failed to load analysis history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleDelete = (timestamp: string) => {
    Alert.alert(
      'Delete Result',
      'Are you sure you want to delete this analysis result?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAnalysisResult(timestamp);
              loadHistory();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete result');
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'This will permanently delete all your analysis history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAnalysisHistory();
              setHistory([]);
              Alert.alert('Success', 'All history has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = (item: AnalysisResult) => {
    router.push({
      pathname: '/(main)/DetailedResultScreen',
      params: {
        result: JSON.stringify(item),
      },
    });
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'healthy':
        return Colors.success;
      case 'monitor':
        return Colors.warning;
      case 'critical':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'healthy':
        return 'checkmark-circle';
      case 'monitor':
        return 'alert-circle';
      case 'critical':
        return 'warning';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderHistoryItem = ({ item }: { item: AnalysisResult }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleViewDetails(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
        <View style={styles.itemInfo}>
          <View style={styles.resultRow}>
            <Ionicons
              name={getResultIcon(item.result)}
              size={20}
              color={getResultColor(item.result)}
            />
            <Text style={[styles.resultText, { color: getResultColor(item.result) }]}>
              {item.result.charAt(0).toUpperCase() + item.result.slice(1)}
            </Text>
          </View>
          <Text style={styles.confidenceText}>
            Confidence: {(item.confidence * 100).toFixed(1)}%
          </Text>
          <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.timestamp)}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Analysis History</Text>
          <Text style={styles.emptyText}>
            Your analysis results will appear here after you scan an eye image.
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push('/(main)/CameraScreen')}
          >
            <Ionicons name="camera" size={20} color={Colors.white} />
            <Text style={styles.scanButtonText}>Start First Scan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.timestamp}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.medium,
  },
  title: {
    fontSize: Typography.sizes.xxxlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  clearButton: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
  },
  clearButtonText: {
    color: Colors.error,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
  },
  listContent: {
    paddingHorizontal: Spacing.large,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: Spacing.medium,
    backgroundColor: Colors.backgroundSecondary,
  },
  itemInfo: {
    flex: 1,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    marginLeft: 6,
  },
  confidenceText: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
  },
  deleteButton: {
    padding: Spacing.small,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.extraLarge,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginTop: Spacing.large,
    marginBottom: Spacing.small,
  },
  emptyText: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.extraLarge,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderRadius: 12,
    alignItems: 'center',
    gap: Spacing.small,
  },
  scanButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
  },
});
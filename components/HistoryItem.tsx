import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SavedResult } from '../utils/types';

interface HistoryItemProps {
  item: SavedResult;
  onPress: (item: SavedResult) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPress }) => {
  const formatDate = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Unknown Date';
    }
  };

  const formatTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'Unknown Time';
    }
  };

  const getResultConfig = (result: string) => {
    switch (result) {
      case 'healthy':
        return {
          color: '#10b981',
          icon: 'checkmark-circle',
          label: 'Healthy',
        };
      case 'monitor':
        return {
          color: '#f59e0b',
          icon: 'warning',
          label: 'Monitor',
        };
      case 'critical':
        return {
          color: '#ef4444',
          icon: 'close-circle',
          label: 'Critical',
        };
      default:
        return {
          color: '#6b7280',
          icon: 'help-circle',
          label: 'Unknown',
        };
    }
  };

  const config = getResultConfig(item.outcome);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Image */}
        <View style={styles.imageContainer}>
          {item.imageUri ? (
            <Image
              source={{ uri: item.imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="image-outline" size={24} color="#9ca3af" />
            </View>
          )}
          
          <View style={[styles.resultBadge, { backgroundColor: config.color }]}>
            <Ionicons name={config.icon as any} size={12} color="#ffffff" />
          </View>
        </View>

        {/* Details */}
        <View style={styles.details}>
          <View style={styles.headerRow}>
            <Text style={[styles.resultText, { color: config.color }]}>
              {config.label}
            </Text>
            <Text style={styles.dateText}>
              {formatDate(item.timestamp)}
            </Text>
          </View>

          <Text style={styles.timeText}>
            {formatTime(item.timestamp)}
          </Text>

          {item.confidence && (
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>Confidence: </Text>
              <Text style={[styles.confidenceValue, { color: config.color }]}>
                {Math.round(item.confidence * 100)}%
              </Text>
            </View>
          )}
        </View>

        {/* Arrow */}
        <View style={styles.arrow}>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  details: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  arrow: {
    marginLeft: 12,
  },
});

export default HistoryItem;
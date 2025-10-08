import { useOnboardingStatus } from '@/hooks/useAsyncStorage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

interface OnboardingItemProps {
  item: OnboardingSlide;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Smart Detection',
    description: 'Instantly identify objects and analyze images with our advanced AI technology.',
    icon: 'eye-outline',
    iconColor: '#06b6d4',
  },
  {
    id: '2',
    title: 'Real-time Analysis',
    description: 'Get immediate insights and detailed analysis of your captured images.',
    icon: 'analytics-outline',
    iconColor: '#10b981',
  },
  {
    id: '3',
    title: 'Save & Share',
    description: 'Store your analysis results and share them with others seamlessly.',
    icon: 'share-outline',
    iconColor: '#f59e0b',
  },
];

const OnboardingItem: React.FC<OnboardingItemProps> = ({ item }) => {
  return (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={item.icon} 
          size={120} 
          color={item.iconColor} 
        />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);
  const { markComplete } = useOnboardingStatus();

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      await markComplete();
      router.replace('/(main)/HomeScreen');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/(main)/HomeScreen');
    }
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  const isLastSlide = currentIndex === onboardingData.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />

      {renderPagination()}

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.nextButton,
            isLastSlide && styles.getStartedButton,
          ]}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  slide: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#06b6d4',
    width: 20,
  },
  inactiveDot: {
    backgroundColor: '#d1d5db',
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  nextButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedButton: {
    backgroundColor: '#10b981',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
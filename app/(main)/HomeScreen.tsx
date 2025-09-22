import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from '../../components/Button';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const handleStartTest = () => {
    router.push('/(main)/CameraScreen');
  };

  const handleViewHistory = () => {
    router.push('/(main)/HistoryScreen');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>SmartSight</Text>
          <Text style={styles.subtitle}>AI-Powered Image Analysis</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back!</Text>
          <Text style={styles.welcomeText}>
            Ready to analyze your images with advanced AI technology?
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* Main CTA */}
          <Button
            title="Start Test"
            onPress={handleStartTest}
            variant="primary"
            size="large"
            style={styles.primaryButton}
          />

          {/* Secondary Actions */}
          <View style={styles.secondaryButtonsContainer}>
            <Button
              title="View History"
              onPress={handleViewHistory}
              variant="secondary"
              size="medium"
              style={styles.secondaryButton}
            />

            <Button
              title="Settings"
              onPress={handleSettings}
              variant="secondary"
              size="medium"
              style={styles.secondaryButton}
            />
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Quick Analysis</Text>
            <Text style={styles.infoText}>
              Get instant results with our advanced machine learning models
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Secure & Private</Text>
            <Text style={styles.infoText}>
              Your images are processed locally and never stored on our servers
            </Text>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#06b6d4',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  welcomeSection: {
    marginBottom: 50,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    marginBottom: 20,
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
  },
  infoSection: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 20,
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
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default HomeScreen;
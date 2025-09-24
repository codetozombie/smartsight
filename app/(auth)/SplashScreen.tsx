import Icon from '@/components/Icon';
import { Strings } from '@/constants/strings';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useOnboardingStatus } from '@/hooks/useAsyncStorage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const { isComplete, isLoading } = useOnboardingStatus();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isComplete) {
          router.replace('/(main)/HomeScreen');
        } else {
          router.replace('/(auth)/Onboarding');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isComplete, router]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={Colors.primary} />
      
      <View style={styles.logoContainer}>
        <View style={styles.iconBackground}>
          <Icon name="👁️" size={64} color={Colors.white} />
        </View>
        <Text style={styles.title}>
          {Strings.app.name}
        </Text>
        <Text style={styles.subtitle}>
          {Strings.app.tagline}
        </Text>
      </View>

      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.white} />
        <Text style={styles.loadingText}>
          {Strings.common.loading}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {Strings.app.tagline}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.extraLarge,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.large,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: Typography.sizes.xxxlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.small,
  },
  subtitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.medium,
    color: Colors.primaryLight,
    textAlign: 'center',
    maxWidth: 280,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  loadingText: {
    fontSize: Typography.sizes.medium,
    color: Colors.white,
    marginTop: Spacing.medium,
    fontWeight: Typography.weights.medium,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.sizes.small,
    color: Colors.primaryLight,
    textAlign: 'center',
    opacity: 0.8,
  },
});
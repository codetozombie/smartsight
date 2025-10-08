import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';

interface SettingsOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  showArrow?: boolean;
}

export default function SettingsIndexScreen() {
  const router = useRouter();

  const settingsOptions: SettingsOption[] = [
    { 
      id: '1', 
      title: 'About SmartSight', 
      subtitle: 'App information and version',
      icon: 'information-circle-outline',
      route: '/settings/AboutScreen'
    },
    { 
      id: '2', 
      title: 'Privacy Policy', 
      subtitle: 'How we handle your data',
      icon: 'shield-checkmark-outline',
      route: '/settings/PrivacyPolicyScreen'
    },
    { 
      id: '3', 
      title: 'Contact Us', 
      subtitle: 'Get help and support',
      icon: 'mail-outline',
      route: '/settings/ContactScreen'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your app preferences</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={() => router.push(option.route)}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={option.icon} size={22} color={Colors.primary} />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  {option.subtitle && (
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  )}
                </View>
              </View>
              {option.showArrow !== false && (
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SmartSight v1.0.0</Text>
          <Text style={styles.footerSubText}>
            Made with ❤️ for better eye health
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.extraLarge,
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.sizes.xxxlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.small,
  },
  subtitle: {
    fontSize: Typography.sizes.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.extraLarge,
  },
  sectionTitle: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.medium,
    marginLeft: Spacing.small,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.large,
    marginBottom: Spacing.small,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.medium,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: Typography.sizes.medium,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.extraLarge,
  },
  footerText: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  footerSubText: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    marginTop: Spacing.small,
    textAlign: 'center',
  },
});
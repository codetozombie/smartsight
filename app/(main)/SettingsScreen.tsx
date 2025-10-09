import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingsOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
  showArrow?: boolean;
}

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState('English');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };

  const handleLanguageChange = () => {
    router.push('/settings/LanguageSreen');
  };

  const handlePrivacyPolicy = () => {
    router.push('/settings/PrivacyPolicyScreen');
  };

  const handleAbout = () => {
    router.push('/settings/AboutScreen');
  };

  const handleContact = () => {
    router.push('/settings/ContactScreen');
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'This will permanently delete all your analysis history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('scanHistory');
              Alert.alert('Success', 'Analysis history has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear history. Please try again.');
            }
          },
        },
      ]
    );
  };

  const settingsOptions: SettingsOption[] = [
    { 
      id: '1', 
      title: 'Change Language', 
      subtitle: `Current: ${currentLanguage}`,
      icon: 'language-outline',
      action: handleLanguageChange,
      showArrow: true
    },
    { 
      id: '2', 
      title: 'Privacy Policy', 
      subtitle: 'View our privacy policy',
      icon: 'shield-checkmark-outline',
      action: handlePrivacyPolicy,
      showArrow: true
    },
    { 
      id: '3', 
      title: 'About', 
      subtitle: 'Learn more about SmartSight',
      icon: 'information-circle-outline',
      action: handleAbout,
      showArrow: true
    },
    { 
      id: '4', 
      title: 'Contact Us', 
      subtitle: 'Get in touch with our team',
      icon: 'mail-outline',
      action: handleContact,
      showArrow: true
    },
    { 
      id: '5', 
      title: 'Clear History', 
      subtitle: 'Delete all scan history',
      icon: 'trash-outline',
      action: handleClearHistory,
      showArrow: false
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {settingsOptions.slice(0, 2).map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.action}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={option.icon} size={20} color={Colors.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionText}>{option.title}</Text>
                  {option.subtitle && (
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  )}
                </View>
              </View>
              {option.showArrow && (
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          {settingsOptions.slice(2, 4).map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.action}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={option.icon} size={20} color={Colors.primary} />
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionText}>{option.title}</Text>
                  {option.subtitle && (
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  )}
                </View>
              </View>
              {option.showArrow && (
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity
            style={[styles.optionItem, styles.dangerOption]}
            onPress={settingsOptions[4].action}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, styles.dangerIconContainer]}>
                <Ionicons name={settingsOptions[4].icon} size={20} color={Colors.error} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionText, styles.dangerText]}>{settingsOptions[4].title}</Text>
                {settingsOptions[4].subtitle && (
                  <Text style={styles.optionSubtitle}>{settingsOptions[4].subtitle}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SmartSight v1.0.0</Text>
          <Text style={styles.footerSubText}>
            Made with ❤️ for better eye health
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.medium,
  },
  title: {
    fontSize: Typography.sizes.xxlarge,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.extraLarge,
    color: Colors.text,
    textAlign: 'center',
  },
  section: {
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
    padding: Spacing.medium,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.medium,
  },
  dangerIconContainer: {
    backgroundColor: `${Colors.error}15`,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: Typography.sizes.medium,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  optionSubtitle: {
    fontSize: Typography.sizes.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dangerOption: {
    borderWidth: 1,
    borderColor: `${Colors.error}20`,
  },
  dangerText: {
    color: Colors.error,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.extraLarge,
    paddingVertical: Spacing.large,
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

export default SettingsScreen;
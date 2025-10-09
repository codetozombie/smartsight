import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = React.useState('English');

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all scan history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('scanHistory');
              Alert.alert('Success', 'History cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const handleChangeLanguage = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        {
          text: 'English',
          onPress: () => {
            setCurrentLanguage('English');
            Alert.alert('Language Changed', 'Language set to English');
          },
        },
        {
          text: 'Spanish',
          onPress: () => {
            setCurrentLanguage('Spanish');
            Alert.alert('Idioma Cambiado', 'Idioma establecido en Español');
          },
        },
        {
          text: 'French',
          onPress: () => {
            setCurrentLanguage('French');
            Alert.alert('Langue Modifiée', 'Langue définie en Français');
          },
        },
        {
          text: 'German',
          onPress: () => {
            setCurrentLanguage('German');
            Alert.alert('Sprache Geändert', 'Sprache auf Deutsch eingestellt');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const settingsOptions = [
    {
      title: 'Change Language',
      subtitle: `Current: ${currentLanguage}`,
      icon: 'language-outline',
      onPress: handleChangeLanguage,
    },
    {
      title: 'Privacy Policy',
      subtitle: 'View our privacy policy',
      icon: 'shield-checkmark-outline',
      onPress: () => router.push('/settings/PrivacyPolicyScreen'),
    },
    {
      title: 'About',
      subtitle: 'Learn more about SmartSight',
      icon: 'information-circle-outline',
      onPress: () => router.push('/settings/AboutScreen'),
    },
    {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team',
      icon: 'mail-outline',
      onPress: () => router.push('/settings/ContactScreen'),
    },
    {
      title: 'Clear History',
      subtitle: 'Delete all scan history',
      icon: 'trash-outline',
      onPress: handleClearHistory,
      danger: true,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your preferences</Text>
      </View>

      <View style={styles.optionsList}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={option.onPress}
          >
            <View style={[styles.iconContainer, option.danger && styles.dangerIcon]}>
              <Ionicons
                name={option.icon as any}
                size={24}
                color={option.danger ? '#FF3B30' : '#007AFF'}
              />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, option.danger && styles.dangerText]}>
                {option.title}
              </Text>
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SmartSight v1.0.0</Text>
        <Text style={styles.footerSubtext}>© 2025 All rights reserved</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  optionsList: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: '#FFE5E5',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000000',
  },
  dangerText: {
    color: '#FF3B30',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    padding: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#C7C7CC',
    marginTop: 4,
  },
});
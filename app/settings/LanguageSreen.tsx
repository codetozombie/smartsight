import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  greeting: string;
}

const LanguageScreen: React.FC = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', greeting: 'Hello' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', greeting: 'Hola' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', greeting: 'Bonjour' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', greeting: 'Hallo' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', greeting: 'Ciao' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', greeting: 'Olá' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', greeting: 'Привет' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', greeting: '你好' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', greeting: 'こんにちは' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', greeting: 'مرحبا' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', greeting: 'नमस्ते' },
    { code: 'tw', name: 'Twi', nativeName: 'Twi', flag: '🇬🇭', greeting: 'Akwaaba' },
  ];

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem('selectedLanguageCode');
      if (saved) {
        setSelectedLanguage(saved);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };

  const handleLanguageSelect = async (language: Language) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', language.name);
      await AsyncStorage.setItem('selectedLanguageCode', language.code);
      setSelectedLanguage(language.code);
      
      Alert.alert(
        '✅ Language Changed',
        `Language has been changed to ${language.name}`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save language preference');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="language" size={50} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Choose Language</Text>
        <Text style={styles.headerSubtitle}>Select your preferred language</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.languageGrid}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageCard,
                selectedLanguage === language.code && styles.languageCardSelected,
              ]}
              onPress={() => handleLanguageSelect(language)}
              activeOpacity={0.7}
            >
              <View style={styles.languageCardTop}>
                <Text style={styles.languageFlag}>{language.flag}</Text>
                {selectedLanguage === language.code && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark-circle" size={24} color="#43e97b" />
                  </View>
                )}
              </View>
              <Text style={styles.languageName}>{language.name}</Text>
              <Text style={styles.languageNative}>{language.nativeName}</Text>
              <Text style={styles.languageGreeting}>{language.greeting}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={40} color="#667eea" />
          <Text style={styles.infoTitle}>Language Support</Text>
          <Text style={styles.infoText}>
            SmartSight supports multiple languages to make the app accessible to users worldwide. 
            Your language preference will be applied throughout the app.
          </Text>
        </View>

        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Ionicons name="bulb" size={20} color="#feca57" />
            <Text style={styles.noteTitle}>Note</Text>
          </View>
          <Text style={styles.noteText}>
            Some features may still be in English as we continue to improve translations. 
            We appreciate your patience!
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginHorizontal: -6,
  },
  languageCard: {
    width: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageCardSelected: {
    borderColor: '#43e97b',
    backgroundColor: '#F0FFF4',
  },
  languageCardTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageFlag: {
    fontSize: 40,
    textAlign: 'center',
    flex: 1,
  },
  checkmark: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  languageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'center',
  },
  languageNative: {
    fontSize: 14,
    color: '#5A6C7D',
    marginBottom: 8,
    textAlign: 'center',
  },
  languageGreeting: {
    fontSize: 12,
    color: '#667eea',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5A6C7D',
    textAlign: 'center',
  },
  noteCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#feca57',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6C7D',
  },
  bottomPadding: {
    height: 24,
  },
});

export default LanguageScreen;
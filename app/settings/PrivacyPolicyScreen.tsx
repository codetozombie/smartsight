import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { SettingsStackParamList } from '../../utils/types';

type Nav = NativeStackNavigationProp<SettingsStackParamList, 'PrivacyPolicyScreen'>;

const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.paragraph}>
          Welcome to SmartSight. Your privacy is important to us. This policy explains how we handle your data.
        </Text>

        <Text style={styles.sectionTitle}>1. Data We Collect</Text>
        <Text style={styles.paragraph}>
          We may process images locally on your device for analysis. Unless you explicitly share or back up data,
          images and results remain on your device.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Data</Text>
        <Text style={styles.paragraph}>
          Image data is used to run on-device analysis and produce results. Saved results are stored using
          AsyncStorage on your device for history and review.
        </Text>

        <Text style={styles.sectionTitle}>3. Third-Party Services</Text>
        <Text style={styles.paragraph}>
          We may use libraries and SDKs necessary for app functionality (camera, on-device inference).
          These do not receive your images unless explicitly stated.
        </Text>

        <Text style={styles.sectionTitle}>4. Your Choices</Text>
        <Text style={styles.paragraph}>
          You can clear your history anytime in Settings. Uninstalling the app removes local data from your device.
        </Text>

        <Text style={styles.sectionTitle}>5. Contact</Text>
        <Text style={styles.paragraph}>
          For questions, see Contact in Settings or email support@smartsight.app.
        </Text>

        <Text style={styles.footer}>Last updated: {new Date().toLocaleDateString()}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#1f2937' },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937', marginTop: 18, marginBottom: 8 },
  paragraph: { fontSize: 16, color: '#64748b', lineHeight: 24, marginBottom: 8 },
  footer: { marginTop: 24, fontSize: 12, color: '#9ca3af' },
});

export default PrivacyPolicyScreen;
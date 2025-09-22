import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import type { SettingsStackParamList } from '../../utils/types';

type Nav = NativeStackNavigationProp<SettingsStackParamList, 'AboutScreen'>;

const AboutScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoWrap}>
          {/* Replace with your real logo */}
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>SmartSight</Text>
          <Text style={styles.version}>Version {version}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Disclaimer</Text>
          <Text style={styles.cardText}>
            SmartSight provides AI-assisted analysis for informational purposes only and does not
            constitute medical advice. Always consult a qualified healthcare professional for
            diagnosis and treatment decisions.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.cardText}>
            Empower everyone with accessible, on-device eye analysis while respecting privacy and
            security.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  topBar: { height: 140, backgroundColor: '#06b6d4' },
  header: {
    position: 'absolute', top: 12, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, marginTop: -60 },
  logoWrap: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 96, height: 96, borderRadius: 20, backgroundColor: '#ffffff' },
  appName: { fontSize: 24, fontWeight: '700', color: '#1f2937', marginTop: 12 },
  version: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  card: {
    backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 6 },
  cardText: { fontSize: 15, color: '#6b7280', lineHeight: 22 },
});

export default AboutScreen;
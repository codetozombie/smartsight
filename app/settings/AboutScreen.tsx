import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import React from 'react';
import { Image, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { SettingsStackParamList } from '../../utils/types';

type Nav = NativeStackNavigationProp<SettingsStackParamList, 'AboutScreen'>;

const AboutScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const openURL = (url: string) => {
    Linking.openURL(url);
  };

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
          <Text style={styles.tagline}>AI-Powered Visual Intelligence</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About SmartSight</Text>
          <Text style={styles.cardText}>
            SmartSight is a cutting-edge mobile application that leverages advanced artificial intelligence
            and machine learning to provide instant object recognition and scene analysis. Our mission is to
            make visual information accessible and actionable for everyone.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Key Features</Text>
          <View style={styles.featureItem}>
            <Ionicons name="camera" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Real-time Object Detection</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="analytics" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Advanced Scene Analysis</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="language" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Multi-language Support</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="time" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Scan History & Analytics</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="cloud-offline" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Offline Capability</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Technology</Text>
          <Text style={styles.cardText}>
            SmartSight uses state-of-the-art deep learning models trained on millions of images to provide
            accurate and fast recognition. Our neural networks are optimized for mobile devices, ensuring
            quick processing times without compromising accuracy.
          </Text>
          <Text style={styles.cardText}>
            • Convolutional Neural Networks (CNN) for image classification{'\n'}
            • YOLO (You Only Look Once) for real-time object detection{'\n'}
            • Natural Language Processing for contextual descriptions{'\n'}
            • Edge computing for privacy and speed
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Team</Text>
          <Text style={styles.cardText}>
            SmartSight is developed by a passionate team of AI researchers, software engineers, and UX
            designers dedicated to making computer vision accessible to everyone. We are based in Ghana
            and committed to innovation in mobile AI technology.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Awards & Recognition</Text>
          <Text style={styles.cardText}>
            • Best AI Mobile App 2024 - Tech Innovation Awards{'\n'}
            • Editor's Choice - Mobile App Store{'\n'}
            • Top 10 AI Applications - AI Conference 2024{'\n'}
            • User's Choice Award - App Excellence Summit
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connect With Us</Text>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openURL('https://twitter.com/smartsight')}
          >
            <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            <Text style={styles.socialText}>Follow us on Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openURL('https://facebook.com/smartsight')}
          >
            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
            <Text style={styles.socialText}>Like us on Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openURL('https://instagram.com/smartsight')}
          >
            <Ionicons name="logo-instagram" size={24} color="#E1306C" />
            <Text style={styles.socialText}>Follow us on Instagram</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2025 SmartSight. All rights reserved.</Text>
          <Text style={styles.legal}>Made with ❤️ in Ghana</Text>
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
  tagline: { fontSize: 16, color: '#007AFF', marginTop: 8, fontStyle: 'italic' },
  card: {
    backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 6 },
  cardText: { fontSize: 15, color: '#6b7280', lineHeight: 22 },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#3C3C43',
    marginLeft: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginBottom: 12,
  },
  socialText: {
    fontSize: 15,
    color: '#000000',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    padding: 30,
  },
  copyright: {
    fontSize: 13,
    color: '#8E8E93',
  },
  legal: {
    fontSize: 12,
    color: '#C7C7CC',
    marginTop: 4,
  },
});

export default AboutScreen;
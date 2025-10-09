import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoContainer}>
          <Ionicons name="eye" size={80} color="#FFFFFF" />
        </View>
        <Text style={styles.appName}>SmartSight</Text>
        <Text style={styles.tagline}>AI-Powered Visual Intelligence</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </LinearGradient>

      {/* Mission Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="rocket" size={24} color="#667eea" />
          <Text style={styles.cardTitle}>Our Mission</Text>
        </View>
        <Text style={styles.cardText}>
          SmartSight leverages cutting-edge artificial intelligence to provide instant object recognition
          and scene analysis. We're making visual information accessible and actionable for everyone,
          empowering users to understand their world better.
        </Text>
      </View>

      {/* Features Grid */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="star" size={24} color="#f093fb" />
          <Text style={styles.cardTitle}>Key Features</Text>
        </View>
        <View style={styles.featuresGrid}>
          {[
            { icon: 'camera', title: 'Real-time Detection', color: '#667eea' },
            { icon: 'analytics', title: 'Scene Analysis', color: '#764ba2' },
            { icon: 'language', title: 'Multi-language', color: '#f093fb' },
            { icon: 'time', title: 'Scan History', color: '#4facfe' },
            { icon: 'cloud-offline', title: 'Offline Mode', color: '#43e97b' },
            { icon: 'shield-checkmark', title: 'Privacy First', color: '#fa709a' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                <Ionicons name={feature.icon as any} size={28} color={feature.color} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Technology Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="hardware-chip" size={24} color="#4facfe" />
          <Text style={styles.cardTitle}>Advanced Technology</Text>
        </View>
        <View style={styles.techList}>
          {[
            { name: 'Convolutional Neural Networks', desc: 'For accurate image classification' },
            { name: 'YOLO Algorithm', desc: 'Real-time object detection' },
            { name: 'NLP Integration', desc: 'Contextual scene descriptions' },
            { name: 'Edge Computing', desc: 'Privacy-focused local processing' },
          ].map((tech, index) => (
            <View key={index} style={styles.techItem}>
              <View style={styles.techBullet} />
              <View style={styles.techContent}>
                <Text style={styles.techName}>{tech.name}</Text>
                <Text style={styles.techDesc}>{tech.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Awards Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="trophy" size={24} color="#feca57" />
          <Text style={styles.cardTitle}>Awards & Recognition</Text>
        </View>
        <View style={styles.awardsList}>
          {[
            { year: '2024', title: 'Best AI Mobile App', org: 'Tech Innovation Awards' },
            { year: '2024', title: "Editor's Choice", org: 'Mobile App Store' },
            { year: '2024', title: 'Top 10 AI Applications', org: 'AI Conference' },
            { year: '2024', title: "User's Choice Award", org: 'App Excellence Summit' },
          ].map((award, index) => (
            <View key={index} style={styles.awardItem}>
              <View style={styles.awardYear}>
                <Text style={styles.awardYearText}>{award.year}</Text>
              </View>
              <View style={styles.awardInfo}>
                <Text style={styles.awardTitle}>{award.title}</Text>
                <Text style={styles.awardOrg}>{award.org}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Social Links */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="share-social" size={24} color="#43e97b" />
          <Text style={styles.cardTitle}>Connect With Us</Text>
        </View>
        <View style={styles.socialGrid}>
          {[
            { name: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2', url: 'https://twitter.com/smartsight' },
            { name: 'Facebook', icon: 'logo-facebook', color: '#4267B2', url: 'https://facebook.com/smartsight' },
            { name: 'Instagram', icon: 'logo-instagram', color: '#E1306C', url: 'https://instagram.com/smartsight' },
            { name: 'LinkedIn', icon: 'logo-linkedin', color: '#0077B5', url: 'https://linkedin.com/company/smartsight' },
          ].map((social, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.socialButton, { borderColor: social.color }]}
              onPress={() => openURL(social.url)}
              activeOpacity={0.8}
            >
              <Ionicons name={social.icon as any} size={24} color={social.color} />
              <Text style={[styles.socialName, { color: social.color }]}>{social.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.copyright}>© 2025 SmartSight. All rights reserved.</Text>
        <Text style={styles.madeWith}>Made with ❤️ in Ghana</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  versionBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  versionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#5A6C7D',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  featureItem: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 12,
    color: '#2C3E50',
    textAlign: 'center',
    fontWeight: '500',
  },
  techList: {
    marginTop: 8,
  },
  techItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  techBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4facfe',
    marginTop: 6,
    marginRight: 12,
  },
  techContent: {
    flex: 1,
  },
  techName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  techDesc: {
    fontSize: 14,
    color: '#5A6C7D',
    lineHeight: 20,
  },
  awardsList: {
    marginTop: 8,
  },
  awardItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  awardYear: {
    backgroundColor: '#feca57',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  awardYearText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  awardInfo: {
    flex: 1,
  },
  awardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  awardOrg: {
    fontSize: 13,
    color: '#5A6C7D',
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  socialButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    margin: 6,
  },
  socialName: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  copyright: {
    fontSize: 13,
    color: '#5A6C7D',
    marginBottom: 8,
  },
  madeWith: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
});
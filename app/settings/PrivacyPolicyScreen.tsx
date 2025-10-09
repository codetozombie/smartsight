import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Section {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  content: string;
  subsections?: { title: string; content: string }[];
}

export default function PrivacyPolicyScreen() {
  const [expandedSection, setExpandedSection] = useState<string | null>('1');

  const sections: Section[] = [
    {
      id: '1',
      title: 'Introduction',
      icon: 'shield-checkmark',
      content: 'Welcome to SmartSight. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.',
    },
    {
      id: '2',
      title: 'Information We Collect',
      icon: 'document-text',
      content: 'We collect various types of information to provide and improve our services:',
      subsections: [
        {
          title: 'Personal Information',
          content: '• Account details (name, email)\n• Profile information\n• User preferences and settings\n• Feedback and correspondence',
        },
        {
          title: 'Automatically Collected Data',
          content: '• Device information (model, OS, identifiers)\n• Usage statistics and analytics\n• Camera access (during scanning only)\n• Location data (with permission)\n• Performance and crash reports',
        },
        {
          title: 'Image & Scan Data',
          content: '• Photos are processed locally on your device\n• Scan results stored locally\n• No images uploaded without your consent\n• Anonymous usage stats for AI improvement',
        },
      ],
    },
    {
      id: '3',
      title: 'How We Use Your Data',
      icon: 'trending-up',
      content: 'Your information helps us:\n\n• Provide and maintain our services\n• Improve user experience\n• Develop new features\n• Analyze usage patterns\n• Communicate updates and support\n• Ensure security and prevent fraud\n• Train AI models (anonymized data only)\n• Comply with legal obligations',
    },
    {
      id: '4',
      title: 'Data Security',
      icon: 'lock-closed',
      content: 'We implement industry-standard security measures:\n\n• End-to-end encryption for data transmission\n• Secure local storage with encryption\n• Regular security audits\n• Access controls and authentication\n• Data minimization principles\n• Most processing occurs locally on your device',
    },
    {
      id: '5',
      title: 'Data Sharing',
      icon: 'share-social',
      content: 'We do NOT sell your personal information. Limited sharing with:\n\n• Service providers (under strict confidentiality)\n• Legal authorities (when required by law)\n• Business partners (with your consent)\n• In merger/acquisition scenarios (users notified)',
    },
    {
      id: '6',
      title: 'Your Privacy Rights',
      icon: 'hand-right',
      content: 'You have the right to:\n\n• Access your personal data\n• Correct inaccurate information\n• Delete your account and data\n• Export your data\n• Opt-out of data collection\n• Withdraw consent anytime\n• Lodge complaints with authorities',
    },
    {
      id: '7',
      title: 'Camera & Permissions',
      icon: 'camera',
      content: 'Camera access is:\n\n• Only active during scanning\n• Never accessed in background\n• Fully controlled by you\n• Revocable in device settings\n\nOther permissions (location, storage) are optional and won\'t affect core features if denied.',
    },
    {
      id: '8',
      title: 'Data Retention',
      icon: 'time',
      content: 'We retain your information only as long as necessary to provide services and comply with legal obligations. You can delete your data anytime through app settings.',
    },
    {
      id: '9',
      title: 'Contact Us',
      icon: 'mail',
      content: 'Questions about privacy?\n\nEmail: privacy@smartsight.com\nAddress: Accra, Ghana\nPhone: +233 XX XXX XXXX\nDPO: dpo@smartsight.com',
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="shield-checkmark" size={50} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <Text style={styles.headerSubtitle}>Last Updated: October 9, 2025</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.id)}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={section.icon} size={22} color="#667eea" />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Ionicons
                name={expandedSection === section.id ? 'chevron-up' : 'chevron-down'}
                size={22}
                color="#5A6C7D"
              />
            </TouchableOpacity>

            {expandedSection === section.id && (
              <View style={styles.sectionContent}>
                <Text style={styles.contentText}>{section.content}</Text>
                {section.subsections?.map((subsection, index) => (
                  <View key={index} style={styles.subsection}>
                    <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                    <Text style={styles.subsectionContent}>{subsection.content}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.footerCard}>
          <Ionicons name="checkmark-circle" size={40} color="#43e97b" />
          <Text style={styles.footerTitle}>Your Privacy Matters</Text>
          <Text style={styles.footerText}>
            By using SmartSight, you acknowledge that you have read and understood this Privacy Policy. 
            We're committed to protecting your data and maintaining your trust.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

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
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  contentText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#5A6C7D',
  },
  subsection: {
    marginTop: 16,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subsectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5A6C7D',
  },
  footerCard: {
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
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5A6C7D',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 24,
  },
});
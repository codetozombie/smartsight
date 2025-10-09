import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: October 9, 2025</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.sectionText}>
          Welcome to SmartSight ("we," "our," or "us"). We are committed to protecting your personal
          information and your right to privacy. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use our mobile application.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.subsectionTitle}>2.1 Information You Provide</Text>
        <Text style={styles.sectionText}>
          • Account information (name, email address){'\n'}
          • Profile information{'\n'}
          • Feedback and correspondence{'\n'}
          • User preferences and settings
        </Text>

        <Text style={styles.subsectionTitle}>2.2 Automatically Collected Information</Text>
        <Text style={styles.sectionText}>
          • Device information (model, operating system, unique identifiers){'\n'}
          • Usage data (features used, time spent, interactions){'\n'}
          • Camera access (only when actively using scanning features){'\n'}
          • Location data (if permission granted){'\n'}
          • Crash reports and performance data
        </Text>

        <Text style={styles.subsectionTitle}>2.3 Image and Scan Data</Text>
        <Text style={styles.sectionText}>
          • Photos captured for analysis are processed locally on your device{'\n'}
          • Scan results and history stored locally{'\n'}
          • Anonymous usage statistics to improve AI models{'\n'}
          • Images are NOT uploaded to our servers unless you explicitly enable cloud backup
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.sectionText}>
          We use the information we collect to:{'\n\n'}
          • Provide and maintain our services{'\n'}
          • Improve and personalize user experience{'\n'}
          • Develop new features and functionality{'\n'}
          • Analyze usage patterns and optimize performance{'\n'}
          • Communicate with you about updates and support{'\n'}
          • Ensure security and prevent fraud{'\n'}
          • Comply with legal obligations{'\n'}
          • Train and improve our AI models (using anonymized data)
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Data Storage and Security</Text>
        <Text style={styles.sectionText}>
          We implement industry-standard security measures to protect your information:{'\n\n'}
          • End-to-end encryption for data transmission{'\n'}
          • Secure local storage with encryption{'\n'}
          • Regular security audits and updates{'\n'}
          • Access controls and authentication{'\n'}
          • Data minimization principles{'\n\n'}
          Most data processing occurs on your device, minimizing data transmission and storage on our servers.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Data Sharing and Disclosure</Text>
        <Text style={styles.sectionText}>
          We do NOT sell your personal information. We may share information with:{'\n\n'}
          • Service providers (analytics, cloud storage) under strict confidentiality{'\n'}
          • Legal authorities when required by law{'\n'}
          • Business partners (only with your consent){'\n'}
          • In case of merger or acquisition (users will be notified)
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Your Privacy Rights</Text>
        <Text style={styles.sectionText}>
          You have the right to:{'\n\n'}
          • Access your personal data{'\n'}
          • Correct inaccurate information{'\n'}
          • Delete your account and data{'\n'}
          • Export your data{'\n'}
          • Opt-out of data collection{'\n'}
          • Withdraw consent at any time{'\n'}
          • Lodge a complaint with data protection authorities
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Camera and Permissions</Text>
        <Text style={styles.sectionText}>
          SmartSight requires camera access to provide core functionality. Camera access is:{'\n\n'}
          • Only active when you use scanning features{'\n'}
          • Never accessed in the background{'\n'}
          • Fully controlled by you{'\n'}
          • Can be revoked in device settings at any time{'\n\n'}
          Other permissions (location, storage) are optional and can be denied without affecting core features.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
        <Text style={styles.sectionText}>
          SmartSight is not intended for children under 13 years of age. We do not knowingly collect
          personal information from children. If you believe we have collected information from a child,
          please contact us immediately.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
        <Text style={styles.sectionText}>
          Your information may be transferred to and processed in countries other than your own. We ensure
          appropriate safeguards are in place to protect your data in compliance with applicable laws.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>10. Data Retention</Text>
        <Text style={styles.sectionText}>
          We retain your information only as long as necessary to provide services and comply with legal
          obligations. You can delete your data at any time through the app settings.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>11. Changes to This Policy</Text>
        <Text style={styles.sectionText}>
          We may update this Privacy Policy from time to time. We will notify you of significant changes
          via email or in-app notification. Continued use of the app after changes constitutes acceptance.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>12. Contact Us</Text>
        <Text style={styles.sectionText}>
          If you have questions about this Privacy Policy, please contact us:{'\n\n'}
          Email: privacy@smartsight.com{'\n'}
          Address: SmartSight Inc., Accra, Ghana{'\n'}
          Phone: +233 XX XXX XXXX{'\n\n'}
          Data Protection Officer: dpo@smartsight.com
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By using SmartSight, you acknowledge that you have read and understood this Privacy Policy.
        </Text>
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
    paddingTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginTop: 12,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#3C3C43',
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    marginTop: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
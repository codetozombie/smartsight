import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { SettingsStackParamList } from '../../utils/types';

type Nav = NativeStackNavigationProp<SettingsStackParamList, 'ContactScreen'>;

const ContactRow: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; value: string; onPress: () => void; }> = ({ icon, label, value, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={22} color="#06b6d4" />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <Text style={styles.rowValue}>{value}</Text>
  </TouchableOpacity>
);

const LinkRow: React.FC<{ title: string; url: string; }> = ({ title, url }) => (
  <TouchableOpacity style={styles.linkRow} onPress={() => Linking.openURL(url)}>
    <Ionicons name="open-outline" size={18} color="#64748b" />
    <Text style={styles.linkText}>{title}</Text>
  </TouchableOpacity>
);

const ContactScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const email = 'support@smartsight.app';
  const phone = '+1 (555) 123-4567';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Get in touch</Text>

          <ContactRow
            icon="mail-outline"
            label="Email"
            value={email}
            onPress={() => Linking.openURL(`mailto:${email}`)}
          />

          <ContactRow
            icon="call-outline"
            label="Phone"
            value={phone}
            onPress={() => Linking.openURL(`tel:${phone.replace(/[^+\d]/g, '')}`)}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resources</Text>
          <LinkRow title="American Academy of Ophthalmology" url="https://www.aao.org/eye-health" />
          <LinkRow title="National Eye Institute" url="https://www.nei.nih.gov/learn-about-eye-health" />
          <LinkRow title="World Health Organization - Vision" url="https://www.who.int/health-topics/blindness-and-vision-loss" />
        </View>

        <Text style={styles.disclaimer}>
          SmartSight is not a medical device. For emergencies or concerning symptoms, contact a healthcare professional.
        </Text>
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
  card: {
    backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { marginLeft: 10, fontSize: 15, color: '#374151', fontWeight: '500' },
  rowValue: { fontSize: 15, color: '#06b6d4', fontWeight: '600' },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  linkText: { marginLeft: 8, color: '#64748b', fontSize: 15, textDecorationLine: 'underline' },
  disclaimer: { marginTop: 10, fontSize: 12, color: '#6b7280', textAlign: 'center' },
});

export default ContactScreen;
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !subject || !message) {
      Alert.alert('Missing Information', 'Please fill in all fields to send your message.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    Alert.alert(
      '✉️ Message Sent!',
      'Thank you for contacting us! Our team will get back to you within 24-48 hours.',
      [
        {
          text: 'OK',
          onPress: () => {
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
          },
        },
      ]
    );
  };

  const contactMethods = [
    {
      icon: 'mail',
      title: 'Email',
      value: 'support@smartsight.com',
      color: '#667eea',
      action: () => Linking.openURL('mailto:support@smartsight.com'),
    },
    {
      icon: 'call',
      title: 'Phone',
      value: '+233 20 192 9434',
      color: '#43e97b',
      action: () => Linking.openURL('tel:+233201929434'),
    },
    {
      icon: 'globe',
      title: 'Website',
      value: 'www.smartsight.com',
      color: '#fa709a',
      action: () => Linking.openURL('https://www.smartsight.com'),
    },
    {
      icon: 'location',
      title: 'Address',
      value: 'Love Lane, Accra, Ghana',
      color: '#4facfe',
      action: null,
    },
  ];

  const officeHours = [
    { days: 'Monday - Friday', hours: '8:00 AM - 6:00 PM (GMT)' },
    { days: 'Saturday', hours: '9:00 AM - 2:00 PM (GMT)' },
    { days: 'Sunday', hours: 'Closed' },
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroIconContainer}>
            <Ionicons name="mail" size={60} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Get in Touch</Text>
          <Text style={styles.heroSubtitle}>We'd love to hear from you</Text>
        </LinearGradient>

        {/* Contact Methods */}
        <View style={styles.methodsContainer}>
          {contactMethods.map((method, index) => (
            <TouchableOpacity
              key={index}
              style={styles.methodCard}
              onPress={method.action || undefined}
              activeOpacity={method.action ? 0.7 : 1}
            >
              <View style={[styles.methodIcon, { backgroundColor: `${method.color}20` }]}>
                <Ionicons name={method.icon as any} size={24} color={method.color} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodValue}>{method.value}</Text>
              </View>
              {method.action && (
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Form */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Ionicons name="chatbubbles" size={24} color="#667eea" />
            <Text style={styles.formTitle}>Send us a Message</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#5A6C7D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#5A6C7D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="john.doe@example.com"
                placeholderTextColor="#C7C7CC"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="bookmark-outline" size={20} color="#5A6C7D" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="What is this about?"
                placeholderTextColor="#C7C7CC"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons name="create-outline" size={20} color="#5A6C7D" style={[styles.inputIcon, styles.textAreaIcon]} />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Tell us more about your inquiry..."
                placeholderTextColor="#C7C7CC"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.submitGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.submitText}>Send Message</Text>
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Office Hours */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="time" size={24} color="#4facfe" />
            <Text style={styles.infoTitle}>Office Hours</Text>
          </View>
          <View style={styles.hoursContainer}>
            {officeHours.map((schedule, index) => (
              <View key={index} style={styles.hourRow}>
                <Text style={styles.hourDays}>{schedule.days}</Text>
                <Text style={styles.hourTime}>{schedule.hours}</Text>
              </View>
            ))}
          </View>
          <View style={styles.emergencyBadge}>
            <Ionicons name="alert-circle" size={18} color="#fa709a" />
            <Text style={styles.emergencyText}>Emergency Support: Available 24/7</Text>
          </View>
        </View>

        {/* FAQ Prompt */}
        <View style={styles.faqCard}>
          <Ionicons name="help-circle" size={40} color="#43e97b" />
          <Text style={styles.faqTitle}>Quick Answers</Text>
          <Text style={styles.faqText}>
            Looking for immediate help? Visit our FAQ section or help center for instant solutions to common questions.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  methodsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 13,
    color: '#5A6C7D',
    marginBottom: 4,
  },
  methodValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  formCard: {
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
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  textAreaIcon: {
    marginTop: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: '#2C3E50',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  submitButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
  },
  infoCard: {
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
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  hoursContainer: {
    marginBottom: 16,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  hourDays: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2C3E50',
  },
  hourTime: {
    fontSize: 15,
    color: '#5A6C7D',
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#fa709a',
    fontWeight: '600',
    marginLeft: 8,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 8,
  },
  faqText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#5A6C7D',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 24,
  },
});
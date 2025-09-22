import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface SettingsOption {
  id: string;
  title: string;
  screen: string;
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  const settingsOptions: SettingsOption[] = [
    { id: '1', title: 'Change Language', screen: 'ChangeLanguage' },
    { id: '2', title: 'Privacy Policy', screen: 'PrivacyPolicy' },
    { id: '3', title: 'About', screen: 'About' },
    { id: '4', title: 'Clear History', screen: 'ClearHistory' },
  ];

  const handleOptionPress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Settings</Text>
        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionItem}
            onPress={() => handleOptionPress(option.screen)}
          >
            <Text style={styles.optionText}>{option.title}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1f2937',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  arrow: {
    fontSize: 18,
    color: '#9ca3af',
  },
});

export default SettingsScreen;
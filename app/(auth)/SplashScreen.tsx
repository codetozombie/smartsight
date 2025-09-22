import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SplashScreenNavigationProp = {
  navigate: (screen: 'Onboarding' | '(main)') => void;
};

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingSeen = await AsyncStorage.getItem('onboardingSeen');
        
        setTimeout(() => {
          if (onboardingSeen === 'true') {
            navigation.navigate('(main)');
          } else {
            navigation.navigate('Onboarding');
          }
        }, 3000);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Default to onboarding if error occurs
        setTimeout(() => {
          navigation.navigate('Onboarding');
        }, 3000);
      }
    };

    checkOnboardingStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Replace with your actual logo image */}
        <Text style={styles.logoText}>SmartSight</Text>
        {/* Uncomment and use actual logo when available
        <Image 
          source={require('../../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06b6d4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
});

export default SplashScreen;
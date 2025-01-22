import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../.expo/types/types';



export default function Landing() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      
      <Image source={require('../../assets/images/MoneyMentorLogoGradient.png')} style={styles.logo} />

      <Text style={styles.title}>Empower Your Wallet, Master Your Future</Text>

      <Text style={styles.subtitle}>
        MoneyMentor simplifies money management with interactive tools, personalized advice, and lessons for all. From budgeting to saving, we help you build financial confidence and achieve your goals. Start mastering your money today!
      </Text>

      <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('auth/SignUp', )}>
        <Text style={styles.buttonStartText}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('screens/Dashboard', )}>
        <Text style={styles.buttonGuestText}>Explore as Guest</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 75,
    height: 75,
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: '600',
    textAlign: 'left',
    color: '#007F82',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'left',
    color: '#707070',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonPrimary: {
    backgroundColor: '#00ADB5',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, 
  },
  buttonSecondary: {
    backgroundColor: '#B9ECEE',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 30,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#00ADB5', 
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, 
  },
  buttonStartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGuestText: {
    color: '#00ADB5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 14,
    color: '#707070',
  },
  loginLink: {
    color: '#00ADB5',
    fontWeight: 'bold',
  },
});

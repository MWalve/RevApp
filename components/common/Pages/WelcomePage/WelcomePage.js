import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, icons }  from '../../../../constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

const WelcomePage = () => {
  const navigation = useNavigation();
  const handleLoginPress = () => {
    navigation.navigate('Dashboard');
  };

  const handleRegisterPress = () => {
    // Handle register button press
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <Image source={icons.whitehomecircle} style={styles.backgroundImage} resizeMode="cover" />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={icons.RevLogo} style={styles.logoImage} resizeMode="contain" />
        </View>
        <Text style={styles.title}>RevBand</Text>
        <Text style={styles.tagline}>Trust Your Gut!</Text>
        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.revblue,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 220,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    width: 500,
    height: 1000,
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    marginBottom: 50, // Adjust the value to increase or decrease the space between the logo and other components
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'black',
    marginBottom: 300,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomePage;

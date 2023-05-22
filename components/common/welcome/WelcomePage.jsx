import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import styles from '../../../components/common/welcome/welcPage.style';
import { COLORS, icons } from '../../../constants';

const WelcomePage = () => {

  const handleLoginPress = () => {
    // Handle login button press
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

export default WelcomePage;

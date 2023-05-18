import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { COLORS, icons, images, SIZES } from '../constants';

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <Image source={icons.whitehomecircle} style={styles.backgroundImage} resizeMode="cover" />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image source={icons.RevLogo} style={styles.logoImage} resizeMode="contain" />
        </View>
        <Text style={styles.title}>RevApp</Text>
        <Text style={styles.tagline}>Trust Your Gut!</Text>
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
    bottom: 200,
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
});

export default Home;

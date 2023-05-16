import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { COLORS, icons, images, SIZES } from '../constants';

const Home = () => {
  return (
    <View style={styles.container}>
      <Image source={icons.whitehomecircle} 
      style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.contentContainer}>
        <Image source={icons.RevLogo} 
        style={styles.logoImage} resizeMode="contain" />
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
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
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
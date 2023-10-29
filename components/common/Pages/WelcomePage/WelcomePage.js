import React , { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { COLORS, icons }  from '../../../../constants';
import { useNavigation } from 'expo-router';
import { KeyboardAvoidingView } from 'react-native-web';

const WelcomePage = () => {
  const navigation = useNavigation();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginPress = () => {
    setIsLoginModalVisible(true);
  };

  const handleRegisterPress = () => {
    setIsLoginModalVisible(true);
  };

  const handleGuestPress = () => {
    navigation.navigate('Dashboard');
  }

  const handleModalClose = () => {
    setIsLoginModalVisible(false);
  };

  const handleLogin = () => {
    // You can handle the login action here, for example, by sending the name to your authentication service.
    // Then, navigate to the dashboard.
    navigation.navigate('Dashboard');
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
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
        <TouchableOpacity style={styles.button2} onPress={handleGuestPress}>
          <Text style={styles.buttonText2}>Login as Guest</Text>
        </TouchableOpacity>
      </View>


      <Modal visible = {isLoginModalVisible} animationType = 'slide' transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={username}
              value={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={password}
              value={setPassword}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleLogin}>
              <Text style={styles.modalButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
    width: 475,
    height: 1000,
  },
  contentContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  logoContainer: {
    marginBottom: 10, // Adjust the value to increase or decrease the space between the logo and other components
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  tagline: {
    fontSize: 16,
    color: COLORS.skyblue,
    fontWeight: 'bold',
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
  button2: {
    width: 200,
    height: 25,
    backgroundColor: COLORS.gray2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText2: {
    color: COLORS.revblue,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: COLORS.gray2,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalButton: {
    width: '100%',
    height: 40,
    backgroundColor: COLORS.revblue,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomePage;

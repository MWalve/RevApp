import React, { useState, useEffect} from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, icons }  from '../../../../constants';
import { useNavigation } from 'expo-router';
import { registerUser, loginUser, createTables } from '../../../../utils/Database';
import Modal from 'react-native-modal';

const WelcomePage = () => {
  useEffect(() => {
    createTables();
  }, [])

  const navigation = useNavigation();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  

  const handleLoginPress = () => {
    setLoginModalVisible(true);
  };

  const handleRegisterPress = () => {
    setRegisterModalVisible(true);
  };

  const handleLogin = () => {
    loginUser(
      loginUsername,
      loginPassword,
      () => {
        // Handle successful login (e.g., navigate to the Dashboard)
        navigation.navigate('Dashboard');
        setLoginModalVisible(false);
        setLoginError(false);
      },
      () => {
        // Handle login failure (e.g., show an error message)
        setLoginError(true);
      }
    );
  };

  const handleRegister = () => {
    registerUser(
      registerUsername,
      registerPassword,
      () => {
        // Handle successful registration (e.g., show a success message and open the login modal)
        setRegisterSuccess(true);
        setRegisterModalVisible(false);
        setLoginModalVisible(true); // Automatically open the login modal after successful registration
        setTimeout(() => setRegisterSuccess(false), 10000); // Reset the success message after 3 seconds
      },
      () => {
        // Handle registration failure (e.g., show an error message)
        setRegisterModalVisible(false);
        alert('Registration failed. Please try again.');
      }
    );
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
        {/* Login Modal */}
        <Modal isVisible={loginModalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={text => setLoginUsername(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={text => setLoginPassword(text)}
              secureTextEntry
            />
            {loginError && (
              <Text style={styles.errorText}>Incorrect username or password.</Text>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={handleLogin}>
              <Text style={styles.modalButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setLoginModalVisible(false)}
            >
            <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Register Modal */}
        <Modal isVisible={registerModalVisible}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Register</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={text => setRegisterUsername(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={text => setRegisterPassword(text)}
              secureTextEntry
            />
            {registerSuccess && (
              <Text style={styles.successText}>Successfully registered! Please log in.</Text>
            )}
            <TouchableOpacity style={styles.modalButton} onPress={handleRegister}>
              <Text style={styles.modalButtonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setRegisterModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
};

///Styling
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
  // Additional styles for the modals
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  modalButton: {
    backgroundColor: COLORS.revblue,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  successText: {
    color: 'green',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default WelcomePage;

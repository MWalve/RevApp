import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useNavigation } from 'expo-router';
import StyleSheet from 'styled-components/dist/sheet/Sheet';


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
  };

  const handleModalClose = () => {
    setIsLoginModalVisible(false);
  };

  const handleLogin = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <Modal
      visible={isLoginModalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleModalClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  
});

export default WelcomePage;

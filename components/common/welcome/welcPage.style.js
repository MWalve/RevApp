import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants';


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
      marginBottom: 50,
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

  export default styles;
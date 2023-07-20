//code
import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { COLORS, icons } from '../../../../constants';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material';

const Dashboard = () => {
    return (
        <View style={styles.container}>
            <Image source={icons.menu} style={styles.hamburger}/>
            <Text style={styles.title}>
                Welcome User!
            </Text>
            <Text style={styles.quote}>
                Random health quote for user
            </Text>
        </View>
        //Health Quotes
        
        //Favorites Widget
        //Gut Widget
        // Mental Health Widgets
        //Taskbar
    )
};
//styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray,
    },
    title: {
        fontSize: 24,
        color: 'black',
        marginBottom: 10,
        paddingTop: 5,
        paddingLeft: 10,
    },
    hamburger: {
        position: 'absolute',
        right: 10,
        height: 40,
        width: 30
    },
    quote: {
        fontSize: 18,
        position: 'relative',
        fontFamily: 'san-serif',
        paddingLeft: 50,
        paddingTop: 30,
    }
})

export default Dashboard;
import { View, ScrollViewProps, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';

import { COLORS, icons, images, SIZES } from '../constants';
import { Welcome } from '../components';

const Home = () => {
    return (
        <SafeAreaView style={{ flex: 1,
        backgroundColor: COLORS.revblue }}>
            <Stack.Screen
            options={{
                headerStyle: { backgroundColor: COLORS.lightWhite }, 
                }} 
                />
        </SafeAreaView>
    )
}

export default Home;
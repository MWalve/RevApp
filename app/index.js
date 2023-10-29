import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WelcomePage, Dashboard } from '../components';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="RevBand" component={WelcomePage} />
      <Stack.Screen options={{ headerShown: false }} name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};

export default App;
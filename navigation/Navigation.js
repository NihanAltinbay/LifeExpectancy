import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import QuestionScreen from '../screens/QuestionScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Startseite" component={WelcomeScreen} />
        <Stack.Screen name="Umfrage" component={QuestionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

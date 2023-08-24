import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// WelcomeScreen component takes navigation as a prop to enable navigation between screens
const WelcomeScreen = ({ navigation }) => {
    // Function to navigate to the 'Umfrage' screen
  const goToQuestionScreen = () => {
    navigation.navigate('Umfrage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen!</Text>
      <Text style={styles.explanation}>
        Berechne Deine Lebenserwartung, indem Du ein paar einfache Fragen beantwortest.
      </Text>
      <TouchableOpacity style={styles.button} onPress={goToQuestionScreen}>
        <Text style={styles.buttonText}>Los geht's!</Text>
      </TouchableOpacity>
    </View>
  );
};


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  explanation: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;

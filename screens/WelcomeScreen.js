import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const goToQuestionScreen = () => {
    navigation.navigate('Question');
  };

  return (
    <View style={styles.container}>
      <Button title="Go to Question Screen" onPress={goToQuestionScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WelcomeScreen;

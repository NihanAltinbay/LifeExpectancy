import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuestionScreen from './src/screens/QuestionScreen';
import AddQuestionForm from './src/components/AddQuestionForm';

const Stack = createNativeStackNavigator();

const App = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Button
          title="Add Question"
          onPress={() => setShowForm(!showForm)}
        />
        <Button
          title="Question Screen"
          onPress={() => navigation.navigate(QuestionScreen)}
        />
        {showForm && <AddQuestionForm />}
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default App;

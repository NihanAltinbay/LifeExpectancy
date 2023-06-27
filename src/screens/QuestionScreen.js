import React from 'react';
import { View, StyleSheet } from 'react-native';
import QuestionComponent from '../components/QuestionComponent';

const questions = [
  {
    id: 1,
    question: 'What is your favorite color?',
    answers: [
      { label: 'Red', type: 'button' },
      { label: 'Blue', type: 'button' },
      { label: 'Green', type: 'button' },
    ],
  },
  // Add more questions here...
];

const QuestionScreen = () => {
  return (
    <View style={styles.container}>
      <QuestionComponent questions={questions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default QuestionScreen;

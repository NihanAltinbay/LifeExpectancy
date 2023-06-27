import React, { useState } from 'react';
import { View, TextInput, Button, CheckBox, StyleSheet, Text } from 'react-native';
import { firestore } from '../services/firebase';

const AddQuestionForm = () => {
  const [questionData, setQuestionData] = useState({
    id: '',
    type: '',
    question: '',
    answers: [],
    multipleAnswerAllowed: false,
  });

  const handleInputChange = (field, value) => {
    setQuestionData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleAddQuestion = async () => {
    try {
      const questionsRef = firestore().collection('questions');
      await questionsRef.add(questionData);

      console.log('Question added successfully!');
      // Reset the form after successful question addition
      setQuestionData({
        id: '',
        type: '',
        question: '',
        answers: [],
        multipleAnswerAllowed: false,
      });
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={questionData.id}
        onChangeText={(value) => handleInputChange('id', value)}
        placeholder="Question ID"
      />
      <TextInput
        style={styles.input}
        value={questionData.type}
        onChangeText={(value) => handleInputChange('type', value)}
        placeholder="Question Type"
      />
      <TextInput
        style={styles.input}
        value={questionData.question}
        onChangeText={(value) => handleInputChange('question', value)}
        placeholder="Question"
      />
      <TextInput
        style={styles.input}
        value={questionData.answers}
        onChangeText={(value) => handleInputChange('answers', value.split(','))}
        placeholder="Answers (comma-separated)"
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={questionData.multipleAnswerAllowed}
          onValueChange={(value) => handleInputChange('multipleAnswerAllowed', value)}
        />
        <Text>Multiple Answer Allowed</Text>
      </View>
      <Button title="Add Question" onPress={handleAddQuestion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default AddQuestionForm;

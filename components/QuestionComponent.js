import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const QuestionComponent = ({ questions, currentQuestionIndex, handleAnswer, handleNextQuestion, calculateLifeExpectancy  }) => {
  const currentQuestion = questions[currentQuestionIndex];
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [textValue, setTextValue] = useState('');
  const [weights, setWeights] = useState([]); // Initialize weights as an empty array


  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelection = (answerIndex) => {
    setSelectedAnswerIndex(answerIndex);
  };

  const handleTextChange = (text) => {
    setTextValue(text);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswerIndex !== null) {
      const selectedAnswer = currentQuestion.answers[selectedAnswerIndex];
      const answerWeight = selectedAnswer.weight || 0; // Use the weight value from the selected answer, default to 0 if not provided
      const value = selectedAnswer.value
  
      handleAnswer(currentQuestionIndex, {
        answerIndex: selectedAnswerIndex,
        value: textValue,
        weight: answerWeight,
      });
    }
  };
  


  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion?.question}</Text>
      {currentQuestion?.answers.map((answer, index) => {
        if (answer.type === 'input') {
          return (
            <View key={index} style={styles.answerContainer}>
              <Text style={styles.answerLabel}>{answer.label}</Text>
              <TextInput
                style={styles.answerInput}
                value={textValue}
                onChangeText={handleTextChange}
                placeholder={answer.placeholder}
                placeholderTextColor="#999"
              />
            </View>
          );
        } else if (answer.type === 'button') {
          const isSelected = index === selectedAnswerIndex;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.answerButton, isSelected && styles.selectedAnswerButton]}
              onPress={() => handleAnswerSelection(index)}
            >
              <Text style={[styles.answerButtonText, isSelected && styles.selectedAnswerButtonText]}>{answer.label}</Text>
            </TouchableOpacity>
          );
        } else {
          return null; // Invalid answer type, ignore it
        }
      })}

      {isLastQuestion ? (
        <TouchableOpacity style={styles.nextButton} onPress={calculateLifeExpectancy}>
          <Text style={styles.nextButtonText}>Calculate Life Expectancy</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.nextButton} onPress={handleAnswerSubmit}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerContainer: {
    marginBottom: 10,
  },
  answerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  answerButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedAnswerButton: {
    backgroundColor: 'blue', // Customize the selected answer button style
  },
  answerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedAnswerButtonText: {
    color: 'white', // Customize the selected answer button text color
  },
  nextButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuestionComponent;

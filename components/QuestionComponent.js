import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const QuestionComponent = ({ questions, currentQuestionIndex, handleAnswer, handleNextQuestion, calculateLifeExpectancy }) => {
  const currentQuestion = questions[currentQuestionIndex];
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0);
  const [textValue, setTextValue] = useState('');


  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelection = (answerIndex) => {
    setSelectedAnswerIndex(answerIndex);
  };

  const handleTextChange = (text) => {
    setTextValue(text);
  };

  const handleAnswerSubmit = () => {
    const selectedAnswer = currentQuestion.answers[selectedAnswerIndex];

    if (selectedAnswer.type === 'numeric-input') {
      const answerWeight = selectedAnswer.weight || 0;
      handleAnswer(currentQuestionIndex, {
        answerIndex: selectedAnswerIndex,
        value: textValue,
        weight: answerWeight,
      });
    } else if (selectedAnswer.type === 'button') {
      const answerWeight = selectedAnswer.weight || 0;
      handleAnswer(currentQuestionIndex, {
        answerIndex: selectedAnswerIndex,
        value: selectedAnswer.label,
        weight: answerWeight,
      });
    } else if (selectedAnswer.type == 'conditional-numeric-input') {
      const conditions = selectedAnswer.weight
      const values = Object.values(conditions)
      console.log(values)

      var isValueLessThan = false
      var lessThanValue = 0
      var weightLessThan = 0

      var isValueGreaterThan = false
      var greaterThanValue = 0
      var weightGreaterThan = 0

      var isEqual = false
      var equalValue = 0
      var weightEqual = 0

      var defaultValue = 0
      
      values.forEach((condition) => {
        if('valueLessThan' in condition) {
          isValueLessThan = true
          lessThanValue = condition.valueLessThan
          weightLessThan = condition.weight

        } else if('valueGreaterThan' in condition) {
          isValueGreaterThan = true
          greaterThanValue = condition.valueGreaterThan
          weightGreaterThan = condition.weight

        } else if('valueEqual' in condition) {
          isEqual = true
        } else {
          defaultValue = condition.weight
        }
      });

      var answerWeight = defaultValue; // Set the default weight initially
      if (isValueLessThan && Number(textValue) < lessThanValue) {
        answerWeight = weightLessThan;
      } else if (isValueGreaterThan && Number(textValue) > greaterThanValue) {
        answerWeight = weightGreaterThan;
      } else if (isEqual && Number(textValue) === equalValue) {
        answerWeight = weightEqual;
      }
      
      handleAnswer(currentQuestionIndex, {
        answerIndex: selectedAnswerIndex,
        value: selectedAnswer.label,
        weight: answerWeight,
      });
    }
    setSelectedAnswerIndex(0);
    setTextValue('');

  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion?.question}</Text>
      {currentQuestion?.answers.map((answer, index) => {
        if (answer.type === 'numeric-input' || answer.type === 'conditional-numeric-input') {
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
              <Text style={[styles.answerButtonText, isSelected && styles.selectedAnswerButtonText]}>
                {answer.label}
              </Text>
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

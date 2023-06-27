import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const QuestionComponent = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (answerIndex, value = '') => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = { answerIndex, value };
    setAnswers(updatedAnswers);

    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
      } else {
        // All questions answered, do something with the answers
        console.log('All answers:', answers);
      }
    }, 500);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion.question}</Text>

      {currentQuestion.answers.map((answer, index) => {
        if (answer.type === 'input') {
          return (
            <View key={index} style={styles.answerContainer}>
              <Text style={styles.answerLabel}>{answer.label}</Text>
              <TextInput
                style={styles.answerInput}
                value={answers[currentQuestionIndex]?.value || ''}
                onChangeText={(text) => handleAnswer(index, text)}
                placeholder={answer.placeholder}
                placeholderTextColor="#999"
              />
            </View>
          );
        } else if (answer.type === 'button') {
          return (
            <TouchableOpacity
              key={index}
              style={styles.answerButton}
              onPress={() => handleAnswer(index)}
              disabled={answers[currentQuestionIndex] !== undefined}
            >
              <Text style={styles.answerButtonText}>{answer.label}</Text>
            </TouchableOpacity>
          );
        }
      })}
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
  question: {
    fontSize: 20,
    marginBottom: 20,
  },
  answerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  answerInput: {
    width: '100%',
    height: 40,
    borderColor: '#999',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  answerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  answerButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default QuestionComponent;

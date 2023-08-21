import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Platform, Keyboard,Alert } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"

const QuestionComponent = ({ questions, currentQuestionIndex, handleAnswer, handleNextQuestion, calculateLifeExpectancy }) => {
  const currentQuestion = questions[currentQuestionIndex];
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);
  const [inputValues, setInputValues] = useState(Array(currentQuestion.answers.length).fill(''));
  const [isInputValid, setIsInputValid] = useState(false);

  const [date, setDate] = useState(new Date())
  const [showPicker, setShowPicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [bmiValue, setBmi] = useState(0);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(0);
  const PRIORITY_QUESTION_INDEX = 23;


  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelection = (answerIndex) => {
    if (selectedAnswerIndex === answerIndex) {
      setSelectedAnswerIndex(-1);
      setIsInputValid(false); // Clear input validation state
    } else {
      setSelectedAnswerIndex(answerIndex);
      setIsInputValid(true); // Set input validation state to true when a button is selected
    }
  };


  useEffect(() => {
    if (height !== 0) {
      calculateBMI();
    }
  }, [height]); // Only re-run the effect if the height state changes

  const handleTextChange = (text, answerIndex) => {
    // Update the input value for the specific answer index

    text = text.replace(/[^\d]+/g, '');
    const updatedInputValues = [...inputValues];
    updatedInputValues[answerIndex] = text;

    const isValid = text.trim().length > 0;
    setIsInputValid(isValid);
    setInputValues(updatedInputValues);
  };

  const handleAnswerSubmit = () => {
    const selectedAnswer = currentQuestion.answers[selectedAnswerIndex];

    if (currentQuestion.type === "gender-cond-selection-group") {
      if (selectedAnswer.type === "button") {
        const condWeight = gender === 'man' ? selectedAnswer.mweight : selectedAnswer.fweight
        handleAnswer(currentQuestionIndex, {
          answerIndex: selectedAnswerIndex,
          value: selectedAnswer.label,
          weight: condWeight,
        });
      }
    } else {
      if (selectedAnswer.type === 'numeric-input') {
        const answerWeight = selectedAnswer.weight || 0;
        handleAnswer(currentQuestionIndex, {
          answerIndex: selectedAnswerIndex,
          value: inputValues[selectedAnswerIndex], // Use the corresponding input value
          weight: answerWeight,
        });
      } else if (selectedAnswer.type === 'button') {
        const answerWeight = selectedAnswer.weight || 0;
        if (currentQuestionIndex === 1) {
          selectedAnswer.label === "Männlich" ? setGender('man') : setGender('woman')
        }
        handleAnswer(currentQuestionIndex, {
          answerIndex: selectedAnswerIndex,
          value: selectedAnswer.label,
          weight: answerWeight,
        });
      } else if (selectedAnswer.type === 'conditional-numeric-input') {
        const conditions = selectedAnswer.weight;
        const values = Object.values(conditions);


        var isValueLessThan = false;
        var lessThanValue = 0;
        var weightLessThan = 0;

        var isValueGreaterThan = false;
        var greaterThanValue = 0;
        var weightGreaterThan = 0;

        var isEqual = false;
        var equalValue = 0;
        var weightEqual = 0;

        var defaultValue = 0;

        values.forEach((condition) => {
          if ('valueLessThan' in condition) {
            isValueLessThan = true;
            lessThanValue = condition.valueLessThan;
            weightLessThan = condition.weight;
          } else if ('valueGreaterThan' in condition) {
            isValueGreaterThan = true;
            greaterThanValue = condition.valueGreaterThan;
            weightGreaterThan = condition.weight;
          } else if ('valueEqual' in condition) {
            isEqual = true;
            equalValue = condition.valueEqual;
            weightEqual = condition.weight;
          } else {
            defaultValue = condition.weight;
          }
        });

        var answerWeight = defaultValue; // Set the default weight initially
        const inputValue = inputValues[selectedAnswerIndex];
        if (isValueLessThan && Number(inputValue) < lessThanValue) {
          answerWeight = weightLessThan;
        } else if (isValueGreaterThan && Number(inputValue) > greaterThanValue) {
          answerWeight = weightGreaterThan;
        } else if (isEqual && Number(inputValue) === equalValue) {
          answerWeight = weightEqual;
        }

        handleAnswer(currentQuestionIndex, {
          answerIndex: selectedAnswerIndex,
          value: selectedAnswer.label,
          weight: answerWeight,
        });
      } else if (selectedAnswer.type === 'weight-input') {
        setWeight(inputValues[selectedAnswerIndex]);

        const answerWeight = selectedAnswer.weight || 0;
        handleAnswer(currentQuestionIndex, {
          answerIndex: selectedAnswerIndex,
          value: inputValues[selectedAnswerIndex], // Use the corresponding input value
          weight: answerWeight,
        });

      } else if (selectedAnswer.type === 'height-input') {
        const newHeight = inputValues[selectedAnswerIndex]; // Get the new height value
        setHeight(newHeight);
        const bmiweight = calculateBMI();
        handleAnswer(currentQuestionIndex, {
          answerIndex: selectedAnswerIndex,
          value: newHeight,
          weight: bmiweight,
        });
      } else if (selectedAnswer.type === 'waist-input') {
        var answerWeight = selectedAnswer.weight || 0;
        const AVERAGE_WAIST_MAN = 102;
        const AVERAGE_WAIST_WOMAN = 88;
        const value = inputValues[selectedAnswerIndex];
        const avg = gender === 'man' ? AVERAGE_WAIST_MAN : AVERAGE_WAIST_WOMAN
        var percentageIncrease = ((value - avg) / avg) * 100;
        if (percentageIncrease >= 10 && percentageIncrease <= 20) {
          answerWeight = -6
        } else if (percentageIncrease > 20) {
          answerWeight = -12
        }
        handleAnswer(currentQuestionIndex, {
          answerIndex: selectedAnswerIndex,
          value: inputValues[selectedAnswerIndex],
          weight: answerWeight,
        });

      } else if (selectedAnswer.type === 'date-picker') {

        handleAnswer(0, {
          answerIndex: 0,
          value: age,
          weight: 0,
        });
      }

      setIsInputValid(false);
      setInputValues(Array(currentQuestion.answers.length).fill('')); // Clear the input values
      setSelectedAnswerIndex(-1);

    }

    
    if (currentQuestionIndex === PRIORITY_QUESTION_INDEX) {
      // Show a confirmation message before calculating life expectancy
      Alert.alert(
        'Bestätigung',
        'Möchtest du deine Lebenserwartung jetzt erfahren, oder weiter für eine bessere Berechnung?',
        [
          {
            text: 'Jetzt Berechnen',
            onPress: calculateLifeExpectancy,
          },
          {
            text: 'Fortsetzen',
            onPress: () => {
            },
          },
        ]
      );
    }

    Keyboard.dismiss();
  };

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  }

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatepicker();
        setDateOfBirth(currentDate.toDateString());
      }
    } else {
      toggleDatepicker();
    }
    var today = new Date();
    var age = today.getFullYear() - selectedDate.getFullYear()
    setAge(age);
    const updatedInputValues = [...inputValues];
    updatedInputValues[0] = age;
    if (age < 0) {
      setIsInputValid(false);
    } else {
      setIsInputValid(true);
      setSelectedAnswerIndex(0);
    }
  }

  const handleInputFocus = (answerIndex) => {
    // Reset other input values to empty strings
    const updatedInputValues = inputValues.map((value, index) => (index === answerIndex ? value : ''));
    setInputValues(updatedInputValues);

    setSelectedAnswerIndex(answerIndex); // Update selectedAnswerIndex when input is focused
  }

  const calculateBMI = () => {

    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);

    const bmi = weightValue / Math.pow(heightValue / 100, 2);
    setBmi(bmi)

    var bmiweight = 0;

    if (bmi >= 20 && bmi <= 25) {
      bmiweight = 6;
    } else if (bmi >= 25 && bmi <= 30) {
      bmiweight = -6;
    } else if (bmi > 30) {
      bmiweight = -12;
    }

    return bmiweight;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.question}>{currentQuestion?.question}</Text>
        {currentQuestion?.answers.map((answer, index) => {
          if (answer.type === 'numeric-input' || answer.type === 'conditional-numeric-input' || answer.type === 'height-input' || answer.type === 'weight-input' || answer.type === 'waist-input') {
            return (
              <View key={index} style={styles.answerContainer}>
                <Text style={styles.answerLabel}>{answer.label}</Text>
                <TextInput
                  style={styles.answerInput}
                  value={inputValues[index]} // Use the corresponding input value
                  onChangeText={(text) => handleTextChange(text, index)} // Pass the answer index
                  onFocus={() => handleInputFocus(index)} // Set the selectedAnswerIndex on focus and clear other inputs
                  blurOnSubmit={true}
                  placeholder={answer.placeholder}
                  placeholderTextColor="#999"
                  keyboardType="numeric"
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
          } else if (answer.type === 'date-picker') {
            return (
              <View key={index}>
                {/* Render Pressable TextInput */}
                {!showPicker && (
                  <Pressable onPress={() => toggleDatepicker()}>
                    <TextInput
                      style={styles.answerButtonText}
                      placeholder="Geburtsdatum auswählen"
                      value={dateOfBirth}
                      onChangeText={setDateOfBirth}
                      editable={false}
                      onPressIn={toggleDatepicker}
                    />
                  </Pressable>
                )}
                {/* Render DateTimePicker */}
                {showPicker && (
                  <DateTimePicker
                    mode="date"
                    display="spinner"
                    value={date}//{inputValues[index] ? new Date(inputValues[index]) : new Date()}
                    onChange={onChange}
                  />
                )}
              </View>
            );
          }
          else {
            return null; // Invalid answer type, ignore it
          }
        })}
        <View style={styles.fixedButtonsContainer}>
          {isLastQuestion ? (
            <TouchableOpacity
              style={[styles.nextButton, !isInputValid && { backgroundColor: '#ccc' }]} // Disable the button based on input validity
              onPress={calculateLifeExpectancy}
              disabled={!isInputValid} // Disable the button based on input validity
            >
              <Text style={styles.nextButtonText}>Calculate Life Expectancy</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextButton, !isInputValid && { backgroundColor: '#ccc' }]} // Disable the button based on input validity
              onPress={handleAnswerSubmit}
              disabled={!isInputValid} // Disable the button based on input validity
            >
              <Text style={styles.nextButtonText}>Weiter</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    position: 'relative',
    width: '80%',
    height: '80%',
    alignItems: 'center',

  },
  card: {
    position: 'relative',
    width: '90%',
    minHeight: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fixedButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
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
    backgroundColor: 'blue',
  },
  answerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedAnswerButtonText: {
    color: 'white',
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
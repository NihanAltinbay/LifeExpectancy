import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Pressable,Platform} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker"

const QuestionComponent = ({ questions, currentQuestionIndex, handleAnswer, handleNextQuestion, calculateLifeExpectancy }) => {
  const currentQuestion = questions[currentQuestionIndex];
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0);
  const [inputValues, setInputValues] = useState(Array(currentQuestion.answers.length).fill(''));
  const [isInputValid, setIsInputValid] = useState(false);

  const [date, setDate] = useState(new Date())
  const [showPicker, setShowPicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelection = (answerIndex) => {
    if (selectedAnswerIndex === answerIndex) {
      setSelectedAnswerIndex(0);
      setIsInputValid(false); // Clear input validation state
    } else {
      setSelectedAnswerIndex(answerIndex);
      setIsInputValid(true); // Set input validation state to true when a button is selected
    }
  };

  const handleTextChange = (text, answerIndex) => {
    // Update the input value for the specific answer index
    const updatedInputValues = [...inputValues];
    updatedInputValues[answerIndex] = text;

    const isValid = text.trim().length > 0; // You can add your own validation rules if needed
    setIsInputValid(isValid);
    setInputValues(updatedInputValues);

  };

  const handleAnswerSubmit = () => {
    const selectedAnswer = currentQuestion.answers[selectedAnswerIndex];
  
    if (selectedAnswer.type === 'numeric-input') {
      const answerWeight = selectedAnswer.weight || 0;
      handleAnswer(currentQuestionIndex, {
        answerIndex: selectedAnswerIndex,
        value: inputValues[selectedAnswerIndex], // Use the corresponding input value
        weight: answerWeight,
      });
    } else if (selectedAnswer.type === 'button') {
      const answerWeight = selectedAnswer.weight || 0;
      handleAnswer(currentQuestionIndex, {
        answerIndex: selectedAnswerIndex,
        value: selectedAnswer.label,
        weight: answerWeight,
      });
    } else if (selectedAnswer.type === 'conditional-numeric-input') {
      const conditions = selectedAnswer.weight;
      const values = Object.values(conditions);
      console.log(values);
  
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
    }
  
    setIsInputValid(false);
    setInputValues(Array(currentQuestion.answers.length).fill('')); // Clear the input values

  };

  

  const toggleDatepicker = () => {
    console.log("yarra")
    setShowPicker(!showPicker);
  }
  
  const onChange = ({type}, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatepicker();
        setDateOfBirth(currentDate.toDateString());
        console.log(date)
      }


    } else {
      toggleDatepicker();
    }

    var today = new Date();
    var age = today.getFullYear() - selectedDate.getFullYear()
    if(age < 0) {
      setIsInputValid(false);
    } else {
      setIsInputValid(true);
    }
    const updatedInputValues = [...inputValues];
    updatedInputValues[0] = age;
    console.log(updatedInputValues)

    handleAnswer(0, {
      answerIndex: 0,
      value: age,
      weight: 0,
    });
  }

  const handleDateChange = (newDate, answerIndex) => {
    const updatedInputValues = [...inputValues];
    updatedInputValues[answerIndex] = newDate.toISOString(); // Convert to ISO string format
  
    const isValid = newDate !== null; // Basic validation, check for a valid date
    setIsInputValid(isValid);
    setInputValues(updatedInputValues);
  
    setShowPicker(false); // Hide the date picker
  };

  return (
    <View style={styles.container}>
     <View style={styles.card}>
      <Text style={styles.question}>{currentQuestion?.question}</Text>
      {currentQuestion?.answers.map((answer, index) => {
        if (answer.type === 'numeric-input' || answer.type === 'conditional-numeric-input') {
          return (
            <View key={index} style={styles.answerContainer}>
              <Text style={styles.answerLabel}>{answer.label}</Text>
              <TextInput
                style={styles.answerInput}
                value={inputValues[index]} // Use the corresponding input value
                onChangeText={(text) => handleTextChange(text, index)} // Pass the answer index
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
          
        } else if (answer.type === 'date-picker') {
          return (
            <View key={index}>
              {/* Render Pressable TextInput */}
              {!showPicker && (
              <Pressable onPress={() => toggleDatepicker()}>
                <TextInput
                  style={styles.answerButtonText}
                  placeholder="Select date"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  editable={false} // Prevent direct input
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
          <Text style={styles.nextButtonText}>Next</Text>
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
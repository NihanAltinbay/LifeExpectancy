import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../services/firebase_service';
import QuestionComponent from '../components/QuestionComponent';

const QuestionScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [weights, setWeights] = useState([]); // Initialize weights as an empty array
  const [lifeExpectancy, setLifeExpectancy] = useState(null);
  const [values, setValues] = useState([]);
  const [showResult, setShowResult] = useState(false);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'questions'));
        const fetchedQuestions = querySnapshot.docs.map((doc) => doc.data());
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (questionIndex, answer,value,weight) => {
    // Update the answers array with the new answer
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = answer;
    const updatedWeights = [...weights]
    updatedWeights[questionIndex] = answer.weight;
    const updatedValues = [...values]
    updatedValues[questionIndex] = answer.value
    
    setAnswers(updatedAnswers);
    setWeights(updatedWeights);
    setValues(updatedValues)
    console.log(answer)


  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      // Last question reached, navigate to results screen
      // Implement your navigation logic here
      console.log('Finish');
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const calculateLifeExpectancy = async () => {
    const gender = answers[0].answerIndex == 0 ? 'life-expectancy-m' : 'life-expectancy-w';
    const age = answers[1].value;
    console.log("age" + age)

    console.log(weights)
    const averageLe = await fetchLe(gender,age)
    
    var sumWeights = 0

    for(var i = 0;i<weights.length;i++) {
      console.log(weights[i])
      sumWeights = sumWeights + weights[i]
    }
    var calculatedLe = parseFloat(averageLe) + parseFloat(sumWeights)
    setLifeExpectancy(calculatedLe);
    setShowResult(!showResult);

  }

  const fetchLe = async (gender,age) => {
    try {
      const ref = doc(db,gender,age);
      const docSnap = await getDoc(ref);
      if(docSnap.exists()) {
        const averageLe = docSnap.data()['average_le']
        console.log("avLe:" + averageLe);;
        return averageLe;
      }
    } catch(error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      {questions.length > 0 ? (
        <>
          <QuestionComponent
            questions={questions}
            handleAnswer={handleAnswer}
            handleNextQuestion={handleNextQuestion}
            currentQuestionIndex={answers.length}
            calculateLifeExpectancy={calculateLifeExpectancy}
          />
          {showResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Life Expectancy: {lifeExpectancy}</Text>
            </View>
          )}
        </>
      ) : (
        <Text>Loading questions...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});



export default QuestionScreen;

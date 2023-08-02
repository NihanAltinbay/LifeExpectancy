import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../services/firebase_service';
import QuestionComponent from '../components/QuestionComponent';
import { Animated, Easing } from 'react-native';

const QuestionScreen = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [weights, setWeights] = useState([]); // Initialize weights as an empty array
  const [lifeExpectancy, setLifeExpectancy] = useState(null);
  const [values, setValues] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [averageLe, setAverageLe] = useState(null);
  const [downloadedTable, setDownloadTable] = useState(false);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'questions'));
        const fetchedQuestions = querySnapshot.docs.map((doc) => doc.data());


        setQuestions(fetchedQuestions.sort(function(a,b) {
          return a.id-b.id
        }));


        console.log(fetchedQuestions)
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();

  }, []);

  const greenTriangleScale = new Animated.Value(0);
  const redTriangleScale = new Animated.Value(0);

  const progressPercentage = (answers.length / questions.length) * 100;


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

    if(answers.length > 1) {
      if(!downloadedTable) {
        getAgeTable();
        setDownloadTable(true);
        setLifeExpectancy(averageLe)

      }

      updateLifeExpectancy(answer.weight);
      setShowResult(true);

    }

  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      console.log('Finish');
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const calculateLifeExpectancy = async () => {
    const gender = answers[1].answerIndex == 0 ? 'life-expectancy-m' : 'life-expectancy-w';
    const age = answers[0].value;
    const averageLe = await fetchLe(gender,age)
    
    var sumWeights = 0

    for(var i = 0;i<weights.length;i++) {
      console.log(weights[i])
      sumWeights = sumWeights + parseInt(weights[i])
    }

    
    var calculatedLe = parseFloat(averageLe) + parseFloat(sumWeights / 12)
    console.log(sumWeights)
    setLifeExpectancy(calculatedLe);


  }

  const updateLifeExpectancy = async (weight) => {



    var sumWeights = 0;
    for (var i = 0; i < weights.length; i++) {
      sumWeights = sumWeights + parseInt(weights[i]);
    }

    console.log("anan" + lifeExpectancy)
    console.log(weight)
    var calculatedLe = parseFloat(lifeExpectancy) + parseFloat(weight / 12);

    setLifeExpectancy(calculatedLe);  
    console.log(lifeExpectancy)
  };

  const getAgeTable = async () => {
    const gender = answers[1].answerIndex === 0 ? 'life-expectancy-m' : 'life-expectancy-w';
    const age = answers[0].value;
    const le = await fetchLe(gender, age);
    setAverageLe(le)
    setLifeExpectancy(le)
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

  const animateTriangles = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start();
  };

  

  return (
    <View style={styles.container}>
{showResult && (
  <View style={styles.resultContainer}>
    <Text style={styles.resultText}>Life Expectancy: {lifeExpectancy}</Text>
    <Animated.View style={[styles.triangle, { transform: [{ scaleY: greenTriangleScale }] }]} />
    <Animated.View style={[styles.triangle, { transform: [{ scaleY: redTriangleScale }] }]} />
  </View>
)}

      {questions.length > 0 ? (
        <>
          <QuestionComponent
            questions={questions}
            handleAnswer={handleAnswer}
            handleNextQuestion={handleNextQuestion}
            currentQuestionIndex={answers.length}
            calculateLifeExpectancy={calculateLifeExpectancy}
          />
        </>
      ) : (
        <Text>Loading questions...</Text>
      )}
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: progressPercentage + '%' }]} />
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderStyle: 'solid',
    marginLeft: 5,
    marginRight: 5,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
  },
});

export default QuestionScreen;

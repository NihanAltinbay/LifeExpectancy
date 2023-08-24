import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { doc, getDoc, getDocs,addDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebase_service';
import QuestionComponent from '../components/QuestionComponent';

const QuestionScreen = ({navigation}) => {
  // State variables
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [weights, setWeights] = useState([]); 
  const [lifeExpectancy, setLifeExpectancy] = useState(0);
  const [values, setValues] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showLifeExpectancy, setShowLifeExpectancy] = useState(false);
  const [averageLe, setAverageLe] = useState(null);
  const [downloadedTable, setDownloadTable] = useState(false);
  var today = new Date();


  // Fetch questions from Firestore on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'questions_prio'));
        const fetchedQuestions = querySnapshot.docs.map((doc) => doc.data());

        setQuestions(fetchedQuestions.sort(function(a,b) {
          return a.id-b.id
        }));


      //  console.log(fetchedQuestions)
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();

  }, []);
 /* TODO: animations
  const greenTriangleScale = new Animated.Value(0);
  const redTriangleScale = new Animated.Value(0);
*/


  const progressPercentage = (answers.length / questions.length) * 100; // Progress bar


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
        // setLifeExpectancy(averageLe)

      }
      setShowLifeExpectancy(true)

      updateLifeExpectancy(answer.weight);

    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const calculateLifeExpectancy = async () => {
    var sumWeights = parseFloat(averageLe);
    for (var i = 0; i < weights.length; i++) {
      sumWeights = sumWeights + parseInt(weights[i])/12;
    }
    setLifeExpectancy(sumWeights)
    setShowResult(true);
    writeResultsToDb(sumWeights);


  }

  const updateLifeExpectancy = async (weight) => {

    var calculatedLe = parseFloat(lifeExpectancy) + parseFloat(weight / 12);

    // setLifeExpectancy(calculatedLe);  
  };

  const getAgeTable = async () => {
    const gender = answers[1].answerIndex === 0 ? 'life-expectancy-m' : 'life-expectancy-w'; 
    const age = answers[0].value.toString();
    const le = await fetchLe(gender, age);
    setAverageLe(le+parseInt(age))
  }

  const writeResultsToDb = async (le) => {
    const userAnswers = {
      answers: answers,
      average_le_at_this_age: averageLe,
      calculated_le: le,
      time_stamp: today
    };
    try {
      const docRef = await addDoc(collection(db, 'user-answers'), userAnswers);
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error(error)
    }
  }

  const fetchLe = async (gender,age) => {
    try {
      const ref = doc(db,gender,age);
      const docSnap = await getDoc(ref);
      if(docSnap.exists()) {
        const averageLe = docSnap.data()['average_le']
        return averageLe;
      }
    } catch(error) {
      console.error(error)
    }
  }

  const calculateAge = (age) => {
    var age = today.getFullYear() - age.getFullYear();
    return age;
  }

  /* TODO: Animations 
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
  */

  
 // Rendering the component
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
        </>
      ) : (
        <Text>Loading questions...</Text>
      )}
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: progressPercentage + '%' }]} />
      </View>
      {/* Modal Popup */}
      <Modal visible={showResult} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.resultText}>Deine Lebenserwartung: {Math.round(lifeExpectancy)}</Text>
            <Text style={styles.resultTextAverage}>In Deinem Alter leben die Menschen durchschnittlich bis zu {Math.round(averageLe)} Jahre.</Text>
            <Text style={styles.resultTextDisclaimer}>Hinweis: Die berechnete Lebenserwartung ist eine Schätzung und entspricht möglicherweise nicht den tatsächlichen Ergebnissen. 
            Sie basiert auf den angegebenen Eingaben und allgemeinen statistischen Daten.</Text>

            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => {
                setShowResult(false);
                navigation.navigate('Startseite');
              }}
            >
              <Text style={styles.popupButtonText}>Zum Startbildschirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
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
  resultTextAverage: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  resultTextDisclaimer: {
    fontSize: 10,
    fontStyle: 'italic', 
    color: '#999',
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
    position: 'relative',
    width:'80%',
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

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popupButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  popupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuestionScreen;

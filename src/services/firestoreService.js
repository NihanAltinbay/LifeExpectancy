import firestore from '@react-native-firebase/firestore';

const questionsCollection = firestore().collection('questions');

export const addQuestion = (questionData) => {
    return questionsCollection.add(questionData);
  };
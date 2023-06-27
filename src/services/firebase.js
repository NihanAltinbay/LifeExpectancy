import { initializeApp } from "@react-native-firebase/app";
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDE3YMbBdmgELcXSoreYSUfJ15HI3FVQkw",
    authDomain: "uom23-life-expectancy.firebaseapp.com",
    projectId: "uom23-life-expectancy",
    storageBucket: "uom23-life-expectancy.appspot.com",
    messagingSenderId: "535298033327",
    appId: "1:535298033327:web:010e0d089a4d5fe1dd765a",
    measurementId: "G-CXJEZJZH64"
  };

  // Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = firestore();


export {db as firestore}
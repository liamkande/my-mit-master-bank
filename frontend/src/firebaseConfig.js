import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth' // Import Firebase Authentication
import { getFirestore } from 'firebase/firestore' // Import Firestore

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCjstcvk-nJS7FfD8LTa_78DyHnwwhUE9A',
  authDomain: 'my-mit-bank-app.firebaseapp.com',
  databaseURL: 'https://my-mit-bank-app-default-rtdb.firebaseio.com',
  projectId: 'my-mit-bank-app',
  storageBucket: 'my-mit-bank-app.appspot.com',
  messagingSenderId: '77614177253',
  appId: '1:77614177253:web:371007d08690798c596d0c',
}

const app = initializeApp(firebaseConfig) // Initialize Firebase app
export const auth = getAuth(app) // Initialize Firebase Authentication service
export const db = getFirestore(app) // Initialize Firestore

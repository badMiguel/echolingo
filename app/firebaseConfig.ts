import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
import { getFirestore } from "firebase/firestore";
// import {...} from "firebase/functions";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDCJw27c6rhm2SeWoc6qSl0drwBX-8AEv8',
  authDomain: 'languageapp-b7daf.firebaseapp.com',
  databaseURL: 'https://languageapp-b7daf.firebaseio.com',
  projectId: 'languageapp-b7daf',
  storageBucket: 'languageapp-b7daf.appspot.com',
  messagingSenderId: '97596244175',
  appId: '1:97596244175:android:ed44b28a4a5860c52bf7ba',
//   measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export const data_base = getFirestore(app); // Export Firestore
export const storage = getStorage(app);
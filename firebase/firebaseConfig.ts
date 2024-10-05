import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import 'firebase/database'

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDCJw27c6rhm2SeWoc6qSl0drwBX-8AEv8",
    authDomain: "languageapp-b7daf.firebaseapp.com",
    databaseURL: "https://languageapp-b7daf.firebaseio.com",
    projectId: "languageapp-b7daf",
    storageBucket: "languageapp-b7daf.appspot.com",
    messagingSenderId: "97596244175",
    appId: "1:97596244175:android:ed44b28a4a5860c52bf7ba",
};

const app = initializeApp(firebaseConfig);

export const data = getFirestore(app); // Export Firestore
export const storage = getStorage(app);

import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
import { getFirestore } from "firebase/firestore";
// import {...} from "firebase/functions";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDoWuDkE2J8gbUAoHvhyjb1U9jkYIMS6lk",
    authDomain: "echolingo-4aa6d.firebaseapp.com",
    projectId: "echolingo-4aa6d",
    storageBucket: "echolingo-4aa6d.appspot.com",
    messagingSenderId: "89256999282",
    appId: "1:89256999282:android:c2b9e225c75e4a612345eb",
    measurementId: "G-NH58WWKJCD",
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export const db = getFirestore(app);
export const storage = getStorage(app);

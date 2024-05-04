import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import for authentication (if applicable)
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDe-PY-iJYVdLhl-ytvHe7RHjhNA0v1PQI",
    authDomain: "studentdashboard-5d6fd.firebaseapp.com",
    projectId: "studentdashboard-5d6fd",
    storageBucket: "studentdashboard-5d6fd.appspot.com",
    messagingSenderId: "347083253262",
    appId: "1:347083253262:web:dd58df21933fef06e47e5f",
    measurementId: "G-TDZHERG7WM"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(); // Initialize Auth (if applicable)
export const db = getFirestore(app); // Get Firestore instance



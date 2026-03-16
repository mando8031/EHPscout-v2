import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
apiKey: "AIzaSyBRcgAd7hMj-qfjJZ3Z6bAPAmROllToODM",
authDomain: "ehp5533scout-bbaed.firebaseapp.com",
projectId: "ehp5533scout-bbaed",
storageBucket: "ehp5533scout-bbaed.firebasestorage.app",
messagingSenderId: "11247475743",
appId: "1:11247475743:web:7a5081a57fea52ff38c92a"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

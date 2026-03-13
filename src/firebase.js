import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig={

  apiKey:process.env.REACT_APP_FIREBASE_KEY,
  authDomain:process.env.REACT_APP_FIREBASE_DOMAIN,
  projectId:process.env.REACT_APP_FIREBASE_PROJECT

}

const app=initializeApp(firebaseConfig)

export const db=getFirestore(app)

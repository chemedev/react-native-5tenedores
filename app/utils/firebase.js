import { FIREBASE_CONFIG } from "@env"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = JSON.parse(FIREBASE_CONFIG)

export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore()

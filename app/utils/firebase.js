import { FIREBASE_CONFIG } from "@env"
import { initializeApp } from "firebase/app"

const firebaseConfig = JSON.parse(FIREBASE_CONFIG)

export const firebaseApp = initializeApp(firebaseConfig)

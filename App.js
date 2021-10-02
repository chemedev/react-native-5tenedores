import React, { useEffect } from "react"
import Navigation from "./app/navigations/Navigation"
import { firebaseApp } from "./app/utils/firebase"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export default function App() {
  const auth = getAuth()

  // useEffect(() => {
  //   onAuthStateChanged(auth, user => {
  //     console.log(user)
  //   })
  // }, [])

  return <Navigation />
}

import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import { getAuth, onAuthStateChanged } from "@firebase/auth"

import UserGuest from "./UserGuest"
import UserLogged from "./UserLogged"

export default function Account() {
  const [login, setLogin] = useState(null)
  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      !user ? setLogin(false) : setLogin(true)
    })
  }, [])

  if (login === null) return <Text>Cargando...</Text>

  return login ? <UserLogged /> : <UserGuest />
}

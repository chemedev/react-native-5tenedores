import React, { useEffect, useState } from "react"
import { getAuth, onAuthStateChanged } from "@firebase/auth"

import Loading from '../../components/Loading'

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

  if (login === null) return <Loading isVisible={true} text="Cargando..." />

  return login ? <UserLogged /> : <UserGuest />
}

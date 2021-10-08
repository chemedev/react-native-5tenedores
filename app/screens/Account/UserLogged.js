import React from "react"
import { View, Text, Button } from "react-native"
import { getAuth, signOut } from "firebase/auth"

export default function UserLogged() {
  const auth = getAuth()
  return (
    <View>
      <Text>UserLogged...</Text>
      <Button title="Cerrar sesión" onPress={() => signOut(auth)} />
    </View>
  )
}

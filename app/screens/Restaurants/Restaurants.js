import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Icon } from "react-native-elements"
import { getAuth } from "firebase/auth"

export default function Restaurants(props) {
  const auth = getAuth()
  const [user, setUser] = useState(null)
  const { navigation } = props

  useEffect(() => {
    auth.onAuthStateChanged(userInfo => {
      setUser(userInfo)
    })
  }, [])

  return (
    <View style={styles.viewBody}>
      <Text>Restaurants...</Text>

      {user && (
        <Icon
          type="material-community"
          name="plus"
          color="#00a680"
          reverse
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("screen-add-restaurant")}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    borderColor: "#fff"
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.05
  }
})

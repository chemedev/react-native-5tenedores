import React from "react"
import { StyleSheet, View, Text, ActivityIndicator } from "react-native"

export default function Loading(props) {
  const { text } = props

  return (
    <View style={(styles.view, { display: props.isVisible ? "flex" : "none" })}>
      <ActivityIndicator size="large" color="#00a680" />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)"
  },
  text: {
    color: "#00a680",
    textTransform: "uppercase",
    marginTop: 10
  }
})

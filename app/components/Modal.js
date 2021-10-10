import React from "react"
import { StyleSheet } from "react-native"
import { Overlay } from "react-native-elements"

export default function Modal(props) {
  const { isVisible, setIsVisible, children } = props

  const closeModal = () => setIsVisible(false)

  return (
    <Overlay
      isVisible={isVisible}
      style={(styles.modalView, { display: props.isVisible ? "flex" : "none" })}
      onBackdropPress={closeModal}
    >
      {children}
    </Overlay>
  )
}

const styles = StyleSheet.create({
  modalView: {
    height: "auto",
    width: "90%",
    backgroundColor: "#fff"
  }
})

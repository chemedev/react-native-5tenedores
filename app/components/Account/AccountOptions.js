import React, { useState } from "react"
import { StyleSheet, ScrollView } from "react-native"
import { ListItem, Icon } from "react-native-elements"
import { map } from "lodash"
import Modal from "../Modal"
import ChangeDisplayNameForm from "./ChangeDisplayNameForm"
import ChangeEmailForm from "./ChangeEmailForm"
import ChangePasswordForm from "./ChangePasswordForm"

export default function AccountOptions(props) {
  const { userInfo, toastRef, setReloadUserInfo } = props

  const [showModal, setShowModal] = useState(false)
  const [renderComponent, setRenderComponent] = useState(null)

  const selectedComponent = key => {
    switch (key) {
      case "displayName":
        setRenderComponent(
          <ChangeDisplayNameForm
            displayName={userInfo.displayName}
            setShowModal={setShowModal}
            toastRef={toastRef}
            setReloadUserInfo={setReloadUserInfo}
          />
        )
        setShowModal(true)
        break
      case "email":
        setRenderComponent(
          <ChangeEmailForm
            email={userInfo.email}
            setShowModal={setShowModal}
            toastRef={toastRef}
            setReloadUserInfo={setReloadUserInfo}
          />
        )
        setShowModal(true)
        break
      case "password":
        setRenderComponent(
          <ChangePasswordForm setShowModal={setShowModal} toastRef={toastRef} />
        )
        setShowModal(true)
        break
      default:
        setRenderComponent(null)
        setShowModal(false)
        break
    }
  }
  const menuOptions = generateOptions(selectedComponent)

  return (
    <ScrollView>
      {map(menuOptions, (menu, index) => (
        <ListItem
          key={index}
          containerStyle={styles.menuItem}
          onPress={menu.onPress}
        >
          <Icon
            name={menu.iconNameLeft}
            type={menu.iconType}
            color={menu.iconColorLeft}
          />
          <ListItem.Content>
            <ListItem.Title>{menu.title}</ListItem.Title>
          </ListItem.Content>
          <Icon
            name={menu.iconNameRight}
            type={menu.iconType}
            color={menu.iconColorLeft}
          />
        </ListItem>
      ))}
      {renderComponent && (
        <Modal isVisible={showModal} setShowModal={setShowModal}>
          {renderComponent}
        </Modal>
      )}
    </ScrollView>
  )
}

function generateOptions(selectedComponent) {
  return [
    {
      title: "Cambiar Nombre y Apellido",
      iconType: "material-community",
      iconNameLeft: "account-circle",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      onPress: () => selectedComponent("displayName")
    },
    {
      title: "Cambiar Email",
      iconType: "material-community",
      iconNameLeft: "at",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      onPress: () => selectedComponent("email")
    },
    {
      title: "Cambiar contraseña",
      iconType: "material-community",
      iconNameLeft: "lock-reset",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      onPress: () => selectedComponent("password")
    }
  ]
}

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#c3c3c3"
  }
})

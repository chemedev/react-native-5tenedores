import React, { useState } from "react"
import { View, StyleSheet, Text } from "react-native"
import { Input, Button } from "react-native-elements"
import { getAuth, updatePassword } from "firebase/auth"
import { reauthenticate } from "../../utils/api"

export default function ChangeEmailForm(props) {
  const { email, setShowModal, toastRef, setReloadUserInfo } = props
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    repeatNewPassword: ""
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const auth = getAuth()

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text })
  }

  const onSubmit = async () => {
    let isSetErrors = true
    let errorsTemp = {}
    setErrors({})
    if (
      !formData.password ||
      !formData.newPassword ||
      !formData.repeatNewPassword
    ) {
      errorsTemp = {
        password: !formData.password
          ? "La contraseña no puede estar vacía"
          : "",
        newPassword: !formData.newPassword
          ? "La contraseña no puede estar vacía"
          : "",
        repeatNewPassword: !formData.repeatNewPassword
          ? "La contraseña no puede estar vacía"
          : ""
      }
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      errorsTemp = {
        newPassword: "Las contraseñas no son iguales",
        repeatNewPassword: "Las contraseñas no son iguales"
      }
    } else if (formData.newPassword.length < 6) {
      errorsTemp = {
        newPassword: "La contraseña debe ser mayor o igual a 6 chars",
        repeatNewPassword: "La contraseña debe ser mayor o igual a 6 chars"
      }
    } else {
      await reauthenticate(formData.password)
        .then(
          async () =>
            await updatePassword(auth.currentUser, formData.newPassword)
              .then(() => {
                isSetErrors = false
                setShowModal(false)
                auth.signOut()
              })
              .catch(() => {
                errorsTemp = {
                  other: "Error al actualizar la contraseña"
                }
              })
        )
        .catch(() => {
          errorsTemp = {
            password: "No se ha podido actualizar la contraseña"
          }
        })
        .finally(() => setIsLoading(false))
    }
    isSetErrors && setErrors(errorsTemp)
  }

  return (
    <View style={styles.view}>
      <Input
        placeholder="Contraseña actual"
        containerStyle={styles.input}
        secureTextEntry={true}
        rightIcon={{
          type: "material-community",
          name: "eye-outline",
          color: "#c2c2c2"
        }}
        defaultValue={email || ""}
        onChange={e => onChange(e, "password")}
        errorMessage={errors.password}
      />
      <Input
        placeholder="Contraseña nueva"
        containerStyle={styles.input}
        secureTextEntry={true}
        onChange={e => onChange(e, "newPassword")}
        errorMessage={errors.newPassword}
        rightIcon={{
          type: "material-community",
          name: "eye-outline",
          color: "#c2c2c2"
        }}
      />
      <Input
        placeholder="Repetir contraseña nueva"
        containerStyle={styles.input}
        secureTextEntry={true}
        onChange={e => onChange(e, "repeatNewPassword")}
        errorMessage={errors.repeatNewPassword}
        rightIcon={{
          type: "material-community",
          name: "eye-outline",
          color: "#c2c2c2"
        }}
      />
      <Button
        title="Cambiar contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      />
      <Text>{errors.others}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  input: {
    marginBottom: 10
  },
  btnContainer: {
    marginTop: 20,
    width: "95%"
  },
  btn: {
    backgroundColor: "#00a680"
  }
})

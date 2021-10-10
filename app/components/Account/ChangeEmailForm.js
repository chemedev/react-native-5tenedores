import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Input, Button } from "react-native-elements"
import { getAuth, updateEmail } from "firebase/auth"
import { validateEmail } from "../../utils/validations"
import { reauthenticate } from "../../utils/api"

export default function ChangeEmailForm(props) {
  const { email, setShowModal, toastRef, setReloadUserInfo } = props
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const auth = getAuth()

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text })
  }

  const onSubmit = () => {
    setErrors({})
    if (!formData.email || email == formData.email) {
      setErrors({
        email: "El email no ha cambiado"
      })
    } else if (!validateEmail(formData.email)) {
      setErrors({
        email: "El email no es válido"
      })
    } else if (!formData.password) {
      setErrors({
        password: "La contraseña no puede estar vacía"
      })
    } else {
      setIsLoading(true)
      reauthenticate(formData.password)
        .then(() => {
          updateEmail(auth.currentUser, formData.email).then(() => {
            toastRef.current.show("Email actualizado correctamente")
            setShowModal(false)
            setReloadUserInfo(true)
          })
        })
        .catch(() => {
          setErrors({ password: "La contraseña no es correcta" })
        })
        .finally(() => setIsLoading(false))
    }
  }

  return (
    <View style={styles.view}>
      <Input
        placeholder="Correo electrónico"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2"
        }}
        defaultValue={email || ""}
        onChange={e => onChange(e, "email")}
        errorMessage={errors.email}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        secureTextEntry={true}
        onChange={e => onChange(e, "password")}
        errorMessage={errors.password}
        rightIcon={{
          type: "material-community",
          name: "eye-outline",
          color: "#c2c2c2"
        }}
      />
      <Button
        title="Cambiar email"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      />
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

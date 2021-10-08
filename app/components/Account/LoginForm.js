import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Input, Icon, Button } from "react-native-elements"
import { isEmpty } from "lodash"
import { validateEmail } from "../../utils/validations"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useNavigation } from "@react-navigation/native"
import Loading from "../Loading"

export default function LoginForm(props) {
  const { toastRef } = props
  const navigation = useNavigation()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text })
  }

  const onSubmit = () => {
    if (isEmpty(formData.email) || isEmpty(formData.password)) {
      toastRef.current.show("Todos los campos son obligatorios")
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("El email es inválido")
    } else {
      setLoading(true)
      const auth = getAuth()
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then(() => {
          setLoading(false)
          navigation.navigate("account")
        })
        .catch(() => {
          setLoading(false)
          toastRef.current.show("Credenciales inválidas")
        })
    }
  }

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo electrónico"
        containerStyle={styles.inputForm}
        onChange={e => onChange(e, "email")}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        secureTextEntry={!showPassword}
        onChange={e => onChange(e, "password")}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Button
        title="Iniciar sesión"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text="Iniciando sesión" />
    </View>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  inputForm: {
    width: "100%",
    marginTop: 20
  },
  btnContainerLogin: {
    marginTop: 20,
    width: "95%"
  },
  btnLogin: {
    backgroundColor: "#00a680"
  },
  iconRight: {
    color: "#c1c1c1"
  }
})

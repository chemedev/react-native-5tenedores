import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Input, Icon, Button } from "react-native-elements"
import { validateEmail } from "../../utils/validations"
import { size, isEmpty } from "lodash"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useNavigation } from "@react-navigation/native"

export default function RegisterForm(props) {
  const { toastRef } = props
  const { navigate } = useNavigation()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState(defaultFormValues())

  const onSubmit = () => {
    if (
      isEmpty(formData.email) ||
      isEmpty(formData.password) ||
      isEmpty(formData.repeatPassword)
    ) {
      toastRef.current.show("Todos los campos son obligatorios")
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("El email no es correcto")
    } else if (formData.password !== formData.repeatPassword) {
      toastRef.current.show("Las contraseñas tienen que ser iguales")
    } else if (size(formData.password) < 6) {
      toastRef.current.show(
        "La contraseña tiene que tener al menos 6 caracteres"
      )
    } else {
      const auth = getAuth()
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then(() => navigate("account"))
        .catch(() =>
          toastRef.current.show("Error al crear cuenta, revise sus datos.")
        )
    }
  }

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text })
  }

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo electrónico"
        containerStyle={styles.inputForm}
        onChange={e => onChange(e, "email")}
        rightIcon={
          <Icon type="material-community" name="at" style={styles.iconRight} />
        }
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        secureTextEntry={showPassword ? false : true}
        onChange={e => onChange(e, "password")}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            style={styles.iconRight}
            onPress={() => setShowPassword(state => !state)}
          />
        }
      />
      <Input
        placeholder="Repetir contraseña"
        containerStyle={styles.inputForm}
        secureTextEntry={showPassword ? false : true}
        onChange={e => onChange(e, "repeatPassword")}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            style={styles.iconRight}
            onPress={() => setShowPassword(state => !state)}
          />
        }
      />
      <Button
        title="Unirse"
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={onSubmit}
      />
    </View>
  )
}

function defaultFormValues() {
  return {
    email: "",
    password: "",
    repeatPassword: ""
  }
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
  btnContainerRegister: {
    marginTop: 20,
    width: "95%"
  },
  btnRegister: {
    backgroundColor: "#00a680"
  },
  iconRight: {
    color: "#c1c1c1"
  }
})

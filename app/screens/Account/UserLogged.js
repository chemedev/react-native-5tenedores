import React, { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Button } from "react-native-elements"
import { getAuth, signOut } from "firebase/auth"
import Toast from "react-native-easy-toast"
import Loading from "../../components/Loading"
import InfoUser from "../../components/Account/InfoUser"
import AccountOptions from "../../components/Account/AccountOptions"

export default function UserLogged() {
  const auth = getAuth()
  const toastRef = useRef()
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState(" ")
  const [userInfo, setUserInfo] = useState(null)
  const [reloadUserInfo, setReloadUserInfo] = useState(false)

  useEffect(() => {
    ;(() => {
      const user = auth.currentUser
      setUserInfo(user)
    })()
    setReloadUserInfo(false)
  }, [reloadUserInfo])

  return (
    <View style={styles.viewUserInfo}>
      {userInfo && (
        <InfoUser
          toastRef={toastRef}
          userInfo={userInfo}
          setLoading={setLoading}
          setLoadingText={setLoadingText}
        />
      )}

      <AccountOptions userInfo={userInfo} toastRef={toastRef} setReloadUserInfo={setReloadUserInfo} />

      <Button
        buttonStyle={styles.btnCloseSession}
        titleStyle={styles.btnCloseSessionText}
        title="Cerrar sesión"
        onPress={() => signOut(auth)}
      />
      <Toast ref={toastRef} position="center" opacity={0.75} />
      <Loading text={loadingText} isVisible={loading} />
    </View>
  )
}

const styles = StyleSheet.create({
  viewUserInfo: {
    maxHeight: "100%",
    borderColor: "f2f2f2"
  },
  btnCloseSession: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingTop: 10,
    paddingBottom: 10
  },
  btnCloseSessionText: {
    color: "#00a680"
  }
})

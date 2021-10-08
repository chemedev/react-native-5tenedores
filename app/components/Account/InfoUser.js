import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { Avatar } from "react-native-elements"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getAuth, updateProfile } from "firebase/auth"

export default function InfoUser(props) {
  const {
    userInfo: { uid, photoURL, displayName, email },
    toastRef,
    setLoading,
    setLoadingText
  } = props

  const storage = getStorage()
  const auth = getAuth()
  const storageRef = ref(storage, `avatar/${uid}`)

  const changeAvatar = async () => {
    const resultPermission = await Permissions.getAsync(
      Permissions.MEDIA_LIBRARY
    )
    const resultPermissionCamera =
      resultPermission.permissions.mediaLibrary.status

    if (resultPermissionCamera === "denied") {
      toastRef.current.show("Es necesario aceptar los permisos de la galería")
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      })

      if (result.cancelled) {
        toastRef.current.show("Has cerrado la selección de imagenes")
      } else {
        uploadImage(result.uri)
      }
    }
  }

  const uploadImage = async uri => {
    setLoadingText("Actualizando avatar")
    setLoading(true)

    const response = await fetch(uri)
    const blob = await response.blob()

    uploadBytes(storageRef, blob)
      .then(() => {
        updatePhotoUrl()
        toastRef.current.show("Avatar subido correctamente")
      })
      .catch(() => {
        toastRef.current.show("Error al actualizar el avatar")
      })
  }

  const updatePhotoUrl = async () => {
    const url = await getDownloadURL(storageRef)
    updateProfile(auth.currentUser, { photoURL: url })
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        toastRef.current.show("Error al actualizar el avatar")
      })
  }

  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        containerStyle={styles.userInfoAvatar}
        source={
          photoURL
            ? { uri: photoURL }
            : require("../../../assets/img/avatar-default.jpg")
        }
      >
        <Avatar.Accessory size={25} onPress={changeAvatar} />
      </Avatar>
      <View>
        <Text style={styles.displayName}>
          {displayName ? displayName : "Anónimo"}
        </Text>
        <Text>{email ? email : "Social Login"}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingTop: 30,
    paddingBottom: 30
  },
  userInfoAvatar: {
    marginRight: 20
  },
  displayName: {
    fontWeight: "bold",
    paddingBottom: 5
  }
})

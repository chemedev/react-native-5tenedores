import React, { useState } from "react"
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native"
import { Icon, Avatar, Image, Input, Button } from "react-native-elements"
import * as MediaLibrary from "expo-media-library"
import * as ImagePicker from "expo-image-picker"
import { filter, map, size } from "lodash"

const widthScreen = Dimensions.get("window").width

export default function AddRestaurantForm(props) {
  const { toastRef, setIsLoading, navigation } = props
  const [restaurantName, setRestaurantName] = useState("")
  const [restaurantAddress, setRestaurantAddress] = useState("")
  const [restaurantDescription, setRestaurantDescription] = useState("")
  const [imagesSelected, setImagesSelected] = useState([])

  const addRestaurant = () => {
    console.log(restaurantName)
    console.log(restaurantAddress)
    console.log(restaurantDescription)
  }

  return (
    <ScrollView style={StyleSheet.scrollView}>
      <ImageRestaurant imageRestaurant={imagesSelected[0]} />
      <FormAdd
        setRestaurantName={setRestaurantName}
        setRestaurantAddress={setRestaurantAddress}
        setRestaurantDescription={setRestaurantDescription}
      />
      <UploadImage
        toastRef={toastRef}
        setImagesSelected={setImagesSelected}
        imagesSelected={imagesSelected}
      />
      <Button
        title="Crear Restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      />
    </ScrollView>
  )
}

function ImageRestaurant({ imageRestaurant }) {
  return (
    <View style={styles.viewPhoto}>
      <Image
        source={
          imageRestaurant
            ? { uri: imageRestaurant }
            : { uri: require("../../../assets/img/no-image.png") }
        }
        style={{ width: widthScreen, height: 200 }}
      />
    </View>
  )
}

function FormAdd(props) {
  const { setRestaurantName, setRestaurantAddress, setRestaurantDescription } =
    props
  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={e => setRestaurantName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Dirección"
        containerStyle={styles.input}
        onChange={e => setRestaurantAddress(e.nativeEvent.text)}
      />
      <Input
        placeholder="Descripción del restaurante"
        multiline={true}
        containerStyle={styles.textArea}
        onChange={e => setRestaurantDescription(e.nativeEvent.text)}
      />
    </View>
  )
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }) {
  const imageSelect = async () => {
    const resultPermission = await MediaLibrary.requestPermissionsAsync()
    const resultPermissionCamera = resultPermission.status

    if (resultPermissionCamera === "denied") {
      toastRef.current.show(
        "Es necesario aceptar los permisos de la galería",
        3000
      )
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      })

      if (result.cancelled) {
        toastRef.current.show("Has cerrado la selección de imagenes", 2000)
      } else {
        setImagesSelected([...imagesSelected, result.uri])
      }
    }
  }

  const removeImage = image => {
    Alert.alert(
      "Eliminar Imagen",
      "¿Estás seguro de que quieres eliminar la imagen?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => {
            setImagesSelected(
              filter(imagesSelected, imageUrl => imageUrl !== image)
            )
          }
        }
      ],
      { cancelable: false }
    )
  }

  return (
    <View style={styles.viewImages}>
      {size(imagesSelected) < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {map(imagesSelected, (imageRestaurant, i) => (
        <Avatar
          key={i}
          style={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
          onPress={() => removeImage(imageRestaurant)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%"
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10
  },
  input: {
    marginBottom: 10
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20
  },
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3"
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10
  },
  viewPhoto: {
    alignItems: 20,
    height: 200,
    marginBottom: 20
  }
})

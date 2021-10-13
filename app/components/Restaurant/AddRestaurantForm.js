import React, { useEffect, useState } from "react"
import { StyleSheet, View, Alert, Dimensions } from "react-native"
import { Icon, Avatar, Image, Input, Button } from "react-native-elements"
import { filter, map, size } from "lodash"
import * as MediaLibrary from "expo-media-library"
import * as ImagePicker from "expo-image-picker"
import * as Location from "expo-location"
// import MapView from "react-native-maps"
// import { Marker } from "react-native-maps"
import Modal from "../Modal"
import { v4 as uuidv4 } from "uuid"

import { getAuth } from "firebase/auth"
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage"
import { getFirestore, addDoc, collection } from "firebase/firestore"

const widthScreen = Dimensions.get("window").width

export default function AddRestaurantForm(props) {
  const { toastRef, setIsLoading, navigation } = props
  const [restaurantName, setRestaurantName] = useState("")
  const [restaurantAddress, setRestaurantAddress] = useState("")
  const [restaurantDescription, setRestaurantDescription] = useState("")
  const [imagesSelected, setImagesSelected] = useState([])
  const [isVisibleMap, setIsVisibleMap] = useState(false)
  const [locationRestaurant, setLocationRestaurant] = useState(null)

  const db = getFirestore()
  const auth = getAuth()
  const storage = getStorage()

  const addRestaurant = () => {
    console.log(navigation)
    // if (!restaurantName || !restaurantAddress || !restaurantDescription) {
    if (!restaurantName || !restaurantDescription) {
      toastRef.current.show("Todos los campos del formulario son obligatorios")
    } else if (size(imagesSelected) === 0) {
      toastRef.current.show("El restaurante tiene que tener al menos una foto")
      // } else if (!locationRestaurant) {
      //   toastRef.current.show("Tienes que localizar el restaurante en el mapa")
    } else {
      setIsLoading(true)
      uploadImageStorage()
        .then(async response => {
          await addDoc(collection(db, "restaurants"), {
            name: restaurantName,
            address: restaurantAddress,
            description: restaurantDescription,
            location: locationRestaurant,
            images: response,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createdAt: new Date(),
            createdBy: auth.currentUser.uid
          })
          setIsLoading(false)
          toastRef.current.show("Restaurante creado.")
          navigation.navigate("screen-restaurants")
        })
        .catch(() => {
          toastRef.current.show(
            "Error al subir el restaurante, intentelo más tarde"
          )
          setIsLoading(false)
        })
    }
  }

  const uploadImageStorage = async () => {
    const imageBlob = []
    setIsLoading(true)

    await Promise.all(
      map(imagesSelected, async image => {
        const response = await fetch(image)
        const blob = await response.blob()
        const storageRef = ref(storage, `restaurants/${uuidv4()}`)

        await uploadBytes(storageRef, blob)
          .then(async () => {
            const photoUrl = await getDownloadURL(storageRef)
            imageBlob.push(photoUrl)
          })
          .catch(() => toastRef.current.show("Error al cargar imagen"))
      })
    )

    return imageBlob
  }

  return (
    <View style={StyleSheet.view}>
      <ImageRestaurant imageRestaurant={imagesSelected[0]} />
      <FormAdd
        setRestaurantName={setRestaurantName}
        setRestaurantAddress={setRestaurantAddress}
        setRestaurantDescription={setRestaurantDescription}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
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
      {/* <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
      /> */}
    </View>
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
  const {
    setRestaurantName,
    setRestaurantAddress,
    setRestaurantDescription,
    setIsVisibleMap,
    locationRestaurant
  } = props
  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={e => setRestaurantName(e.nativeEvent.text)}
      />
      {/* <Input
        placeholder="Dirección"
        containerStyle={styles.input}
        onChange={e => setRestaurantAddress(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant ? "#00a680" : "#c2c2c2",
          onPress: () => {
            setIsVisibleMap(true)
          }
        }}
      /> */}
      <Input
        placeholder="Descripción del restaurante"
        multiline={true}
        containerStyle={styles.textArea}
        onChange={e => setRestaurantDescription(e.nativeEvent.text)}
      />
    </View>
  )
}

function Map({
  toastRef,
  isVisibleMap,
  setIsVisibleMap,
  setLocationRestaurant
}) {
  const [location, setLocation] = useState(null)
  useEffect(() => {
    ;(async () => {
      const { status } = await Location.getForegroundPermissionsAsync()
      if (status !== "granted") {
        toastRef.current.show(
          "Es necesario aceptar los permisos de localizacion",
          3000
        )
      } else {
        const {
          coords: { longitude, latitude }
        } = await Location.getCurrentPositionAsync({})
        setLocation({
          latitude,
          longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        })
      }
    })()
  }, [])

  const confirmLocation = () => {
    setLocationRestaurant(location)
    toastRef.current.show("Localización guardada correctamente")
    setIsVisibleMap(false)
  }

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {/* {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={region => setLocation(region)}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              draggable
            />
          </MapView>
        )} */}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar Ubicación"
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          />
          <Button
            title="Cancelar Ubicación"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
  )
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }) {
  const imageSelect = async () => {
    const resultPermission = await MediaLibrary.requestPermissionsAsync()
    const { status } = resultPermission

    if (status === "denied") {
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
  view: {
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
    alignItems: "center",
    height: 200,
    marginBottom: 20
  },
  mapStyle: {
    width: "100%",
    height: 550
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d"
  },
  viewMapBtnContainerSave: {
    paddingRight: 5
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680"
  }
})

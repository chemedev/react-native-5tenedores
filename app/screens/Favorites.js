import React, { useState, useRef, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from "react-native"
import { Image, Icon, Button } from "react-native-elements"
import { useFocusEffect } from "@react-navigation/native"
import Toast from "react-native-easy-toast"
import Loading from "../components/Loading"

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  getDocs,
  deleteDoc,
  where
} from "firebase/firestore"
import { getAuth } from "@firebase/auth"

export default function Favorites({ navigation }) {
  const [restaurants, setRestaurants] = useState(null)
  const [userLogged, setUserLogged] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [reloadData, setReloadData] = useState(false)
  const toastRef = useRef()

  const db = getFirestore()
  const auth = getAuth()

  auth.onAuthStateChanged(user =>
    user ? setUserLogged(true) : setUserLogged(false)
  )

  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        const q = query(
          collection(db, "favorites"),
          where("idUser", "==", auth.currentUser.uid)
        )
        getDocs(q).then(snap => {
          const idRestaurantsArray = []
          snap.forEach(doc => {
            idRestaurantsArray.push(doc.data().idRestaurant)
          })
          getDataRestaurant(idRestaurantsArray).then(res => {
            const restaurants = []
            res.forEach(doc => {
              const restaurant = doc.data()
              restaurant.id = doc.id
              restaurants.push(restaurant)
            })
            setRestaurants(restaurants)
          })
        })
      }
      setReloadData(false)
    }, [userLogged, reloadData])
  )

  const getDataRestaurant = idRestaurantsArray => {
    const arrayRestaurants = []
    idRestaurantsArray.forEach(idRestaurant => {
      const docRef = doc(collection(db, "restaurants"), idRestaurant)
      const result = getDoc(docRef)
      arrayRestaurants.push(result)
    })

    return Promise.all(arrayRestaurants)
  }

  if (!userLogged) return <UserNotLogged navigation={navigation} />

  if (!restaurants)
    return <Loading isVisible={true} text="Cargando restaurantes" />

  if (restaurants?.length === 0) return <NotFoundRestaurants />

  return (
    <View style={styles.viewBody}>
      {restaurants ? (
        <FlatList
          data={restaurants}
          renderItem={restaurant => (
            <Restaurant
              restaurant={restaurant}
              isLoading={isLoading}
              toastRef={toastRef}
              setReloadData={setReloadData}
              navigation={navigation}
            />
          )}
          keyExtractor={(_item, idx) => idx.toString()}
        />
      ) : (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center" }}>Cargando restaurantes</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text="Eliminando restaurante" isVisible={isLoading} />
    </View>
  )
}

function NotFoundRestaurants() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        No tienes restaurantes en tu lista
      </Text>
    </View>
  )
}

function UserNotLogged({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        Necesitas estar logeado para ver esta sección
      </Text>
      <Button
        title="Ir al login"
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "#00a680" }}
        onPress={() => navigation.navigate("login")}
      />
    </View>
  )
}

function Restaurant({ restaurant, isLoading, toastRef, navigation }) {
  const { images, name, id } = restaurant.item

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar restaurante de favoritos",
      "¿Estás seguro que quieres eliminarlo?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: removeFavorite
        }
      ],
      { cancelable: false }
    )
  }

  const removeFavorite = () => {
    const q = query(
      collection(db, "favorites"),
      where("idRestaurant", "==", id),
      where("idUser", "==", auth.currentUser.uid)
    )

    setIsLoading(true)
    getDocs(q)
      .then(snap => {
        snap.forEach(doc => {
          deleteDoc(doc.ref)
        })
      })
      .then(() => {
        setReloadData(true)
        toastRef.current.show("Restaurante eliminado correctamente")
      })
      .catch(() => toastRef.current.show("Error al eliminar el restaurante"))
      .finally(() => setIsLoading(false))
  }

  return (
    <View style={styles.restaurant}>
      <TouchableOpacity
        onPress={() => navigation.navigate("screen-restaurant", { id })}
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={
            images[0]
              ? { uri: images[0] }
              : require("../../assets/img/no-image.png")
          }
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon
            type="material-community"
            name="heart"
            color="#f00"
            containerStyle={styles.favorites}
            onPress={confirmRemoveFavorite}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2"
  },
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10
  },
  restaurant: {
    margin: 10
  },
  image: {
    width: "100%",
    height: 180
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff"
  },
  name: {
    fontWeight: "bold",
    fontSize: 30
  },
  favorites: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100
  }
})

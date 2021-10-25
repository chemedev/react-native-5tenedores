import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
  useEffect
} from "react"
import { StyleSheet, ScrollView, Text, View, Dimensions } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { ListItem, Rating, Icon } from "react-native-elements"
import Loading from "../../components/Loading"
import CarouselImages from "../../components/Carousel"
// import Map from "../../components/Map"
import { map } from "lodash"
import ListReviews from "../../components/Restaurant/ListReviews"
import Toast from "react-native-easy-toast"

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  getDocs,
  where,
  deleteDoc
} from "firebase/firestore"
import { getAuth } from "@firebase/auth"

export default function Restaurant({
  navigation,
  route: {
    params: { id, name }
  }
}) {
  const [restaurant, setRestaurant] = useState(null)
  const [rating, setRating] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [userLogged, setUserLogged] = useState(false)
  const toastRef = useRef()

  const db = getFirestore()
  const auth = getAuth()
  const screenWidth = Dimensions.get("window").width

  auth.onAuthStateChanged(user =>
    user ? setUserLogged(true) : setUserLogged(false)
  )

  useLayoutEffect(() => {
    navigation.setOptions({ title: name })
  }, [navigation])

  useFocusEffect(
    useCallback(() => {
      const docRef = doc(db, "restaurants", id)
      getDoc(docRef).then(snap => {
        const data = snap.data()
        data.id = snap.id
        setRestaurant(data)
        setRating(data.rating)
      })
    }, [])
  )

  useEffect(() => {
    if (userLogged && restaurant) {
      const q = query(
        collection(db, "favorites"),
        where("idRestaurant", "==", restaurant.id),
        where("idUser", "==", auth.currentUser.uid)
      )
      getDocs(q).then(snap => {
        if (snap.docs.length === 1) setIsFavorite(true)
      })
    }
  }, [userLogged, restaurant])

  const addFavorite = async () => {
    if (!userLogged) {
      toastRef.current.show(
        "Para usar el sistema de favoritos tienes que estar logeado"
      )
    } else {
      addDoc(collection(db, "favorites"), {
        idUser: auth.currentUser.uid,
        idRestaurant: restaurant.id
      })
        .then(() => {
          setIsFavorite(true)
          toastRef.current.show("Restaurant añadido a favoritos")
        })
        .catch(() => {
          toastRef.current.show("Error al añadir el restaurante a favoritos")
        })
    }
  }

  const removeFavorite = async () => {
    const q = query(
      collection(db, "favorites"),
      where("idRestaurant", "==", restaurant.id),
      where("idUser", "==", auth.currentUser.uid)
    )

    getDocs(q)
      .then(snap => {
        snap.forEach(doc => {
          deleteDoc(doc.ref)
        })
      })
      .then(() => {
        setIsFavorite(false)
        toastRef.current.show("Restaurante eliminado de favoritos")
      })
      .catch(() =>
        toastRef.current.show("Error al eliminar el restaurante a favoritos")
      )
  }

  if (!restaurant) return <Loading isVisible={true} text="Cargando..." />

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#f00" : "#000"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <CarouselImages
        arrayImages={restaurant.images}
        height={250}
        width={screenWidth}
      />
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={restaurant.rating}
      />
      <RestaurantInfo
        name={restaurant.name}
        address={restaurant.address}
        location={restaurant.location}
      />
      <ListReviews navigation={navigation} idRestaurant={restaurant.id} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  )
}

function TitleRestaurant({ name, description, rating }) {
  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  )
}

function RestaurantInfo({ name, address }) {
  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null
    },
    {
      text: "111 222 333",
      iconName: "phone",
      iconType: "material-community",
      action: null
    },
    {
      text: "sadsa@email.com",
      iconName: "at",
      iconType: "material-community",
      action: null
    }
  ]

  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>{name}</Text>
      {/* <Map location={location} name={name} height={100} /> */}
      {map(listInfo, (item, idx) => (
        <ListItem key={idx} containerStyle={styles.containerListItem}>
          <Icon
            name={item.iconName}
            type={item.iconType}
            title={item.text}
            color={"#00a680"}
          />
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff"
  },
  viewRestaurantTitle: {
    padding: 15
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold"
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "grey"
  },
  rating: {
    position: "absolute",
    right: 0
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15
  }
})

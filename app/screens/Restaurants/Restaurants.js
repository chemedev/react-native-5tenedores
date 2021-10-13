import React, { useCallback, useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { Icon } from "react-native-elements"
import { useFocusEffect } from "@react-navigation/native"
import { getAuth } from "firebase/auth"
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter
} from "firebase/firestore"
import ListRestaurants from "../../components/Restaurant/ListRestaurants"

export default function Restaurants({ navigation }) {
  const auth = getAuth()
  const db = getFirestore()

  const [user, setUser] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [totalRestaurants, setTotalRestaurants] = useState(0)
  const [startRestaurants, setStartRestaurants] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    auth.onAuthStateChanged(userInfo => {
      setUser(userInfo)
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      const resultRestaurants = []
      const q = query(
        collection(db, "restaurants"),
        orderBy("createdAt", "desc"),
        limit(7)
      )

      getDocs(q).then(snap => {
        setStartRestaurants(snap.docs[snap.docs.length - 1])

        snap.forEach(doc => {
          const restaurant = doc.data()
          restaurant.id = doc.id

          resultRestaurants.push(restaurant)
        })
        setRestaurants(resultRestaurants)
      })
    }, [])
  )

  const handleLoadMore = () => {
    const resultRestaurants = []
    restaurants.length < totalRestaurants && setIsLoading(true)

    const q = query(
      collection(db, "restaurants"),
      orderBy("createdAt", "desc"),
      startAfter(startRestaurants.data().createdAt),
      limit(7)
    )

    getDocs(q).then(snap => {
      if (snap.docs.length > 0)
        setStartRestaurants(snap.docs[snap.docs.length - 1])
      else setIsLoading(false)

      snap.forEach(doc => {
        const restaurant = doc.data()
        restaurant.id = doc.id

        resultRestaurants.push(restaurant)
      })
      setRestaurants([...restaurants, ...resultRestaurants])
    })
  }

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
        restaurants={restaurants}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
      />

      {user && (
        <Icon
          type="material-community"
          name="plus"
          color="#00a680"
          reverse
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("screen-add-restaurant")}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    borderColor: "#fff"
  },
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.05
  }
})

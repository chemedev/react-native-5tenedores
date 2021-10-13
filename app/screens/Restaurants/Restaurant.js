import React, { useEffect, useLayoutEffect, useState } from "react"
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import Loading from "../../components/Loading"
import CarouselImages from "../../components/Carousel"

export default function Restaurant({
  navigation,
  route: {
    params: { id, name }
  }
}) {
  const [restaurant, setRestaurant] = useState(null)
  const db = getFirestore()
  const screenWidth = Dimensions.get("window").width

  useLayoutEffect(() => {
    navigation.setOptions({ title: name })
  }, [navigation])

  useEffect(() => {
    const docRef = doc(db, "restaurants", id)
    getDoc(docRef).then(snap => {
      const data = snap.data()
      data.id = snap.id
      setRestaurant(data)
    })
  }, [])

  if (!restaurant) return <Loading isVisible={true} text="Cargando..." />

  return (
    <ScrollView vertical style={styles.viewBody}>
      <CarouselImages
        arrayImages={restaurant.images}
        height={250}
        width={screenWidth}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff"
  }
})

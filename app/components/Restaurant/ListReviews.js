import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Button, Avatar, Rating } from "react-native-elements"
import { map, orderBy } from "lodash"
import { getAuth } from "firebase/auth"
import {
  getFirestore,
  getDocs,
  where,
  collection,
  query
} from "firebase/firestore"

export default function ListReviews({ navigation, idRestaurant }) {
  const [userLogged, setUserLogged] = useState(false)
  const [reviews, setReviews] = useState([])
  console.log(reviews)

  getAuth().onAuthStateChanged(user => {
    user ? setUserLogged(true) : setUserLogged(false)
  })

  useEffect(() => {
    const db = getFirestore()
    const reviewsRef = collection(db, "reviews")
    const q = query(reviewsRef, where("idRestaurant", "==", idRestaurant))
    getDocs(q).then(snap => {
      const resultReview = []
      snap.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        resultReview.push(data)
      })
      setReviews(resultReview)
    })
  }, [])

  return (
    <View>
      {userLogged ? (
        <Button
          title="Escribe una opinión"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#00a680"
          }}
          onPress={() =>
            navigation.navigate("screen-add-review-restaurant", {
              idRestaurant
            })
          }
        />
      ) : (
        <View>
          <Text
            style={{ textAlign: "center", color: "#00a680", padding: 20 }}
            onPress={() => {
              navigation.navigate("login")
            }}
          >
            Para escribir un comentario es necesario estar logeado,
            <Text style={{ fontWeight: "bold" }}>
              pulsa AQUÍ para iniciar sesión.
            </Text>
          </Text>
        </View>
      )}
      {map(orderBy(reviews, ["createdAt.seconds"], ["desc"]), (review, idx) => (
        <Review key={idx} review={review} />
      ))}
    </View>
  )
}

function Review({ review: { title, review, rating, createdAt, avatarUser } }) {
  const createdReview = new Date(createdAt.seconds * 1000)

  return (
    <View style={styles.viewReview}>
      <View style={styles.viewImageAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.imageAvatarUser}
          source={
            avatarUser
              ? { uri: avatarUser }
              : require("../../../assets/img/avatar-default.jpg")
          }
        />
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{review}</Text>
        <Rating imageSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewDate}>
          {createdReview.getDate()}/{createdReview.getMonth() + 1}/
          {createdReview.getFullYear()} - {createdReview.getHours()}:
          {createdReview.getMinutes() < 10 ? "0" : ""}
          {createdReview.getMinutes()}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent"
  },
  btnTitleAddReview: {
    color: "#00a680"
  },
  viewReview: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1
  },
  viewImageAvatar: {
    marginRight: 15
  },
  imageAvatarUser: {
    width: 50,
    height: 50
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start"
  },
  reviewTitle: {
    fontWeight: "bold"
  },
  reviewText: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5
  },
  reviewDate: {
    marginTop: 5,
    color: "grey",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0
  }
})

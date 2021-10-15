import React, { useState, useRef, useEffect } from "react"
import { StyleSheet, Text, View } from "react-native"
import { AirbnbRating, Button, Input } from "react-native-elements"
import Toast from "react-native-easy-toast"
import Loading from "../../components/Loading"
import { getAuth } from "firebase/auth"
import {
  collection,
  getFirestore,
  addDoc,
  getDoc,
  doc,
  updateDoc
} from "firebase/firestore"

export default function AddReviewRestaurant({
  route: {
    params: { idRestaurant }
  },
  navigation
}) {
  const [rating, setRating] = useState(null)
  const [title, setTitle] = useState("")
  const [review, setReview] = useState("")
  const [isLoading, setisLoading] = useState(false)
  const toastRef = useRef()

  const addReview = () => {
    if (!rating) {
      toastRef.current.show("No has dado ninguna puntuación")
    } else if (!title) {
      toastRef.current.show("El título es obligatorio")
    } else if (!review) {
      toastRef.current.show("El comentario es obligatorio")
    } else {
      setisLoading(true)
      const db = getFirestore()
      const user = getAuth().currentUser
      const payload = {
        idUser: user.uid,
        avatarUser: user.photoURL,
        idRestaurant,
        title,
        review,
        rating,
        createdAt: new Date()
      }

      addDoc(collection(db, "reviews"), payload)
        .then(() => updateRestaurant())
        .catch(() => toastRef.current.show("Error al enviar la review"))
        .finally(() => {
          setisLoading(false)
          navigation.goBack()
        })

      const updateRestaurant = async () => {
        const docRef = doc(db, "restaurants", idRestaurant)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const restaurantData = docSnap.data()
          const ratingTotal = restaurantData.ratingTotal + rating
          const quantityVoting = restaurantData.quantityVoting + 1
          const ratingResult = ratingTotal / quantityVoting

          updateDoc(docRef, {
            rating: ratingResult,
            ratingTotal,
            quantityVoting
          })
        }
      }
    }
  }
  return (
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["Pésimo", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
          size={35}
          onFinishRating={value => setRating(value)}
        />
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Título"
          containerStyle={styles.input}
          onChange={e => setTitle(e.nativeEvent.text)}
        />
        <Input
          placeholder="Comentario"
          multiline
          inputContainerStyle={styles.textArea}
          onChange={e => setReview(e.nativeEvent.text)}
        />
        <Button
          title="Enviar Comentario"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={addReview}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Enviando comentario" />
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2"
  },
  formReview: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    marginTop: 40
  },
  input: {
    marginBottom: 10
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0
  },
  btnContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
    width: "95%"
  },
  btn: {
    backgroundColor: "#00a680"
  }
})

import React, { useEffect, useLayoutEffect, useState } from "react"
import { StyleSheet, ScrollView, Text, View, Dimensions } from "react-native"
import { ListItem, Rating, Icon } from "react-native-elements"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import Loading from "../../components/Loading"
import CarouselImages from "../../components/Carousel"
import Map from "../../components/Map"
import { map } from "lodash"

export default function Restaurant({
  navigation,
  route: {
    params: { id, name }
  }
}) {
  const [restaurant, setRestaurant] = useState(null)
  const [rating, setRating] = useState(0)
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
      setRating(data.rating)
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
    </ScrollView>
  )
}

function TitleRestaurant({ name, description, rating }) {
  console.log(rating)
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

function RestaurantInfo({ location, name, address }) {
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
  }
})

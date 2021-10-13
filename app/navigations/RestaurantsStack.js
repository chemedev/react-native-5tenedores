import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Restaurants from "../screens/Restaurants/Restaurants"
import AddRestaurant from "../screens/Restaurants/AddRestaurant"
import Restaurant from "../screens/Restaurants/Restaurant"

const Stack = createNativeStackNavigator()

export default function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="screen-restaurants"
        component={Restaurants}
        options={{ title: "Restaurantes" }}
      />
      <Stack.Screen
        name="screen-add-restaurant"
        component={AddRestaurant}
        options={{ title: "Añadir nuevo restaurante" }}
      />
      <Stack.Screen name="screen-restaurant" component={Restaurant} />
    </Stack.Navigator>
  )
}

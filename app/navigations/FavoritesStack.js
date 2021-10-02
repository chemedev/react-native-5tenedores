import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Favorites from "../screens/Favorites"

const Stack = createNativeStackNavigator()

export default function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="favorites"
        component={Favorites}
        options={{ title: "Mis Favoritos" }}
      />
    </Stack.Navigator>
  )
}

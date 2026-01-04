import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AdminProductsScreen } from '../screens/AdminProductsScreen';
import { AdminAddProductScreen } from '../screens/AdminAddProductScreen';

export type AdminProductsStackParamList = {
  Products: undefined;
  AddProduct: { productId?: string } | undefined;
};

const Stack =
  createNativeStackNavigator<AdminProductsStackParamList>();

export function AdminProductsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,

        // ✨ GŁÓWNA ANIMACJA
        animation: 'slide_from_right',
        animationDuration: 220,

        // 📱 gest cofania (iOS / Android)
        gestureEnabled: true,

        // 🧠 lepsze „czucie” przejścia
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen
        name="Products"
        component={AdminProductsScreen}
        options={{
          title: 'Produkty',
        }}
      />

      <Stack.Screen
        name="AddProduct"
        component={AdminAddProductScreen}
        options={{
          title: 'Dodaj / edytuj produkt',

          // ➕ trochę „modal feel”
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}

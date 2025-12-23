import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../screens/HomeScreen';
import { AdminProductsScreen } from '../screens/AdminProductsScreen';
import { AdminAddProductScreen } from '../screens/AdminAddProductScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

type AdminStackParamList = {
  Home: undefined;
  Products: undefined;
  AddProduct: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        name="Products"
        component={AdminProductsScreen}
      />

      <Stack.Screen
        name="AddProduct"
        component={AdminAddProductScreen}
        options={{ title: 'Dodaj produkt' }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
}

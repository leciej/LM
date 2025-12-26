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
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={AdminProductsScreen}
        options={{ title: 'Produkty' }}
      />

      <Stack.Screen
        name="AddProduct"
        component={AdminAddProductScreen}
        options={{ title: 'Dodaj / edytuj produkt' }}
      />
    </Stack.Navigator>
  );
}

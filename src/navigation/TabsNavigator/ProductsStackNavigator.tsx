import React from 'react';
import { Text, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProductsScreen } from '../../screens/ProductsScreen';
import { ProductDetailsScreen } from '../../screens/ProductDetailsScreen';
import type { ProductDto } from '../../api/products';

/* =========================
   TYPES
   ========================= */

export type ProductsStackParamList = {
  Products:
    | {
        openSortMenu?: number;
      }
    | undefined;

  ProductDetails: {
    product: ProductDto;
  };
};

/* =========================
   STACK
   ========================= */

const Stack =
  createNativeStackNavigator<ProductsStackParamList>();

/* =========================
   NAVIGATOR
   ========================= */

export function ProductsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={({ navigation }) => ({
          title: 'Produkty',
          headerRight: () => (
            <Pressable
              onPress={() =>
                navigation.navigate({
                  name: 'Products',
                  params: { openSortMenu: Date.now() },
                  merge: true,
                })
              }
              style={{ paddingHorizontal: 16 }}
            >
              <Text style={{ fontSize: 22, fontWeight: '800' }}>
                ☰
              </Text>
            </Pressable>
          ),
        })}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Szczegóły produktu' }}
      />
    </Stack.Navigator>
  );
}

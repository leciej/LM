import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProductsScreen } from '../../screens/ProductsScreen';
import { ProductDetailsScreen } from '../../screens/ProductDetailsScreen';
import type { ProductDto } from '../../api/products';
import type { Source } from '../../features/cart/store/cartStore';

export type ProductsStackParamList = {
  Products: undefined;
  ProductDetails: {
    product: ProductDto;
    source: Source;
  };
};

const Stack =
  createNativeStackNavigator<ProductsStackParamList>();

export function ProductsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: 'Produkty' }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Szczegóły produktu' }}
      />
    </Stack.Navigator>
  );
}

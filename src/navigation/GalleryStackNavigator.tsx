import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GalleryScreen } from '../screens/GalleryScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import type { Source } from '../features/cart/store/cartStore';

export type GalleryStackParamList = {
  Gallery: undefined;
  ProductDetails: {
    productId: string;
    source: Source;
  };
};

const Stack = createNativeStackNavigator<GalleryStackParamList>();

export function GalleryStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          title: 'Arcydzieła',
        }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        initialParams={{
          source: 'GALLERY',
        }}
        options={{
          title: 'Szczegóły produktu',
        }}
      />
    </Stack.Navigator>
  );
}

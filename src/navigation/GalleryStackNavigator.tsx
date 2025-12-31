import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import  GalleryScreen  from '../screens/GalleryScreen';
import { GalleryDetailsScreen } from '../screens/GalleryDetailsScreen';

export type GalleryStackParamList = {
  Gallery: undefined;
  GalleryDetails: {
    galleryId: string;
  };
};

const Stack = createNativeStackNavigator<GalleryStackParamList>();

export function GalleryStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{ title: 'Arcydzieła' }}
      />

      <Stack.Screen
        name="GalleryDetails"
        component={GalleryDetailsScreen}
        options={{ title: 'Arcydzieło' }}
      />
    </Stack.Navigator>
  );
}

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { GalleryScreen } from '../screens/GalleryScreen';
import { GalleryDetailsScreen } from '../screens/GalleryDetailsScreen';

export type AdminGalleryStackParamList = {
  Gallery: undefined;
  GalleryDetails: { galleryId?: string } | undefined;
};

const Stack =
  createNativeStackNavigator<AdminGalleryStackParamList>();

export function AdminGalleryStackNavigator() {
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
        options={{ title: 'Dodaj / edytuj arcydzieło' }}
      />
    </Stack.Navigator>
  );
}

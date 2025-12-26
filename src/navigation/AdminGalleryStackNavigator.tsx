import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AdminGalleryScreen } from '../screens/AdminGalleryScreen';
import { AdminAddGalleryScreen } from '../screens/AdminAddGalleryScreen';

export type AdminGalleryStackParamList = {
  Gallery: undefined;
  AddGallery: { galleryId?: string } | undefined;
};

const Stack =
  createNativeStackNavigator<AdminGalleryStackParamList>();

export function AdminGalleryStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Gallery"
        component={AdminGalleryScreen}
        options={{ title: 'Arcydzieła' }}
      />

      <Stack.Screen
        name="AddGallery"
        component={AdminAddGalleryScreen}
        options={{ title: 'Dodaj / edytuj arcydzieło' }}
      />
    </Stack.Navigator>
  );
}

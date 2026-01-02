import React from 'react';
import { Text, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GalleryScreen from '../screens/GalleryScreen';
import { GalleryDetailsScreen } from '../screens/GalleryDetailsScreen';

/* =========================
   TYPES
   ========================= */

export type GalleryStackParamList = {
  Gallery:
    | {
        openSortMenu?: number;
      }
    | undefined;

  GalleryDetails: {
    galleryId: string;
  };
};

/* =========================
   STACK
   ========================= */

const Stack =
  createNativeStackNavigator<GalleryStackParamList>();

/* =========================
   NAVIGATOR
   ========================= */

export function GalleryStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={({ navigation }) => ({
          title: 'Arcydzieła', // ✅ tytuł zostaje
          headerRight: () => (
            <Pressable
              onPress={() =>
                navigation.navigate({
                  name: 'Gallery',
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
        name="GalleryDetails"
        component={GalleryDetailsScreen}
        options={{ title: 'Szczegóły arcydzieła' }}
      />
    </Stack.Navigator>
  );
}

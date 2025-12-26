import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AdminStatsStackNavigator } from './AdminStatsStackNavigator';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AdminProductsStackNavigator } from './AdminProductsStackNavigator';
import { AdminGalleryStackNavigator } from './AdminGalleryStackNavigator';

const Tab = createBottomTabNavigator();

export function AdminTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            AdminStats: 'stats-chart-outline',
            AdminProducts: 'pricetags-outline',
            AdminGallery: 'images-outline',
            AdminProfile: 'person-outline',
          } as const;

          return (
            <Ionicons
              name={
                icons[route.name as keyof typeof icons] ??
                'ellipse-outline'
              }
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#9CA3AF',
      })}
    >
      <Tab.Screen
        name="AdminStats"
        component={AdminStatsStackNavigator}
        options={{ title: 'Statystyki' }}
      />

      <Tab.Screen
        name="AdminProducts"
        component={AdminProductsStackNavigator}
        options={{ title: 'Produkty' }}
      />

      <Tab.Screen
        name="AdminGallery"
        component={AdminGalleryStackNavigator}
        options={{ title: 'Arcydzieła' }}
      />

      <Tab.Screen
        name="AdminProfile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

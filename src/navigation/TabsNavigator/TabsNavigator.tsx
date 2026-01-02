import { useSyncExternalStore } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ProductsStackNavigator } from './ProductsStackNavigator';
import { GalleryStackNavigator } from '../GalleryStackNavigator';
import { CartStackNavigator } from '../CartStackNavigator';
import { ProfileScreen } from '../../screens/ProfileScreen';

import {
  subscribe,
  getCartItemsCount,
  getProductsCount,
  getGalleryCount,
} from '../../features/cart/store/cartStore';

const Tab = createBottomTabNavigator();

export function TabsNavigator() {
  const total = useSyncExternalStore(
    subscribe,
    getCartItemsCount
  );
  const products = useSyncExternalStore(
    subscribe,
    getProductsCount
  );
  const gallery = useSyncExternalStore(
    subscribe,
    getGalleryCount
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Products':
              iconName = 'pricetags-outline';
              break;
            case 'Gallery':
              iconName = 'images-outline';
              break;
            case 'Cart':
              iconName = 'cart-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Products"
        component={ProductsStackNavigator}
        options={{
          title: 'Produkty',
          tabBarBadge:
            products > 0 ? products : undefined,
        }}
      />

      <Tab.Screen
        name="Gallery"
        component={GalleryStackNavigator}
        options={{
          title: 'Arcydzieła',
          tabBarBadge:
            gallery > 0 ? gallery : undefined,
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartStackNavigator}
        options={{
          title: 'Koszyk',
          tabBarBadge:
            total > 0 ? total : undefined,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

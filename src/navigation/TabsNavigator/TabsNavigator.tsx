import { useSyncExternalStore } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ProductsStackNavigator } from './ProductsStackNavigator';
import { CartScreen } from '../../screens/CartScreen';
import { ProfileScreen } from '../../screens/ProfileScreen';
import { GalleryScreen } from '../../screens/GalleryScreen';

import {
  subscribe,
  getCartItemsCount,
} from '../../features/cart/store/cartStore';

const Tab = createBottomTabNavigator();

export function TabsNavigator() {
  const itemsCount = useSyncExternalStore(
    subscribe,
    getCartItemsCount
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }: any) => ({
        tabBarIcon: ({ color, size }: any) => {
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
        options={{ title: 'Produkty' }}
      />

      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{ title: 'Arcydzieła' }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Koszyk',
          tabBarBadge: itemsCount > 0 ? itemsCount : undefined,
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

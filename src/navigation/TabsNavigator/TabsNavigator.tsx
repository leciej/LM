import React, { useSyncExternalStore } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ProductsScreen } from '../../screens/ProductsScreen';
import { CartScreen } from '../../screens/CartScreen';
import { ProfileScreen } from '../../screens/ProfileScreen';

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
    <Tab.Navigator>
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{ title: 'Produkty' }}
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

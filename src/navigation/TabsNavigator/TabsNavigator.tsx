import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ProductsScreen } from '../../screens/ProductsScreen';
import { CartScreen } from '../../screens/CartScreen';
import { ProfileScreen } from '../../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export function TabsNavigator() {
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
        options={{ title: 'Koszyk' }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

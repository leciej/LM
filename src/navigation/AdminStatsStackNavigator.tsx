import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStatsScreen } from '../screens/AdminStatsScreen';

const Stack = createNativeStackNavigator();

export function AdminStatsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminStats"
        component={AdminStatsScreen}
        options={{ title: 'Statystyki' }}
      />
    </Stack.Navigator>
  );
}

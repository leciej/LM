import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { useAuth } from '../auth/AuthContext';
import { TabsNavigator } from './TabsNavigator/TabsNavigator';
import { AdminNavigator } from './AdminNavigator';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Admin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { isLoggedIn, role } = useAuth();

  return (
    <Stack.Navigator>
      {!isLoggedIn ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : role === 'ADMIN' ? (
        <Stack.Screen
          name="Admin"
          component={AdminNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Main"
          component={TabsNavigator}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

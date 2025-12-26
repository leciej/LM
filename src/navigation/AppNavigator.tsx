import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

import { useAuth } from '../auth/AuthContext';
import { TabsNavigator } from './TabsNavigator/TabsNavigator';
import { AdminNavigator } from './AdminNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Admin: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { isLoggedIn, role } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      {!isLoggedIn ? (
        <>
          {/* 👋 EKRAN STARTOWY */}
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
          />

          {/* 🔐 AUTH */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />
        </>
      ) : role === 'ADMIN' ? (
        <Stack.Screen
          name="Admin"
          component={AdminNavigator}
        />
      ) : (
        <Stack.Screen
          name="Main"
          component={TabsNavigator}
        />
      )}
    </Stack.Navigator>
  );
}

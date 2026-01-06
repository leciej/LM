import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

import { useAuth } from '../auth/AuthContext';
import { TabsNavigator } from './TabsNavigator/TabsNavigator';
import { AdminTabsNavigator } from './AdminTabsNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Admin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          {/* Splash tylko jako ENTRY POINT */}
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />
        </>
      ) : isAdmin ? (
        <Stack.Screen
          name="Admin"
          component={AdminTabsNavigator}
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

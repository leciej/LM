import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export function LoginScreen() {
  const { loginAsGuest, loginAsAdmin } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Guten Tag twoja mać!
      </Text>

      <Pressable
        style={[styles.button, styles.userButton]}
        onPress={loginAsGuest}
      >
        <Text style={styles.buttonText}>
          Zaloguj jako użytkownik
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.adminButton]}
        onPress={loginAsAdmin}
      >
        <Text style={styles.buttonText}>
          Zaloguj jako admin
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.registerButton]}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>
          Zarejestruj się
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    padding: 14,
    borderRadius: 6,
    marginBottom: 12,
  },
  userButton: {
    backgroundColor: '#1976d2',
  },
  adminButton: {
    backgroundColor: '#455a64',
  },
  registerButton: {
    backgroundColor: '#2e7d32',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  registerText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});

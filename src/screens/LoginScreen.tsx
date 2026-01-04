import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import { UsersApi } from '@/api/users/usersApi';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export function LoginScreen() {
  const { loginAsGuest, login } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const [showUserForm, setShowUserForm] =
    useState(false);

  const [loginOrEmail, setLoginOrEmail] =
    useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  /* =========================
     USER LOGIN (API)
     ========================= */

  const handleLoginUser = async () => {
    if (!loginOrEmail || !password) {
      setError('Podaj login/email i hasło');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const user = await UsersApi.login({
        loginOrEmail: loginOrEmail.trim(),
        password,
      });

      login(user);
    } catch {
      Alert.alert(
        'Błąd logowania',
        'Niepoprawne dane logowania'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ADMIN LOGIN (EMPTY PASS)
     ========================= */

  const handleLoginAdmin = async () => {
    try {
      setLoading(true);

      const admin = await UsersApi.login({
        loginOrEmail: 'admin',
        password: '',
      });

      login(admin);
    } catch {
      Alert.alert(
        'Błąd logowania admina',
        'Admin nie istnieje w bazie'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Guten Tag twoja mać!
      </Text>

      {/* GOŚĆ */}
      <Pressable
        style={[styles.button, styles.guestButton]}
        onPress={loginAsGuest}
      >
        <Text style={styles.buttonText}>
          Zaloguj jako gość
        </Text>
      </Pressable>

      {/* ADMIN */}
      <Pressable
        style={[styles.button, styles.adminButton]}
        onPress={handleLoginAdmin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Zaloguj jako admin
          </Text>
        )}
      </Pressable>

      {/* USER BUTTON */}
      {!showUserForm && (
        <Pressable
          style={[styles.button, styles.userButton]}
          onPress={() => setShowUserForm(true)}
        >
          <Text style={styles.buttonText}>
            Zaloguj jako użytkownik
          </Text>
        </Pressable>
      )}

      {/* USER FORM */}
      {showUserForm && (
        <>
          <Text style={styles.sectionTitle}>
            Logowanie użytkownika
          </Text>

          <TextInput
            placeholder="Login lub email"
            value={loginOrEmail}
            onChangeText={setLoginOrEmail}
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            placeholder="Hasło"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          {error && (
            <Text style={styles.error}>
              {error}
            </Text>
          )}

          <Pressable
            style={[
              styles.button,
              styles.userButton,
              loading && styles.disabled,
            ]}
            onPress={handleLoginUser}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Zaloguj
              </Text>
            )}
          </Pressable>
        </>
      )}

      {/* REGISTER */}
      <Pressable
        style={[styles.button, styles.registerButton]}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>
          Zarejestruj się
        </Text>
      </Pressable>
    </View>
  );
}

/* =========================
   STYLES
   ========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  button: {
    padding: 14,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  guestButton: {
    backgroundColor: '#607d8b',
  },
  userButton: {
    backgroundColor: '#1976d2',
  },
  adminButton: {
    backgroundColor: '#455a64',
  },
  registerButton: {
    backgroundColor: '#2e7d32',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  error: {
    color: '#b71c1c',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});

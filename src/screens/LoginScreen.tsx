import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Animated,
  Alert,
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
  const { loginAsGuest, login } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const [mode, setMode] = useState<'user' | 'admin' | null>(null);
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const animUser = useRef(new Animated.Value(0)).current;
  const animAdmin = useRef(new Animated.Value(0)).current;

  const toggle = (target: 'user' | 'admin', anim: Animated.Value) => {
    const isOpen = mode === target;
    setMode(isOpen ? null : target);

    Animated.timing(anim, {
      toValue: isOpen ? 0 : 1,
      duration: 220,
      useNativeDriver: false,
    }).start();

    const other = target === 'user' ? animAdmin : animUser;
    Animated.timing(other, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const formStyle = (anim: Animated.Value) => ({
    height: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 170],
    }),
    opacity: anim,
  });

  const handleLogin = async () => {
    try {
      await login(loginValue, password);
    } catch {
      Alert.alert(
        'Błąd logowania',
        'Niepoprawny login lub hasło'
      );
    }
  };

  // ✅ KLUCZOWE: jawny handler gościa
  const handleGuestLogin = async () => {
    try {
      await loginAsGuest();
    } catch (e) {
      Alert.alert(
        'Błąd',
        'Nie udało się zalogować jako gość'
      );
      console.error('GUEST LOGIN ERROR', e);
    }
  };

  const renderForm = () => (
    <View style={styles.form}>
      <TextInput
        placeholder="Login lub email"
        value={loginValue}
        onChangeText={setLoginValue}
        style={styles.input}
        autoCapitalize="none"
      />

      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Hasło"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <Pressable
          onPress={() => setShowPassword(v => !v)}
          style={styles.eyeButton}
        >
          <Text style={styles.eyeText}>
            {showPassword ? '🙈' : '👁️'}
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.button, styles.submitButton]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Zaloguj</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guten Tag twoja mać!</Text>

      {/* 👇 TU BYŁ PROBLEM */}
      <Pressable
        style={[styles.button, styles.guestButton]}
        onPress={handleGuestLogin}
      >
        <Text style={styles.buttonText}>
          Zaloguj jako gość
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.userButton]}
        onPress={() => toggle('user', animUser)}
      >
        <Text style={styles.buttonText}>
          Zaloguj jako użytkownik
        </Text>
      </Pressable>

      <Animated.View style={[styles.animatedForm, formStyle(animUser)]}>
        {renderForm()}
      </Animated.View>

      <Pressable
        style={[styles.button, styles.adminButton]}
        onPress={() => toggle('admin', animAdmin)}
      >
        <Text style={styles.buttonText}>
          Zaloguj jako admin
        </Text>
      </Pressable>

      <Animated.View style={[styles.animatedForm, formStyle(animAdmin)]}>
        {renderForm()}
      </Animated.View>

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
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    padding: 14,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  animatedForm: {
    overflow: 'hidden',
  },
  form: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  eyeText: {
    fontSize: 18,
  },
  guestButton: {
    backgroundColor: '#00897b',
  },
  userButton: {
    backgroundColor: '#1976d2',
  },
  adminButton: {
    backgroundColor: '#455a64',
  },
  submitButton: {
    backgroundColor: '#1976d2',
  },
  registerButton: {
    backgroundColor: '#2e7d32',
    marginTop: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

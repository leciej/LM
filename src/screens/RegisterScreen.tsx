import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../auth/AuthContext';

/* =========================
   TYP POD BACKEND
   ========================= */

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export function RegisterScreen() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  /* =========================
     WALIDACJA
     ========================= */

  const validatePassword = (value: string) => {
    if (value.length < 8)
      return 'Hasło musi mieć min. 8 znaków';
    if (!/[A-Za-z]/.test(value))
      return 'Hasło musi zawierać literę';
    if (!/[0-9]/.test(value))
      return 'Hasło musi zawierać cyfrę';
    return null;
  };

  const validate = (): boolean => {
    if (!name.trim()) {
      setError('Podaj imię');
      return false;
    }

    if (!email.includes('@')) {
      setError('Niepoprawny email');
      return false;
    }

    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      return false;
    }

    if (password !== confirmPassword) {
      setError('Hasła nie są takie same');
      return false;
    }

    setError(null);
    return true;
  };

  /* =========================
     SUBMIT (BACKEND-READY)
     ========================= */

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload: RegisterPayload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      setLoading(true);

      /**
       * 🔜 TU DOCZELOWO:
       * await api.register(payload)
       */

      // mock backend
      await new Promise<void>(resolve =>
        setTimeout(resolve, 600)
      );

      // ✅ AUTO-LOGIN PO REJESTRACJI
      register({
        name: payload.name,
        email: payload.email,
      });

      Alert.alert(
        'Rejestracja zakończona',
        'Witaj w Świecie akwareli 🎨',
        [{ text: 'Przejdź do sklepu' }]
      );
      // ❗ nawigacja zrobi się sama przez AppNavigator
    } catch {
      Alert.alert(
        'Błąd rejestracji',
        'Spróbuj ponownie'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejestracja</Text>

      <TextInput
        placeholder="Imię"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      {/* HASŁO */}
      <View style={styles.passwordRow}>
        <TextInput
          placeholder="Hasło"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <Pressable
          onPress={() =>
            setShowPassword(v => !v)
          }
        >
          <Text style={styles.eye}>
            {showPassword ? '🙈' : '👁️'}
          </Text>
        </Pressable>
      </View>

      {/* POWTÓRZ HASŁO */}
      <View style={styles.passwordRow}>
        <TextInput
          placeholder="Powtórz hasło"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
        />
        <Pressable
          onPress={() =>
            setShowPassword(v => !v)
          }
        >
          <Text style={styles.eye}>
            {showPassword ? '🙈' : '👁️'}
          </Text>
        </Pressable>
      </View>

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <Pressable
        style={[
          styles.button,
          loading && styles.disabled,
        ]}
        disabled={loading}
        onPress={handleSubmit}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Zarejestruj
          </Text>
        )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingRight: 12,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  eye: {
    fontSize: 18,
  },
  error: {
    color: '#b71c1c',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 6,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
});

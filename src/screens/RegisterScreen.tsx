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
import { UsersApi } from '@/api/users/usersApi';

/* =========================
   TYP POD BACKEND
   ========================= */

type RegisterPayload = {
  name: string;
  surname: string;
  login: string;
  email: string;
  password: string;
};

export function RegisterScreen() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [login, setLogin] = useState('');
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

    if (!surname.trim()) {
      setError('Podaj nazwisko');
      return false;
    }

    if (!login.trim()) {
      setError('Podaj login');
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
     SUBMIT → BACKEND (SQL)
     ========================= */

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload: RegisterPayload = {
      name: name.trim(),
      surname: surname.trim(),
      login: login.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      setLoading(true);

      const user = await UsersApi.register(payload);

      // ✅ AUTO-LOGIN PO REJESTRACJI
      register({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      Alert.alert(
        'Rejestracja zakończona',
        'Witaj w Świecie akwareli 🎨',
        [{ text: 'Przejdź do sklepu' }]
      );
    } catch (e: any) {
      Alert.alert(
        'Błąd rejestracji',
        e?.response?.data ??
          'Nie udało się zarejestrować'
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
        importantForAutofill="no"
      />

      <TextInput
        placeholder="Nazwisko"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
        importantForAutofill="no"
      />

      <TextInput
        placeholder="Login"
        value={login}
        onChangeText={setLogin}
        autoCapitalize="none"
        style={styles.input}
        importantForAutofill="no"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        importantForAutofill="no"
      />

      {/* HASŁO */}
      <View style={styles.passwordRow}>
        <TextInput
          placeholder="Hasło"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          importantForAutofill="no"
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
          importantForAutofill="no"
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

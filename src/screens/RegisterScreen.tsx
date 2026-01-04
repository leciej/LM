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
import { useNavigation } from '@react-navigation/native';

type RegisterPayload = {
  name: string;
  surname: string;
  login: string;
  email: string;
  password: string;
};

export function RegisterScreen() {
  const { login } = useAuth();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [loginValue, setLoginValue] = useState('');
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
    if (!name.trim()) return setError('Podaj imię'), false;
    if (!surname.trim())
      return setError('Podaj nazwisko'), false;
    if (!loginValue.trim())
      return setError('Podaj login'), false;
    if (!email.includes('@'))
      return setError('Niepoprawny email'), false;

    const passError = validatePassword(password);
    if (passError)
      return setError(passError), false;

    if (password !== confirmPassword)
      return (
        setError('Hasła nie są takie same'), false
      );

    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload: RegisterPayload = {
      name: name.trim(),
      surname: surname.trim(),
      login: loginValue.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      setLoading(true);

      const res = await fetch(
        'http://localhost:5000/api/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      // auto-login po rejestracji
      await login(payload.login, password);

      Alert.alert(
        'Rejestracja zakończona',
        'Witaj w Świecie akwareli 🎨',
        [{ text: 'OK' }]
      );
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
        placeholder="Nazwisko"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
      />

      <TextInput
        placeholder="Login"
        value={loginValue}
        onChangeText={setLoginValue}
        autoCapitalize="none"
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
        <Text style={styles.error}>{error}</Text>
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

      <Pressable
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Wróć</Text>
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
  backButton: {
    backgroundColor: '#455a64',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
});

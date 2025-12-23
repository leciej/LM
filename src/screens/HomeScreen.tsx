import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Button,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sklep z akwarelami</Text>

      <Text style={styles.subtitle}>
        Wybierz, gdzie chcesz przejść
      </Text>

      <View style={styles.buttons}>
        <Button
          title="Produkty"
          onPress={() => navigation.navigate('Products')}
        />

        <Button
          title="Galeria"
          onPress={() => navigation.navigate('Gallery')}
        />

        <Button
          title="Koszyk"
          onPress={() => navigation.navigate('Cart')}
        />

        <Button
          title="Profil"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
});

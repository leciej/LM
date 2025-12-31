import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';

import type { ProductDto } from '../api/products';
import { useProducts } from '../features/products/useProducts';
import { addActivity } from '../features/activity/store/activityStore';

export function AdminProductsScreen({ navigation }: any) {
  const { products, loading, error, remove } = useProducts();

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  const removeProduct = (product: ProductDto) => {
    Alert.alert(
      'Usuń produkt',
      `Czy na pewno chcesz usunąć "${product.name}"?`,
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            await remove(product.id);
            addActivity('REMOVE_PRODUCT');
            showToast('Produkt został usunięty');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produkty</Text>

      {loading && <Text style={styles.subtitle}>Ładowanie...</Text>}
      {!loading && error && <Text style={styles.subtitle}>{error}</Text>}

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.addText}>Dodaj produkt</Text>
      </Pressable>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.subtitle}>Brak produktów</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              {item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.thumbnail}
                />
              )}

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price} zł</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('AddProduct', {
                    productId: item.id,
                  })
                }
              >
                <Text style={styles.editText}>Edytuj</Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => removeProduct(item)}
              >
                <Text style={styles.deleteText}>Usuń</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  subtitle: { fontSize: 14, marginBottom: 10 },
  addButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  addText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  topRow: { flexDirection: 'row', marginBottom: 8 },
  thumbnail: { width: 80, height: 80, borderRadius: 6, marginRight: 12 },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, marginTop: 4 },
  actions: { gap: 6 },
  editButton: {
    backgroundColor: '#ffa000',
    padding: 8,
    borderRadius: 6,
  },
  editText: { textAlign: 'center', fontWeight: '600' },
  deleteButton: {
    backgroundColor: '#d32f2f',
    padding: 8,
    borderRadius: 6,
  },
  deleteText: { color: '#fff', textAlign: 'center' },
});

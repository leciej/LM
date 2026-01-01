import React, { useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';

import type { ProductDto } from '../api/products';
import { useProducts } from '../features/products/useProducts';
import { addActivity } from '../features/activity/store/activityStore';

export function AdminProductsScreen({ navigation }: any) {
  const { products, loading, error, remove, reload } = useProducts();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const toast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

  const handleEdit = (product: ProductDto) => {
    navigation.navigate('AddProduct', {
      productId: product.id,
    });
  };

  const handleRemove = (product: ProductDto) => {
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
            toast('Produkt usunięty');
            reload();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Ładowanie…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produkty</Text>

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.addText}>Dodaj produkt</Text>
      </Pressable>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.subtitle}>Brak produktów</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>
                    Brak zdjęcia
                  </Text>
                </View>
              )}

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>

                {item.description ? (
                  <Text style={styles.description}>
                    {item.description}
                  </Text>
                ) : null}

                <Text style={styles.price}>
                  {item.price.toFixed(2)} zł
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.editText}>Edytuj</Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleRemove(item)}
            >
              <Text style={styles.deleteText}>Usuń</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6f8',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },

  subtitle: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },

  addButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
  },

  addText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#eee',
  },

  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagePlaceholderText: {
    fontSize: 12,
    color: '#777',
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },

  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },

  editButton: {
    backgroundColor: '#ffa000',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 8,
  },

  editText: {
    textAlign: 'center',
    fontWeight: '700',
  },

  deleteButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    borderRadius: 10,
  },

  deleteText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
});

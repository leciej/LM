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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ProductDto } from '../api/products';
import { useProducts } from '../features/products/useProducts';
import { addItemToCart } from '../features/cart/store/cartStore';
import type { ProductsStackParamList } from '../navigation/tabs/ProductsStackNavigator';

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  'Products'
>;

export function ProductsScreen({ navigation }: Props) {
  const { products, loading, error } = useProducts();

  const handleAddToCart = (product: ProductDto) => {
    addItemToCart(
      {
        id: product.id,
        name: product.name,
        artist: '—',
        price: product.price,
        description: product.description ?? '',
        image: product.imageUrl,
      },
      'PRODUCTS'
    );

    if (Platform.OS === 'android') {
      ToastAndroid.show(
        `Dodano "${product.name}"`,
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Text>Ładowanie…</Text>}
      {error && <Text>{error}</Text>}

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  product: item,
                  source: 'PRODUCTS',
                })
              }
            >
              <View style={styles.row}>
                {item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.thumb}
                  />
                )}

                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text>{item.price} zł</Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              style={styles.btn}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.btnText}>
                Dodaj do koszyka
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  row: { flexDirection: 'row' },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  name: { fontWeight: '700' },
  btn: {
    marginTop: 8,
    backgroundColor: '#2e7d32',
    padding: 10,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
});

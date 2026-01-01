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

import { useProducts } from '../features/products/useProducts';
import { addItemToCart } from '../features/cart/store/cartStore';
import type { ProductDto } from '../api/products';
import type { Product } from '../features/products/mockProducts';
import type { ProductsStackParamList } from '../navigation/TabsNavigator/ProductsStackNavigator';

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  'Products'
>;

/* =========================
   DTO → DOMAIN MAP
   ========================= */
const mapDtoToProduct = (dto: ProductDto): Product => ({
  id: dto.id,
  name: dto.name,
  artist: '—',
  price: dto.price,
  description: dto.description ?? '',
  image: dto.imageUrl,
});

export function ProductsScreen({ navigation }: Props) {
  const { products, loading, error } = useProducts();

  const handleAddToCart = (dto: ProductDto) => {
    const product = mapDtoToProduct(dto);

    addItemToCart(product, 'PRODUCTS');

    if (Platform.OS === 'android') {
      ToastAndroid.show(
        `Dodano "${product.name}"`,
        ToastAndroid.SHORT
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Ładowanie produktów…</Text>
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
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => {
          const product = mapDtoToProduct(item);

          return (
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
                  {product.image && (
                    <Image
                      source={{ uri: product.image }}
                      style={styles.image}
                    />
                  )}

                  <View style={styles.info}>
                    <Text style={styles.name}>
                      {product.name}
                    </Text>

                    <Text style={styles.artist}>
                      {product.artist}
                    </Text>

                    <Text style={styles.price}>
                      {product.price} zł
                    </Text>
                  </View>
                </View>
              </Pressable>

              <Pressable
                style={styles.button}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.buttonText}>
                  Dodaj do koszyka
                </Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

/* =========================
   STYLES
   ========================= */

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

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
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

  artist: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },

  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },

  button: {
    marginTop: 10,
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
});

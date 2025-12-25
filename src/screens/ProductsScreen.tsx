import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  ToastAndroid,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { mockProducts, Product } from '../features/products/mockProducts';
import { addItemToCart } from '../features/cart/store/cartStore';

type ProductsStackParamList = {
  Products: undefined;
  ProductDetails: { productId: string };
};

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  'Products'
>;

export function ProductsScreen({ navigation }: Props) {
  const handleAddToCart = (product: Product) => {
    addItemToCart(product, 'PRODUCTS');
    ToastAndroid.show(
      `Dodano "${product.name}"`,
      ToastAndroid.SHORT
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  productId: item.id,
                })
              }
            >
              <View style={styles.row}>
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.thumb}
                  />
                )}
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.artist}>{item.artist}</Text>
                  <Text>{item.price} zł</Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              style={styles.btn}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.btnText}>Dodaj do koszyka</Text>
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
  artist: { color: '#666' },
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

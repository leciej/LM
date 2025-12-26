import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TextInput,
  ToastAndroid,
  Image,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { mockProducts } from '../features/products/mockProducts';
import { addItemToCart } from '../features/cart/store/cartStore';
import {
  addCommentToStore,
  getCommentsSnapshot,
} from '../features/comments/commentsStore';
import { useAuth } from '../auth/AuthContext';
import type { Comment } from '../features/comments/commentsStore';
import type { Source } from '../features/cart/store/cartStore';

type ProductsStackParamList = {
  Products: undefined;
  ProductDetails: {
    productId: string;
    source: Source;
  };
};

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  'ProductDetails'
>;

export function ProductDetailsScreen({ route }: Props) {
  const { productId, source } = route.params;

  const product = mockProducts.find(p => p.id === productId);
  const { isLoggedIn } = useAuth();

  const [commentText, setCommentText] = useState('');
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion(v => v + 1);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Nie znaleziono produktu</Text>
      </View>
    );
  }

  const comments = getCommentsSnapshot(product.id);

  const handleAddToCart = () => {
    if (!isLoggedIn) return;

    addItemToCart(product, source);

    ToastAndroid.show(
      `Dodano "${product.name}"`,
      ToastAndroid.SHORT
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* HERO */}
      <View style={styles.hero}>
        {product.image && (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
          />
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price} zł</Text>
          <Text style={styles.desc}>{product.description}</Text>
        </View>
      </View>

      <Button
        title={
          isLoggedIn
            ? 'Dodaj do koszyka'
            : 'Zaloguj się, aby dodać do koszyka'
        }
        disabled={!isLoggedIn}
        onPress={handleAddToCart}
      />

      <Text style={styles.sectionTitle}>Komentarze</Text>

      <FlatList
        data={comments}
        extraData={version}
        keyExtractor={(item: Comment) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            {/* 🔑 AUTOR */}
            <Text style={styles.author}>
              {item.author}
            </Text>

            <Text>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Brak komentarzy</Text>
        }
        scrollEnabled={false}
      />

      <TextInput
        style={styles.input}
        placeholder={
          isLoggedIn
            ? 'Dodaj komentarz...'
            : 'Zaloguj się, aby komentować'
        }
        value={commentText}
        onChangeText={setCommentText}
        editable={isLoggedIn}
      />

      <Button
        title={
          isLoggedIn
            ? 'Dodaj komentarz'
            : 'Zaloguj się, aby dodać komentarz'
        }
        disabled={!isLoggedIn}
        onPress={() => {
          if (!isLoggedIn) return;
          addCommentToStore(product.id, commentText);
          setCommentText('');
          refresh();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  hero: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: '25%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#eee',
    resizeMode: 'contain',
    marginRight: 16,
  },
  info: {
    width: '75%',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: '#555',
  },
  sectionTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  comment: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 6,
  },
  /* 🔑 STYL AUTORA */
  author: {
    fontWeight: '700',
    marginBottom: 2,
    color: '#111',
  },
  empty: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
});

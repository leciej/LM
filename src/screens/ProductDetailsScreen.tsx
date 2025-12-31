import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TextInput,
  Image,
  ScrollView,
  ToastAndroid,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { ProductsStackParamList } from '../navigation/tabs/ProductsStackNavigator';
import type { Product } from '../features/products/mockProducts';
import { addItemToCart } from '../features/cart/store/cartStore';
import {
  addCommentToStore,
  getCommentsSnapshot,
} from '../features/comments/commentsStore';
import { useAuth } from '../auth/AuthContext';
import type { Comment } from '../features/comments/commentsStore';

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  'ProductDetails'
>;

export function ProductDetailsScreen({ route }: Props) {
  const { product: dto, source } = route.params;
  const { isLoggedIn, user } = useAuth();
  const [commentText, setCommentText] = useState('');

  const product: Product = {
    id: dto.id,
    name: dto.name,
    artist: '—',
    price: dto.price,
    description: dto.description ?? '',
    image: dto.imageUrl,
  };

  const comments = getCommentsSnapshot(product.id);

  const handleAddToCart = () => {
    if (!isLoggedIn) return;

    addItemToCart(product, source);

    if (Platform.OS === 'android') {
      ToastAndroid.show(
        `Dodano "${product.name}"`,
        ToastAndroid.SHORT
      );
    }
  };

  const handleAddComment = () => {
    if (!isLoggedIn || !user) return;
    if (!commentText.trim()) return;

    addCommentToStore(
      product.id,
      commentText.trim(),
      user.name
    );

    setCommentText('');
  };

  return (
    <ScrollView style={styles.container}>
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
          {product.description && (
            <Text style={styles.desc}>
              {product.description}
            </Text>
          )}
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
        keyExtractor={(item: Comment) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.author}>{item.author}</Text>
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
        onPress={handleAddComment}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  hero: { flexDirection: 'row', marginBottom: 20 },
  image: {
    width: '25%',
    aspectRatio: 1,
    borderRadius: 14,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  info: { width: '75%' },
  name: { fontSize: 20, fontWeight: '700' },
  price: { marginBottom: 8 },
  desc: { color: '#555' },
  sectionTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '700',
  },
  comment: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 6,
  },
  author: { fontWeight: '700' },
  empty: { fontStyle: 'italic', color: '#666' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
});

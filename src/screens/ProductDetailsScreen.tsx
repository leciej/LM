import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TextInput,
  ToastAndroid,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { mockProducts } from '../features/products/mockProducts';
import { addItemToCart } from '../features/cart/store/cartStore';
import { addComment } from '../features/comments/commands/addComment';
import { getComments } from '../features/comments/queries/getComments';
import { useAuth } from '../auth/AuthContext';
import type { Comment } from '../features/comments/commentsStore';

/**
 * ⬇️ WAŻNE: source dodany
 */
type ProductsStackParamList = {
  Products: undefined;
  ProductDetails: {
    productId: string;
    source?: 'PRODUCT' | 'GALLERY';
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

  const comments = getComments(product.id);

  const handleAddToCart = () => {
    if (!isLoggedIn) return;

    addItemToCart(product, source ?? 'PRODUCT');

    ToastAndroid.show(
      `Dodano "${product.name}" do koszyka`,
      ToastAndroid.SHORT
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price} zł</Text>
      <Text style={styles.desc}>
        Piękna akwarela, ręcznie malowana
      </Text>

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
            <Text>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Brak komentarzy</Text>
        }
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
          addComment(product.id, commentText);
          setCommentText('');
          refresh();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
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

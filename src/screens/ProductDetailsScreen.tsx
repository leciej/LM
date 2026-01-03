import React, { useEffect, useState } from "react";
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
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { ProductsStackParamList } from "../navigation/TabsNavigator/ProductsStackNavigator";
import { addItemToCart } from "../features/cart/store/cartStore";

import {
  CommentsApi,
  CommentDto,
} from "@/api/comments/commentsApi";

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  "ProductDetails"
>;

export function ProductDetailsScreen({ route, navigation }: Props) {
  const { product: dto, source } = route.params;

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  /* =========================
     LOAD COMMENTS
     ========================= */

  useEffect(() => {
    setLoadingComments(true);

    CommentsApi.getByProductId(dto.id)
      .then(setComments)
      .catch(() => {
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Nie udało się pobrać komentarzy",
            ToastAndroid.SHORT
          );
        }
      })
      .finally(() => setLoadingComments(false));
  }, [dto.id]);

  /* =========================
     CART
     ========================= */

  const handleAddToCart = () => {
    addItemToCart(
      {
        id: dto.id,
        name: dto.name,
        price: dto.price,
        imageUrl: dto.imageUrl,
      },
      source
    );

    if (Platform.OS === "android") {
      ToastAndroid.show(
        `Dodano "${dto.name}"`,
        ToastAndroid.SHORT
      );
    }

    navigation.goBack();
  };

  /* =========================
     ADD COMMENT (TEMPORARY)
     ========================= */

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const newComment = await CommentsApi.create(dto.id, {
        clientId: 1, // ⬅️ TEMP: Jan Kowalski z seed data
        authorName: "Gość",
        text: commentText.trim(),
      });

      setComments(prev => [newComment, ...prev]);
      setCommentText("");
    } catch {
      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Nie udało się dodać komentarza",
          ToastAndroid.SHORT
        );
      }
    }
  };

  /* =========================
     RENDER
     ========================= */

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        {dto.imageUrl && (
          <Image
            source={{ uri: dto.imageUrl }}
            style={styles.image}
          />
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{dto.name}</Text>
          <Text style={styles.price}>{dto.price} zł</Text>
          {dto.description && (
            <Text style={styles.desc}>{dto.description}</Text>
          )}
        </View>
      </View>

      <Button
        title="Dodaj do koszyka"
        onPress={handleAddToCart}
      />

      <Text style={styles.sectionTitle}>Komentarze</Text>

      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.author}>{item.author}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          !loadingComments ? (
            <Text style={styles.empty}>Brak komentarzy</Text>
          ) : null
        }
        scrollEnabled={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Dodaj komentarz..."
        value={commentText}
        onChangeText={setCommentText}
      />

      <Button
        title="Dodaj komentarz"
        onPress={handleAddComment}
      />
    </ScrollView>
  );
}

/* =========================
   STYLES
   ========================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  hero: { flexDirection: "row", marginBottom: 20 },
  image: {
    width: "25%",
    aspectRatio: 1,
    borderRadius: 14,
    marginRight: 16,
    backgroundColor: "#eee",
  },
  info: { width: "75%" },
  name: { fontSize: 20, fontWeight: "700" },
  price: { marginBottom: 8 },
  desc: { color: "#555" },
  sectionTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "700",
  },
  comment: {
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginBottom: 6,
  },
  author: { fontWeight: "700" },
  empty: { fontStyle: "italic", color: "#666" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
});

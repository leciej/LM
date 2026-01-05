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
import { CartApi } from "../api/cart";
import { addItemToCart } from "../features/cart/store/cartStore";

import {
  CommentsApi,
  CommentDto,
} from "@/api/comments/commentsApi";
import { useAuth } from "@/auth/AuthContext";

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  "ProductDetails"
>;

/* =========================
   HELPERS
   ========================= */

function formatRelativeDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "przed chwilą";
  if (diffMin < 60) return `${diffMin} min temu`;
  if (diffHour < 24) return `${diffHour} godz. temu`;
  if (diffDay === 1) return "wczoraj";
  if (diffDay < 7) return `${diffDay} dni temu`;

  return date.toLocaleDateString("pl-PL");
}

/* =========================
   COMPONENT
   ========================= */

export function ProductDetailsScreen({ route, navigation }: Props) {
  const { product: dto } = route.params;
  const { user } = useAuth();

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
     CART → BACKEND + LOCAL
     ========================= */

  const handleAddToCart = async () => {
    try {
      // 1️⃣ BACKEND – zapis do bazy
      await CartApi.addItem({
        productId: dto.id,
        quantity: 1,
      });

      // 2️⃣ LOCAL – badge / UI
      addItemToCart(
        {
          id: dto.id,
          name: dto.name,
          price: dto.price,
          imageUrl: dto.imageUrl,
          description: dto.description,
        },
        "PRODUCTS"
      );

      if (Platform.OS === "android") {
        ToastAndroid.show(
          `Dodano "${dto.name}"`,
          ToastAndroid.SHORT
        );
      }

      navigation.goBack();
    } catch (err) {
      console.error("ADD TO CART ERROR", err);

      if (Platform.OS === "android") {
        ToastAndroid.show(
          "Nie udało się dodać do koszyka",
          ToastAndroid.SHORT
        );
      }
    }
  };

  /* =========================
     ADD COMMENT
     ========================= */

  const handleAddComment = async () => {
    if (!commentText.trim() || !user) return;

    try {
      const newComment = await CommentsApi.create(dto.id, {
        userId: user.id,
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

      <Text style={styles.sectionTitle}>
        Komentarze ({comments.length})
      </Text>

      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <View style={styles.commentHeader}>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.date}>
                {formatRelativeDate(item.createdAt)}
              </Text>
            </View>
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
        disabled={!user}
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

  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  author: { fontWeight: "700" },

  date: {
    fontSize: 12,
    color: "#666",
  },

  empty: {
    fontStyle: "italic",
    color: "#666",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
});

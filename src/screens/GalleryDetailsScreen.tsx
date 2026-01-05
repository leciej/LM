import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  Button,
  ToastAndroid,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { galleryStore } from "@/features/gallery/store/galleryStore";
import { CartApi } from "@/api/cart";
import { useAuth } from "@/auth/AuthContext";
import { GalleryRatingsApi } from "@/api/galleryRatings/galleryRatingsApi";

// ✅ WAŻNE: używamy LOCAL cartStore do badge/UI
import { addItemToCart } from "@/features/cart/store/cartStore";

type GalleryStackParamList = {
  Gallery: undefined;
  GalleryDetails: {
    galleryId: string;
  };
};

type Props = NativeStackScreenProps<GalleryStackParamList, "GalleryDetails">;

/* =========================
   HELPERS
   ========================= */

const toast = (msg: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }
};

/* =========================
   COMPONENT
   ========================= */

export function GalleryDetailsScreen({ route, navigation }: Props) {
  const { isLoggedIn, user } = useAuth();

  /* =========================
     STATE (BACKEND)
     ========================= */

  const [average, setAverage] = useState(0);
  const [votes, setVotes] = useState(0);
  const [myRating, setMyRating] = useState<number | null>(null);

  /* =========================
     STATE (UI)
     ========================= */

  const [previewRating, setPreviewRating] = useState<number | null>(null);

  const scales = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(1))
  ).current;

  const { galleryId } = route.params;
  const item = galleryStore.items.find((g) => g.id === galleryId);

  /* =========================
     LOAD RATINGS
     ========================= */

  const loadRatings = useCallback(async () => {
    const res = await GalleryRatingsApi.getByGalleryItemId(
      galleryId,
      user?.id // może być null, backend ogarnia
    );

    setAverage(res.average);
    setVotes(res.votes);
    setMyRating(res.myRating);
  }, [galleryId, user?.id]);

  useEffect(() => {
    loadRatings().catch(() => toast("Nie udało się pobrać ocen"));
  }, [loadRatings]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Nie znaleziono arcydzieła</Text>
      </View>
    );
  }

  /* =========================
     HELPERS
     ========================= */

  const animateStar = (index: number) => {
    Animated.sequence([
      Animated.spring(scales[index], {
        toValue: 1.4,
        useNativeDriver: true,
      }),
      Animated.spring(scales[index], {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const commitRating = async (value: number) => {
    if (!isLoggedIn || myRating !== null || !user) return;

    try {
      await GalleryRatingsApi.create(galleryId, {
        userId: user.id,
        value,
      });

      setMyRating(value);
      await loadRatings();

      for (let i = 0; i < value; i++) {
        animateStar(i);
      }

      toast("Dodano ocenę ⭐");
    } catch {
      toast("Nie udało się dodać oceny");
      await loadRatings();
    }
  };

  /* =========================
     CART → BACKEND + LOCAL UI
     ========================= */

  const handleAddToCart = async () => {
    if (!isLoggedIn) return;

    try {
      // ✅ 1) zapis do bazy (backend)
      // ❌ NIE wysyłamy userId — frontowy AddToCartRequestDto go nie ma
      await CartApi.addItem({
        productId: item.id,
        quantity: 1,
      });

      // ✅ 2) dopisanie do LOCAL koszyka (badge/UI)
      // mapujemy GalleryItem → ProductDto (minimalne pola)
      addItemToCart(
        {
          id: item.id,
          name: item.title,
          price: item.price,
          imageUrl: item.imageUrl,
          description: `Arcydzieło: ${item.title}`,
        } as any,
        "GALLERY"
      );

      toast(`Dodano "${item.title}" do koszyka`);
      navigation.goBack();
    } catch (err) {
      console.error("ADD TO CART ERROR", err);
      toast("Nie udało się dodać do koszyka");
    }
  };

  /* =========================
     RENDER HELPERS
     ========================= */

  const fullStars = Math.floor(average);
  const hasHalfStar = average - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const myStars = previewRating ?? myRating ?? 0;

  const renderAverageStars = () => (
    <>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Text key={`f-${i}`} style={[styles.star, styles.starActive]}>
          ★
        </Text>
      ))}
      {hasHalfStar && <Text style={[styles.star, styles.starHalf]}>★</Text>}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Text key={`e-${i}`} style={styles.star}>
          ★
        </Text>
      ))}
    </>
  );

  const renderMyStars = () =>
    [0, 1, 2, 3, 4].map((i) => (
      <Pressable
        key={i}
        onPressIn={() => setPreviewRating(i + 1)}
        onPressOut={() => setPreviewRating(null)}
        onPress={() => commitRating(i + 1)}
        disabled={!isLoggedIn || myRating !== null}
      >
        <Animated.Text
          style={[
            styles.star,
            i < myStars && styles.starActive,
            { transform: [{ scale: scales[i] }] },
          ]}
        >
          ★
        </Animated.Text>
      </Pressable>
    ));

  /* =========================
     RENDER
     ========================= */

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <Text style={styles.name}>{item.title}</Text>
      <Text style={styles.author}>{item.artist}</Text>

      <Text style={styles.price}>{item.price.toFixed(2)} zł</Text>

      <Button
        title={isLoggedIn ? "Dodaj do koszyka" : "Zaloguj się, aby dodać do koszyka"}
        disabled={!isLoggedIn}
        onPress={handleAddToCart}
      />

      {/* ŚREDNIA */}
      <View style={styles.ratingRow}>
        <View style={styles.starsRow}>{renderAverageStars()}</View>
        <Text style={styles.ratingText}>
          {average} / 5 ({votes} ocen)
        </Text>
      </View>

      {/* TWOJA OCENA */}
      <Text style={styles.sectionTitle}>{myRating ? "Twoja ocena" : "Oceń arcydzieło"}</Text>

      <View style={styles.starsRow}>{renderMyStars()}</View>

      {myRating && (
        <Text style={styles.myRatingText}>
          Dziękujemy za ocenę ⭐ ({myRating}/5)
        </Text>
      )}
    </ScrollView>
  );
}

/* =========================
   STYLES
   ========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: "#eee",
  },
  name: { fontSize: 22, fontWeight: "700" },
  author: { fontSize: 14, color: "#666" },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563EB",
  },
  ratingRow: { marginVertical: 16 },
  starsRow: { flexDirection: "row" },
  star: {
    fontSize: 34,
    color: "#ccc",
    marginRight: 4,
  },
  starActive: { color: "#f5b301" },
  starHalf: {
    color: "#f5b301",
    opacity: 0.5,
  },
  ratingText: {
    marginTop: 4,
    fontSize: 14,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  myRatingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#2563EB",
  },
});

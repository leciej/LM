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
import { addItemToCart } from "@/features/cart/store/cartStore";
import { useAuth } from "@/auth/AuthContext";
import { GalleryRatingsApi } from "@/api/galleryRatings/galleryRatingsApi";

type GalleryStackParamList = {
  Gallery: undefined;
  GalleryDetails: {
    galleryId: string;
  };
};

type Props = NativeStackScreenProps<
  GalleryStackParamList,
  "GalleryDetails"
>;

/* =========================
   FAKE VOTES (UI ONLY)
   ========================= */

const getRandomVotes = () =>
  Math.floor(Math.random() * 5) + 2; // 2–6

const getRandomRatingValue = () =>
  Math.floor(Math.random() * 2) + 4; // 4 albo 5

const toast = (msg: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }
};

export function GalleryDetailsScreen({ route, navigation }: Props) {
  const { isLoggedIn } = useAuth();

  /* =========================
     STATE (BACKEND)
     ========================= */

  const [average, setAverage] = useState(0);
  const [votes, setVotes] = useState(0);
  const [myRating, setMyRating] = useState<number | null>(null);

  /* =========================
     STATE (UI)
     ========================= */

  const [previewRating, setPreviewRating] =
    useState<number | null>(null);

  // fake votes stałe na sesję
  const fakeVotesRef = useRef(getRandomVotes());
  const fakeValueRef = useRef(getRandomRatingValue());

  const scales = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(1))
  ).current;

  const { galleryId } = route.params;
  const item = galleryStore.items.find(g => g.id === galleryId);

  /* =========================
     LOAD RATINGS
     ========================= */

  const loadRatings = useCallback(async () => {
    const res =
      await GalleryRatingsApi.getByGalleryItemId(galleryId, 1); // userId = 1 (jak w Swaggerze)

    setAverage(res.average);
    setVotes(res.votes);
    setMyRating(res.myRating);
  }, [galleryId]);

  useEffect(() => {
    loadRatings().catch(() =>
      toast("Nie udało się pobrać ocen")
    );
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
    if (myRating !== null) return;

    try {
      await GalleryRatingsApi.create(galleryId, {
        userId: 1, // NA RAZIE NA SZTYWNO
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

  const handleAddToCart = () => {
    if (!isLoggedIn) return;

    addItemToCart(
      {
        id: item.id,
        name: item.title,
        imageUrl: item.imageUrl,
        price: item.price,
        description: `Arcydzieło: ${item.title}`,
      },
      "GALLERY"
    );

    toast(`Dodano "${item.title}" do koszyka`);
    navigation.goBack();
  };

  /* =========================
     ŚREDNIA Z FAKE VOTES
     ========================= */

  const fakeVotes = fakeVotesRef.current;
  const fakeValue = fakeValueRef.current;

  const realVotes = votes;
  const realSum = average * realVotes;

  const fakeSum = fakeVotes * fakeValue;
  const totalVotes = realVotes + fakeVotes;

  const displayedAverage =
    totalVotes > 0
      ? Math.round(((realSum + fakeSum) / totalVotes) * 10) / 10
      : 0;

  const displayedVotes = totalVotes;

  /* =========================
     GWIAZDKI
     ========================= */

  const fullStars = Math.floor(displayedAverage);
  const hasHalfStar =
    displayedAverage - fullStars >= 0.5;
  const emptyStars =
    5 - fullStars - (hasHalfStar ? 1 : 0);

  const myStars = previewRating ?? myRating ?? 0;

  const renderAverageStars = () => (
    <>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Text key={`f-${i}`} style={[styles.star, styles.starActive]}>
          ★
        </Text>
      ))}
      {hasHalfStar && (
        <Text style={[styles.star, styles.starHalf]}>★</Text>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Text key={`e-${i}`} style={styles.star}>
          ★
        </Text>
      ))}
    </>
  );

  const renderMyStars = () =>
    [0, 1, 2, 3, 4].map(i => (
      <Pressable
        key={i}
        onPressIn={() => setPreviewRating(i + 1)}
        onPressOut={() => setPreviewRating(null)}
        onPress={() => commitRating(i + 1)}
        disabled={myRating !== null}
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
        title={
          isLoggedIn
            ? "Dodaj do koszyka"
            : "Zaloguj się, aby dodać do koszyka"
        }
        disabled={!isLoggedIn}
        onPress={handleAddToCart}
      />

      {/* ŚREDNIA */}
      <View style={styles.ratingRow}>
        <View style={styles.starsRow}>
          {renderAverageStars()}
        </View>
        <Text style={styles.ratingText}>
          {displayedAverage} / 5 ({displayedVotes} ocen)
        </Text>
      </View>

      {/* TWOJA OCENA */}
      <Text style={styles.sectionTitle}>
        {myRating ? "Twoja ocena" : "Oceń arcydzieło"}
      </Text>

      <View style={styles.starsRow}>
        {renderMyStars()}
      </View>

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
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: "#eee",
  },
  name: { fontSize: 22, fontWeight: "700" },
  author: { fontSize: 14, color: "#666" },
  price: { fontSize: 20, fontWeight: "700", color: "#2563EB" },
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
  ratingText: { marginTop: 4, fontSize: 14, color: "#444" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  myRatingText: { marginTop: 8, fontSize: 14, color: "#2563EB" },
});

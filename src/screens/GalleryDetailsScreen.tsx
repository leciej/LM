import React, { useRef, useState } from 'react';
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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { galleryStore } from '@/features/gallery/store/galleryStore';
import { addItemToCart } from '@/features/cart/store/cartStore';
import { useAuth } from '@/auth/AuthContext';
import { addRating } from '@/features/ratings/store/ratingsStore';

type GalleryStackParamList = {
  Gallery: undefined;
  GalleryDetails: {
    galleryId: string;
  };
};

type Props = NativeStackScreenProps<
  GalleryStackParamList,
  'GalleryDetails'
>;

const getRandomRating = () =>
  Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
const getRandomVotes = () =>
  Math.floor(Math.random() * 5) + 2;

export function GalleryDetailsScreen({ route }: Props) {
  const { isLoggedIn } = useAuth();

  const [average, setAverage] = useState(getRandomRating);
  const [votes, setVotes] = useState(getRandomVotes);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [previewRating, setPreviewRating] =
    useState<number | null>(null);

  const scales = useRef(
    Array.from({ length: 5 }, () => new Animated.Value(1))
  ).current;

  const { galleryId } = route.params;
  const item = galleryStore.items.find(g => g.id === galleryId);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Nie znaleziono arcydzieła</Text>
      </View>
    );
  }

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

  const commitRating = (value: number) => {
    if (myRating !== null) return;

    const newAverage =
      (average * votes + value) / (votes + 1);

    setAverage(Math.round(newAverage * 10) / 10);
    setVotes(votes + 1);
    setMyRating(value);
    setPreviewRating(null);

    addRating(item.id);

    for (let i = 0; i < value; i++) {
      animateStar(i);
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
  'GALLERY'
);


    if (Platform.OS === 'android') {
      ToastAndroid.show(
        `Dodano "${item.title}" do koszyka`,
        ToastAndroid.SHORT
      );
    }
  };

  const renderStaticStars = (value: number) =>
    [0, 1, 2, 3, 4].map(i => (
      <Text
        key={i}
        style={[
          styles.star,
          i < value && styles.starActive,
        ]}
      >
        ★
      </Text>
    ));

  const renderInteractiveStars = () => {
    const active = previewRating ?? myRating ?? 0;

    return [0, 1, 2, 3, 4].map(i => (
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
            i < active && styles.starActive,
            { transform: [{ scale: scales[i] }] },
          ]}
        >
          ★
        </Animated.Text>
      </Pressable>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
      />

      <Text style={styles.name}>{item.title}</Text>
      <Text style={styles.author}>{item.artist}</Text>

      <Text style={styles.price}>
        {item.price.toFixed(2)} zł
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

      <View style={styles.ratingRow}>
        <View style={styles.starsRow}>
          {renderStaticStars(Math.round(average))}
        </View>
        <Text style={styles.ratingText}>
          {average} / 5 ({votes} ocen)
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        {myRating ? 'Twoja ocena' : 'Oceń arcydzieło'}
      </Text>

      <View style={styles.starsRow}>
        {renderInteractiveStars()}
      </View>

      {myRating && (
        <Text style={styles.myRatingText}>
          Dziękujemy za ocenę ⭐
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 14,
    marginBottom: 16,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 12,
  },
  ratingRow: {
    marginTop: 16,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 34,
    color: '#ccc',
    marginRight: 4,
  },
  starActive: {
    color: '#f5b301',
  },
  ratingText: {
    marginTop: 4,
    fontSize: 14,
    color: '#444',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  myRatingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#2563EB',
  },
});

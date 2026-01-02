import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { observer } from 'mobx-react-lite';

import { galleryStore } from '@/features/gallery/store/galleryStore';
import { GalleryItemDto } from '@/api/gallery';

/* =========================
   TYPES
   ========================= */

type SortOption =
  | 'TITLE_ASC'
  | 'TITLE_DESC'
  | 'ARTIST_ASC'
  | 'ARTIST_DESC'
  | 'PRICE_ASC'
  | 'PRICE_DESC';

/* =========================
   COMPONENT
   ========================= */

function GalleryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const listRef = useRef<FlatList>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sort, setSort] =
    useState<SortOption>('TITLE_ASC');

  /* =========================
     LOAD DATA
     ========================= */

  useFocusEffect(
    useCallback(() => {
      galleryStore.load();
    }, [])
  );

  /* =========================
     REACT TO HEADER HAMBURGER
     ========================= */

  useEffect(() => {
    if (route.params?.openSortMenu) {
      setMenuOpen(true);
    }
  }, [route.params?.openSortMenu]);

  /* =========================
     SORTED ITEMS
     ========================= */

  const sortedItems = useMemo(() => {
    const copy = [...galleryStore.items];

    switch (sort) {
      case 'PRICE_ASC':
        return copy.sort((a, b) => a.price - b.price);

      case 'PRICE_DESC':
        return copy.sort((a, b) => b.price - a.price);

      case 'TITLE_DESC':
        return copy.sort((a, b) =>
          b.title.localeCompare(a.title)
        );

      case 'ARTIST_ASC':
        return copy.sort((a, b) =>
          a.artist.localeCompare(b.artist)
        );

      case 'ARTIST_DESC':
        return copy.sort((a, b) =>
          b.artist.localeCompare(a.artist)
        );

      case 'TITLE_ASC':
      default:
        return copy.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
    }
  }, [sort]); // ✅ poprawne dla MobX

  /* =========================
     HANDLERS
     ========================= */

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  };

  const goToDetails = (item: GalleryItemDto) => {
    navigation.navigate('GalleryDetails', {
      galleryId: item.id,
    });
  };

  const selectSort = (value: SortOption) => {
    setSort(value);
    setMenuOpen(false);
  };

  /* =========================
     RENDER
     ========================= */

  return (
    <View style={styles.container}>
      {/* SORT MENU OVERLAY */}
      {menuOpen && (
        <Pressable
          style={styles.overlay}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>
              Sortuj według
            </Text>

            <MenuItem
              label="Tytuł A–Z"
              active={sort === 'TITLE_ASC'}
              onPress={() => selectSort('TITLE_ASC')}
            />
            <MenuItem
              label="Tytuł Z–A"
              active={sort === 'TITLE_DESC'}
              onPress={() => selectSort('TITLE_DESC')}
            />
            <MenuItem
              label="Autor A–Z"
              active={sort === 'ARTIST_ASC'}
              onPress={() => selectSort('ARTIST_ASC')}
            />
            <MenuItem
              label="Autor Z–A"
              active={sort === 'ARTIST_DESC'}
              onPress={() => selectSort('ARTIST_DESC')}
            />
            <MenuItem
              label="Cena rosnąco"
              active={sort === 'PRICE_ASC'}
              onPress={() => selectSort('PRICE_ASC')}
            />
            <MenuItem
              label="Cena malejąco"
              active={sort === 'PRICE_DESC'}
              onPress={() => selectSort('PRICE_DESC')}
            />
          </View>
        </Pressable>
      )}

      {/* LIST */}
      <FlatList
        ref={listRef}
        data={sortedItems}
        keyExtractor={(item: GalleryItemDto) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        onScroll={e => {
          setShowScrollTop(
            e.nativeEvent.contentOffset.y > 300
          );
        }}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Brak arcydzieł
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <Pressable onPress={() => goToDetails(item)}>
              <View style={styles.card}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                />

                <View style={styles.textBox}>
                  <Text
                    style={styles.name}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={styles.author}
                    numberOfLines={1}
                  >
                    {item.artist}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}
      />

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <Pressable
          style={styles.scrollTopButton}
          onPress={scrollToTop}
        >
          <Text style={styles.scrollTopText}>⬆</Text>
        </Pressable>
      )}
    </View>
  );
}

export default observer(GalleryScreen);

/* =========================
   MENU ITEM
   ========================= */

function MenuItem({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.menuItem,
        active && styles.menuItemActive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.menuItemText,
          active && styles.menuItemTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
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
  row: {
    justifyContent: 'space-between',
  },
  content: {
    paddingBottom: 80,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
  },
  textBox: {
    padding: 10,
  },
  name: {
    fontWeight: '700',
    fontSize: 14,
  },
  author: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  menu: {
    position: 'absolute',
    top: 8,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: 200,
    elevation: 8,
  },
  menuTitle: {
    fontWeight: '800',
    marginBottom: 8,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: '#2563EB',
  },
  menuItemText: {
    fontSize: 14,
  },
  menuItemTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  scrollTopButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2563EB',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  scrollTopText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import { mockProducts } from '../features/products/mockProducts';

export function AdminAddProductScreen({ navigation, route }: any) {
  const editingProductId = route?.params?.productId;
  const editingProduct = editingProductId
    ? mockProducts.find(p => p.id === editingProductId)
    : undefined;

  const [name, setName] = useState(editingProduct?.name ?? '');
  const [artist, setArtist] = useState(editingProduct?.artist ?? '');
  const [price, setPrice] = useState(
    editingProduct ? String(editingProduct.price) : ''
  );
  const [image, setImage] = useState<string | undefined>(
    editingProduct?.image
  );
  const [imageUrlInput, setImageUrlInput] = useState('');

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
      setImageUrlInput('');
    }
  };

  const applyImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImage(imageUrlInput.trim());
    }
  };

  const saveProduct = () => {
    if (!name || !artist || !price) return;

    if (editingProduct) {
      editingProduct.name = name;
      editingProduct.artist = artist;
      editingProduct.price = Number(price);
      editingProduct.image = image;
    } else {
      mockProducts.push({
        id: Date.now().toString(),
        name,
        artist,
        price: Number(price),
        image,
      });
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingProduct ? 'Edytuj produkt' : 'Dodaj produkt'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nazwa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Artysta"
        value={artist}
        onChangeText={setArtist}
      />

      <TextInput
        style={styles.input}
        placeholder="Cena"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Pressable
        style={styles.imageButton}
        onPress={pickImage}
      >
        <Text style={styles.imageText}>
          Wybierz obraz z dysku
        </Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="lub wklej URL obrazu"
        value={imageUrlInput}
        onChangeText={setImageUrlInput}
        onBlur={applyImageUrl}
      />

      {image && (
        <Image
          source={{ uri: image }}
          style={styles.preview}
        />
      )}

      <Pressable
        style={styles.saveButton}
        onPress={saveProduct}
      >
        <Text style={styles.saveText}>
          Zapisz
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  imageButton: {
    backgroundColor: '#455a64',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  imageText: {
    color: '#fff',
    textAlign: 'center',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 6,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

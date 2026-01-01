import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import type {
  CreateProductRequestDto,
  UpdateProductRequestDto,
  ProductDto,
} from '../api/products';
import { useProducts } from '../features/products/useProducts';
import { ProductsApi } from '../api/products';
import { addActivity } from '../features/activity/store/activityStore';

export function AdminAddProductScreen({ navigation, route }: any) {
  const editingProductId: string | undefined =
    route?.params?.productId;

  const { products, add, update } = useProducts();

  const [editingProduct, setEditingProduct] =
    useState<ProductDto | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!editingProductId) return;

    const local = products.find(p => p.id === editingProductId);
    if (local) {
      setEditingProduct(local);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        const remote = await ProductsApi.getById(editingProductId);
        if (!cancelled) setEditingProduct(remote);
      } catch {
        Alert.alert('Błąd', 'Nie udało się załadować produktu');
        navigation.goBack();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [editingProductId, products, navigation]);

  useEffect(() => {
    if (!editingProduct) return;

    setName(editingProduct.name);
    setPrice(String(editingProduct.price));
    setDescription(editingProduct.description ?? '');
    setImageUrl(editingProduct.imageUrl);
  }, [editingProduct]);

  const toast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets?.[0]?.uri) {
      setImageUrl(result.assets[0].uri);
      setImageUrlInput('');
    }
  };

  const applyImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImageUrl(imageUrlInput.trim());
    }
  };

  const saveProduct = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Błąd', 'Uzupełnij nazwę i cenę');
      return;
    }

    try {
      setIsSaving(true);

      if (editingProductId) {
        const payload: UpdateProductRequestDto = {
          name: name.trim(),
          price: Number(price),
          description: description.trim(),
          imageUrl,
        };

        await update(editingProductId, payload);
        addActivity('EDIT_PRODUCT');
        toast('Zaktualizowano produkt');
      } else {
        const payload: CreateProductRequestDto = {
          name: name.trim(),
          price: Number(price),
          description: description.trim(),
          imageUrl,
        };

        await add(payload);
        addActivity('ADD_PRODUCT');
        toast('Dodano produkt');
      }

      navigation.goBack();
    } catch {
      Alert.alert('Błąd', 'Nie udało się zapisać produktu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingProductId ? 'Edytuj produkt' : 'Dodaj produkt'}
      </Text>

      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Nazwa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Cena"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Opis"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Pressable style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageText}>Wybierz obraz</Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="lub URL obrazu"
        value={imageUrlInput}
        onChangeText={setImageUrlInput}
        onBlur={applyImageUrl}
      />

      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.preview} />
      )}

      <Pressable
        style={[styles.saveButton, isSaving && styles.disabled]}
        onPress={saveProduct}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Zapisz</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },

  loading: {
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },

  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
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
    fontWeight: '600',
  },

  preview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },

  saveButton: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
  },

  disabled: {
    opacity: 0.7,
  },
});

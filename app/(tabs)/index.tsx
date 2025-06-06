"use client"

import { View, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { router } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import { useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { StickerStorage, type StickerData } from "@/lib/storage"
import { Image } from "expo-image"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useColorScheme } from "@/hooks/useColorScheme"

export default function HomeScreen() {
  const colorScheme = useColorScheme()
  const [recentStickers, setRecentStickers] = useState<StickerData[]>([])

  const loadRecentStickers = async () => {
    try {
      const stickers = await StickerStorage.getAllStickers()
      setRecentStickers(stickers.slice(0, 6)) // Show last 6 stickers
    } catch (error) {
      console.error("Error loading stickers:", error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadRecentStickers()
    }, []),
  )

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission needed", "We need camera roll permissions to select images.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      router.push({
        pathname: "/create-sticker",
        params: { imageUri: result.assets[0].uri },
      })
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== "granted") {
      Alert.alert("Permission needed", "We need camera permissions to take photos.")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      router.push({
        pathname: "/create-sticker",
        params: { imageUri: result.assets[0].uri },
      })
    }
  }

  const generateWithAI = () => {
    router.push("/ai-generator")
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          AI Sticker
        </ThemedText>
        <ThemedText style={styles.subtitle}>Create amazing stickers with AI</ThemedText>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}
          onPress={pickImage}
        >
          <IconSymbol name="photo" size={48} color={colorScheme === "dark" ? "#fff" : "#000"} />
          <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
            Upload Image
          </ThemedText>
          <ThemedText style={styles.optionDescription}>Select from gallery</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}
          onPress={takePhoto}
        >
          <IconSymbol name="camera" size={48} color={colorScheme === "dark" ? "#fff" : "#000"} />
          <ThemedText type="defaultSemiBold" style={styles.optionTitle}>
            Take Photo
          </ThemedText>
          <ThemedText style={styles.optionDescription}>Use camera</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionCard, styles.aiCard]} onPress={generateWithAI}>
          <IconSymbol name="sparkles" size={48} color="#fff" />
          <ThemedText type="defaultSemiBold" style={[styles.optionTitle, { color: "#fff" }]}>
            AI Generator
          </ThemedText>
          <ThemedText style={[styles.optionDescription, { color: "#fff", opacity: 0.9 }]}>Create with AI</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.recentSection}>
        <ThemedText type="subtitle">Recent Stickers</ThemedText>
        <View style={styles.recentGrid}>
          {recentStickers.length > 0 ? (
            recentStickers.map((sticker) => (
              <TouchableOpacity
                key={sticker.id}
                style={[styles.recentItem, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}
              >
                <Image source={{ uri: sticker.imageUri }} style={styles.recentImage} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.recentItem, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}>
              <ThemedText style={styles.emptyText}>No stickers yet</ThemedText>
            </View>
          )}
        </View>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  optionCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  aiCard: {
    backgroundColor: "#6366f1",
  },
  optionTitle: {
    fontSize: 18,
  },
  optionDescription: {
    opacity: 0.7,
    fontSize: 14,
  },
  recentSection: {
    flex: 1,
  },
  recentGrid: {
    marginTop: 16,
  },
  recentItem: {
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    opacity: 0.5,
    fontSize: 14,
  },
  recentImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
})

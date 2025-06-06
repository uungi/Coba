"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, TouchableOpacity, Alert, Dimensions } from "react-native"
import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import * as MediaLibrary from "expo-media-library"
import * as Sharing from "expo-sharing"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useColorScheme } from "@/hooks/useColorScheme"
import { BackgroundRemovalService } from "@/lib/background-removal"
import { ImageProcessor } from "@/lib/image-processor"
import { StickerStorage } from "@/lib/storage"
import { TextEditor } from "@/components/TextEditor"

const { width } = Dimensions.get("window")
const STICKER_SIZE = width - 80

interface TextElement {
  id: string
  text: string
  style: {
    fontSize: number
    color: string
    fontWeight: "normal" | "bold"
    textAlign: "left" | "center" | "right"
  }
}

export default function CreateStickerScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>()
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const colorScheme = useColorScheme()
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [textElements, setTextElements] = useState<TextElement[]>([])

  useEffect(() => {
    if (imageUri) {
      // Simulate AI processing
      setTimeout(() => {
        setProcessedImage(imageUri)
      }, 1000)
    }
  }, [imageUri])

  const removeBackground = async () => {
    if (!processedImage) return

    setIsProcessing(true)
    try {
      const result = await BackgroundRemovalService.removeBackground(processedImage)
      setProcessedImage(result)
      Alert.alert("Success", "Background removed successfully!")
    } catch (error) {
      Alert.alert("Error", "Failed to remove background")
    } finally {
      setIsProcessing(false)
    }
  }

  const saveSticker = async () => {
    if (!processedImage) return

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission needed", "We need permission to save to your gallery.")
        return
      }

      // Process image to PNG with transparency
      const pngUri = await ImageProcessor.exportToPNG(processedImage, true)

      // Save to device gallery
      await MediaLibrary.saveToLibraryAsync(pngUri)

      // Save to local storage
      await StickerStorage.saveSticker({
        imageUri: pngUri,
        name: `Sticker - ${new Date().toLocaleDateString()}`,
      })

      Alert.alert("Success", "Sticker saved to gallery and collection!")
    } catch (error) {
      Alert.alert("Error", "Failed to save sticker")
    }
  }

  const shareSticker = async () => {
    if (!processedImage) return

    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(processedImage)
      } else {
        Alert.alert("Error", "Sharing is not available on this device")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to share sticker")
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colorScheme === "dark" ? "#fff" : "#000"} />
        </TouchableOpacity>
        <ThemedText type="defaultSemiBold">Create Sticker</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.previewContainer}>
        <View style={[styles.stickerPreview, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}>
          {processedImage ? (
            <Image source={{ uri: processedImage }} style={styles.stickerImage} />
          ) : (
            <View style={styles.loadingContainer}>
              <IconSymbol name="photo" size={48} color={colorScheme === "dark" ? "#666" : "#999"} />
              <ThemedText style={styles.loadingText}>Processing...</ThemedText>
            </View>
          )}
        </View>
      </View>

      <View style={styles.toolsContainer}>
        <TouchableOpacity
          style={[styles.toolButton, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}
          onPress={removeBackground}
          disabled={isProcessing}
        >
          <IconSymbol name="scissors" size={24} color={colorScheme === "dark" ? "#fff" : "#000"} />
          <ThemedText style={styles.toolText}>Remove BG</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolButton, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}
          onPress={() => setShowTextEditor(true)}
        >
          <IconSymbol name="textformat" size={24} color={colorScheme === "dark" ? "#fff" : "#000"} />
          <ThemedText style={styles.toolText}>Add Text</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolButton, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}
          onPress={() => Alert.alert("Coming Soon", "Effects feature coming soon!")}
        >
          <IconSymbol name="sparkles" size={24} color={colorScheme === "dark" ? "#fff" : "#000"} />
          <ThemedText style={styles.toolText}>Effects</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={saveSticker}
          disabled={!processedImage}
        >
          <IconSymbol name="square.and.arrow.down" size={20} color="#fff" />
          <ThemedText style={[styles.actionText, { color: "#fff" }]}>Save</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={shareSticker}
          disabled={!processedImage}
        >
          <IconSymbol name="square.and.arrow.up" size={20} color="#fff" />
          <ThemedText style={[styles.actionText, { color: "#fff" }]}>Share</ThemedText>
        </TouchableOpacity>
      </View>

      <TextEditor
        visible={showTextEditor}
        onClose={() => setShowTextEditor(false)}
        onSave={(text, style) => {
          const newTextElement: TextElement = {
            id: Date.now().toString(),
            text,
            style,
          }
          setTextElements((prev) => [...prev, newTextElement])
        }}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
    marginBottom: 32,
  },
  previewContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  stickerPreview: {
    width: STICKER_SIZE,
    height: STICKER_SIZE,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  stickerImage: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    opacity: 0.7,
  },
  toolsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
  },
  toolButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    minWidth: 80,
  },
  toolText: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButton: {
    backgroundColor: "#10b981",
  },
  shareButton: {
    backgroundColor: "#6366f1",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },
})

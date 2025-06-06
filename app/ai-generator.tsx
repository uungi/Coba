"use client"

import { useState } from "react"
import { View, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native"
import { router, useLocalSearchParams } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useColorScheme } from "@/hooks/useColorScheme"
import { AIService } from "@/lib/ai-service"
import { StickerStorage } from "@/lib/storage"

const styles_suggestions = [
  "Cute cartoon style",
  "Minimalist design",
  "Emoji style",
  "Vintage retro",
  "Watercolor art",
  "Line art sketch",
]

export default function AIGeneratorScreen() {
  const { template } = useLocalSearchParams<{ template?: string }>()
  const [prompt, setPrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState(template || "")
  const [isGenerating, setIsGenerating] = useState(false)
  const colorScheme = useColorScheme()

  const generateSticker = async () => {
    if (!prompt.trim()) {
      Alert.alert("Error", "Please enter a description for your sticker")
      return
    }

    setIsGenerating(true)

    try {
      const result = await AIService.generateSticker({
        prompt,
        style: selectedStyle,
        size: "medium",
      })

      // Save to local storage
      await StickerStorage.saveSticker({
        imageUri: result.imageUrl,
        prompt: result.prompt,
        style: result.style,
        name: `AI Sticker - ${prompt.slice(0, 20)}...`,
      })

      Alert.alert("Success!", "Your AI sticker has been generated and saved!", [
        { text: "OK", onPress: () => router.back() },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to generate sticker. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colorScheme === "dark" ? "#fff" : "#000"} />
        </TouchableOpacity>
        <ThemedText type="defaultSemiBold">AI Generator</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Describe your sticker
          </ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5",
                color: colorScheme === "dark" ? "#fff" : "#000",
              },
            ]}
            placeholder="e.g., A cute cat wearing sunglasses"
            placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Choose style
          </ThemedText>
          <View style={styles.stylesGrid}>
            {styles_suggestions.map((style, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.styleChip,
                  {
                    backgroundColor:
                      selectedStyle === style.toLowerCase()
                        ? "#6366f1"
                        : colorScheme === "dark"
                          ? "#2A2A2A"
                          : "#F5F5F5",
                  },
                ]}
                onPress={() => setSelectedStyle(style.toLowerCase())}
              >
                <ThemedText
                  style={[styles.styleText, { color: selectedStyle === style.toLowerCase() ? "#fff" : undefined }]}
                >
                  {style}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Preview
          </ThemedText>
          <View style={[styles.previewContainer, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}>
            {isGenerating ? (
              <View style={styles.generatingContainer}>
                <IconSymbol name="sparkles" size={48} color="#6366f1" />
                <ThemedText style={styles.generatingText}>Generating your sticker...</ThemedText>
              </View>
            ) : (
              <View style={styles.emptyPreview}>
                <IconSymbol name="photo" size={48} color={colorScheme === "dark" ? "#666" : "#999"} />
                <ThemedText style={styles.emptyText}>Your sticker will appear here</ThemedText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.generateButton, { opacity: isGenerating ? 0.6 : 1 }]}
        onPress={generateSticker}
        disabled={isGenerating}
      >
        <IconSymbol name="sparkles" size={20} color="#fff" />
        <ThemedText style={styles.generateText}>{isGenerating ? "Generating..." : "Generate Sticker"}</ThemedText>
      </TouchableOpacity>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  textInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 80,
  },
  stylesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  styleChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  styleText: {
    fontSize: 14,
  },
  previewContainer: {
    height: 200,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  generatingContainer: {
    alignItems: "center",
    gap: 16,
  },
  generatingText: {
    fontSize: 16,
    opacity: 0.8,
  },
  emptyPreview: {
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    opacity: 0.5,
  },
  generateButton: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  generateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

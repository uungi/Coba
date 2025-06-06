"use client"

import { useState } from "react"
import { View, StyleSheet, TextInput, TouchableOpacity, Modal } from "react-native"
import type { TextStyle as RNTextStyle } from "react-native"
import { ThemedText } from "./ThemedText"
import { ThemedView } from "./ThemedView"
import { useColorScheme } from "@/hooks/useColorScheme"

interface TextEditorProps {
  visible: boolean
  onClose: () => void
  onSave: (text: string, style: CustomTextStyle) => void
}

interface CustomTextStyle {
  fontSize: number
  color: string
  fontWeight: "normal" | "bold"
  textAlign: "left" | "center" | "right"
}

const colors = ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"]
const fontSizes = [16, 20, 24, 32, 40, 48]

export function TextEditor({ visible, onClose, onSave }: TextEditorProps) {
  const [text, setText] = useState("")
  const [textStyle, setTextStyle] = useState<CustomTextStyle>({
    fontSize: 24,
    color: "#000000",
    fontWeight: "normal",
    textAlign: "center",
  })
  const colorScheme = useColorScheme()

  const handleSave = () => {
    if (text.trim()) {
      onSave(text, textStyle)
      setText("")
      onClose()
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <ThemedText>Cancel</ThemedText>
          </TouchableOpacity>
          <ThemedText type="defaultSemiBold">Add Text</ThemedText>
          <TouchableOpacity onPress={handleSave}>
            <ThemedText style={{ color: "#6366f1" }}>Save</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.previewContainer}>
          <View style={[styles.preview, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}>
            <ThemedText
              style={[
                styles.previewText,
                {
                  fontSize: textStyle.fontSize,
                  color: textStyle.color,
                  fontWeight: textStyle.fontWeight,
                  textAlign: textStyle.textAlign,
                } as RNTextStyle,
              ]}
            >
              {text || "Your text here"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5",
                color: colorScheme === "dark" ? "#fff" : "#000",
              },
            ]}
            placeholder="Enter your text"
            placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
            value={text}
            onChangeText={setText}
            multiline
          />
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Font Size
            </ThemedText>
            <View style={styles.fontSizeContainer}>
              {fontSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontSizeButton,
                    {
                      backgroundColor:
                        textStyle.fontSize === size ? "#6366f1" : colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5",
                    },
                  ]}
                  onPress={() => setTextStyle((prev) => ({ ...prev, fontSize: size }))}
                >
                  <ThemedText style={{ color: textStyle.fontSize === size ? "#fff" : undefined }}>{size}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Color
            </ThemedText>
            <View style={styles.colorContainer}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    textStyle.color === color && styles.selectedColor,
                  ]}
                  onPress={() => setTextStyle((prev) => ({ ...prev, color }))}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Style
            </ThemedText>
            <View style={styles.styleContainer}>
              <TouchableOpacity
                style={[
                  styles.styleButton,
                  {
                    backgroundColor:
                      textStyle.fontWeight === "normal" ? "#6366f1" : colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5",
                  },
                ]}
                onPress={() => setTextStyle((prev) => ({ ...prev, fontWeight: "normal" }))}
              >
                <ThemedText style={{ color: textStyle.fontWeight === "normal" ? "#fff" : undefined }}>
                  Normal
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.styleButton,
                  {
                    backgroundColor:
                      textStyle.fontWeight === "bold" ? "#6366f1" : colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5",
                  },
                ]}
                onPress={() => setTextStyle((prev) => ({ ...prev, fontWeight: "bold" }))}
              >
                <ThemedText style={{ color: textStyle.fontWeight === "bold" ? "#fff" : undefined, fontWeight: "bold" }}>
                  Bold
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ThemedView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  previewContainer: {
    marginBottom: 32,
  },
  preview: {
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  previewText: {
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 32,
  },
  textInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  controlsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  fontSizeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  fontSizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 50,
    alignItems: "center",
  },
  colorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: "#6366f1",
    borderWidth: 3,
  },
  styleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  styleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
})

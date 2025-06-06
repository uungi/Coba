import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { router } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { useColorScheme } from "@/hooks/useColorScheme"

const templates = [
  { id: 1, name: "Emoji Style", icon: "face.smiling", description: "Fun emoji-style stickers" },
  { id: 2, name: "Cartoon", icon: "paintbrush", description: "Cartoon character stickers" },
  { id: 3, name: "Minimalist", icon: "circle", description: "Clean and simple designs" },
  { id: 4, name: "Vintage", icon: "camera.vintage", description: "Retro-style stickers" },
]

const features = [
  { title: "AI Generation", description: "Create unique stickers with AI", icon: "sparkles" },
  { title: "Background Removal", description: "Auto remove backgrounds", icon: "scissors" },
  { title: "Multi-layer Editing", description: "Add text and effects", icon: "layers" },
  { title: "Export & Share", description: "Save and share easily", icon: "square.and.arrow.up" },
]

export default function ExploreScreen() {
  const colorScheme = useColorScheme()

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title">Explore</ThemedText>
          <ThemedText style={styles.subtitle}>Templates and features</ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Templates
          </ThemedText>
          <View style={styles.templatesGrid}>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[styles.templateCard, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}
                onPress={() =>
                  router.push({
                    pathname: "/ai-generator",
                    params: { template: template.name.toLowerCase() },
                  })
                }
              >
                <IconSymbol name={template.icon as any} size={32} color={colorScheme === "dark" ? "#fff" : "#000"} />
                <ThemedText type="defaultSemiBold" style={styles.templateName}>
                  {template.name}
                </ThemedText>
                <ThemedText style={styles.templateDescription}>{template.description}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Features
          </ThemedText>
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View
                key={index}
                style={[styles.featureCard, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}
              >
                <IconSymbol name={feature.icon as any} size={24} color={colorScheme === "dark" ? "#fff" : "#000"} />
                <View style={styles.featureContent}>
                  <ThemedText type="defaultSemiBold">{feature.title}</ThemedText>
                  <ThemedText style={styles.featureDescription}>{feature.description}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Tips
          </ThemedText>
          <View style={[styles.tipCard, { backgroundColor: colorScheme === "dark" ? "#2A2A2A" : "#F5F5F5" }]}>
            <IconSymbol name="lightbulb" size={24} color="#6366f1" />
            <View style={styles.tipContent}>
              <ThemedText type="defaultSemiBold">Pro Tip</ThemedText>
              <ThemedText style={styles.tipText}>
                Use high-resolution images for better AI generation results. Square images work best!
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 32,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  templatesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  templateCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  templateName: {
    fontSize: 16,
  },
  templateDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  featuresContainer: {
    gap: 12,
  },
  featureCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  tipCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "flex-start",
    gap: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
    lineHeight: 20,
  },
})

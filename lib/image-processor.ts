import * as FileSystem from "expo-file-system"
import { manipulateAsync, SaveFormat } from "expo-image-manipulator"

export interface ImageProcessingOptions {
  width?: number
  height?: number
  format?: "png" | "jpeg"
  quality?: number
  removeBackground?: boolean
}

export class ImageProcessor {
  static async processImage(imageUri: string, options: ImageProcessingOptions = {}): Promise<string> {
    try {
      const { width = 512, height = 512, format = "png", quality = 1.0 } = options

      // Resize and format image
      const manipulatedImage = await manipulateAsync(imageUri, [{ resize: { width, height } }], {
        compress: quality,
        format: format === "png" ? SaveFormat.PNG : SaveFormat.JPEG,
      })

      return manipulatedImage.uri
    } catch (error) {
      console.error("Error processing image:", error)
      throw error
    }
  }

  static async saveImageToDevice(imageUri: string, filename: string): Promise<string> {
    try {
      const documentDirectory = FileSystem.documentDirectory
      if (!documentDirectory) throw new Error("Document directory not available")

      const localUri = `${documentDirectory}${filename}`
      await FileSystem.copyAsync({
        from: imageUri,
        to: localUri,
      })

      return localUri
    } catch (error) {
      console.error("Error saving image:", error)
      throw error
    }
  }

  static async exportToPNG(imageUri: string, transparent = true): Promise<string> {
    try {
      const processedImage = await manipulateAsync(imageUri, [], {
        compress: 1.0,
        format: SaveFormat.PNG,
      })

      return processedImage.uri
    } catch (error) {
      console.error("Error exporting to PNG:", error)
      throw error
    }
  }
}

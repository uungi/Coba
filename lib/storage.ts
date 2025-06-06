import AsyncStorage from "@react-native-async-storage/async-storage"

export interface StickerData {
  id: string
  imageUri: string
  prompt?: string
  style?: string
  createdAt: number
  name: string
}

export class StickerStorage {
  private static STORAGE_KEY = "ai_stickers"

  static async saveSticker(sticker: Omit<StickerData, "id" | "createdAt">): Promise<StickerData> {
    try {
      const newSticker: StickerData = {
        ...sticker,
        id: `sticker_${Date.now()}`,
        createdAt: Date.now(),
      }

      const existingStickers = await this.getAllStickers()
      const updatedStickers = [newSticker, ...existingStickers]

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedStickers))
      return newSticker
    } catch (error) {
      console.error("Error saving sticker:", error)
      throw error
    }
  }

  static async getAllStickers(): Promise<StickerData[]> {
    try {
      const stickersJson = await AsyncStorage.getItem(this.STORAGE_KEY)
      return stickersJson ? JSON.parse(stickersJson) : []
    } catch (error) {
      console.error("Error getting stickers:", error)
      return []
    }
  }

  static async deleteSticker(id: string): Promise<void> {
    try {
      const existingStickers = await this.getAllStickers()
      const filteredStickers = existingStickers.filter((s) => s.id !== id)
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredStickers))
    } catch (error) {
      console.error("Error deleting sticker:", error)
      throw error
    }
  }

  static async clearAllStickers(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error("Error clearing stickers:", error)
      throw error
    }
  }
}

import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'react-native';

export interface ImageProcessingOptions {
  targetWidth: number;
  targetHeight: number;
  quality: number;
  format: 'jpeg' | 'png';
}

export class ImageProcessingService {
  static async processImageForModel(
    imageUri: string, 
    options: ImageProcessingOptions = {
      targetWidth: 224,
      targetHeight: 224,
      quality: 0.8,
      format: 'jpeg'
    }
  ): Promise<string> {
    try {
      // Updated for expo-image-manipulator v14.0.7
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: options.targetWidth, height: options.targetHeight } }
        ],
        { 
          compress: options.quality, 
          format: options.format === 'jpeg' ? ImageManipulator.SaveFormat.JPEG : ImageManipulator.SaveFormat.PNG
        }
      );
      
      return manipResult.uri;
    } catch (error) {
      console.error('Image processing failed:', error);
      return imageUri; // Return original if processing fails
    }
  }

  static async getImageInfo(imageUri: string): Promise<{
    width: number;
    height: number;
    size: number;
  }> {
    return new Promise((resolve, reject) => {
      Image.getSize(
        imageUri,
        async (width, height) => {
          try {
            const fileInfo = await FileSystem.getInfoAsync(imageUri);
            
            const fileSize = (fileInfo.exists && !fileInfo.isDirectory && 'size' in fileInfo) 
              ? (fileInfo as any).size || 0 
              : 0;
            
            resolve({ width, height, size: fileSize });
          } catch (error) {
            resolve({ width, height, size: 0 });
          }
        },
        reject
      );
    });
  }

  static validateImage(imageUri: string): boolean {
    if (!imageUri) return false;
    
    const isValidUri = imageUri.startsWith('file://') || 
                      imageUri.startsWith('data:') ||
                      imageUri.startsWith('content://') ||
                      imageUri.startsWith('assets-library://') ||
                      imageUri.startsWith('ph://');
    
    if (!isValidUri) return false;
    
    if (imageUri.includes('.')) {
      const extension = imageUri.toLowerCase().split('.').pop();
      return ['jpg', 'jpeg', 'png', 'heic', 'webp'].includes(extension || '');
    }
    
    return true;
  }
}
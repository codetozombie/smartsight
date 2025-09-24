import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

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
      // For React Native, you might want to use libraries like:
      // - react-native-image-resizer
      // - expo-image-manipulator
      // - react-native-image-processing
      
      // Using expo-image-manipulator (install if not available)
      
      
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: options.targetWidth, height: options.targetHeight } }
        ],
        { 
          compress: options.quality, 
          format: ImageManipulator.SaveFormat.JPEG 
        }
      );
      
      return manipResult.uri;
      
      // For now, return original URI
      return imageUri;
    } catch (error) {
      console.error('Image processing failed:', error);
      throw new Error('Failed to process image');
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
            
            // Fix: Check if file exists and has size property
            let fileSize = 0;
            if (fileInfo.exists && 'size' in fileInfo) {
              fileSize = fileInfo.size;
            }
            
            resolve({
              width,
              height,
              size: fileSize,
            });
          } catch (error) {
            reject(error);
          }
        },
        reject
      );
    });
  }

  static validateImage(imageUri: string): boolean {
    if (!imageUri) return false;
    if (!imageUri.startsWith('file://') && !imageUri.startsWith('data:')) return false;
    
    const extension = imageUri.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png'].includes(extension || '');
  }
}
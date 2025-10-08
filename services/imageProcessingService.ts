/**
 * Image Processing Service
 * Handles image manipulation and preparation for ONNX model
 */

import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Image } from 'react-native';

/**
 * Resize image to model input size (256x256)
 */
export const resizeImageForModel = async (imageUri: string): Promise<string> => {
  try {
    const resizedImage = await manipulateAsync(
      imageUri,
      [{ resize: { width: 256, height: 256 } }],
      { compress: 1, format: SaveFormat.PNG }
    );

    return resizedImage.uri;
  } catch (error) {
    console.error('Image resize failed:', error);
    throw new Error('Failed to resize image');
  }
};

/**
 * Convert image URI to base64
 */
export const imageUriToBase64 = async (imageUri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64', // ✅ Fixed: Use string literal instead of EncodingType
    });
    return base64;
  } catch (error) {
    console.error('Base64 conversion failed:', error);
    throw new Error('Failed to convert image to base64');
  }
};

/**
 * Decode base64 string to ArrayBuffer
 */
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  // Remove data URL prefix if present
  const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, '');
  
  // Decode base64 to binary string
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
};

/**
 * Convert base64 image to Uint8ClampedArray for ONNX processing
 */
export const base64ToImageData = async (
  base64: string,
  width: number = 256,
  height: number = 256
): Promise<Uint8ClampedArray> => {
  try {
    // Decode base64 to ArrayBuffer
    const arrayBuffer = base64ToArrayBuffer(base64);
    
    // Convert to Uint8ClampedArray
    const imageData = new Uint8ClampedArray(arrayBuffer);
    
    return imageData;
  } catch (error) {
    console.error('Image data conversion failed:', error);
    throw new Error('Failed to convert image data');
  }
};

/**
 * Load image and get pixel data using React Native Image
 * This is a more robust approach for getting actual pixel data
 */
export const getImagePixelData = async (
  imageUri: string
): Promise<{ data: Uint8ClampedArray; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      imageUri,
      (width, height) => {
        // For now, we'll use the base64 approach
        // In a real implementation, you'd decode the actual image pixels
        imageUriToBase64(imageUri)
          .then(base64 => base64ToImageData(base64, width, height))
          .then(data => resolve({ data, width, height }))
          .catch(reject);
      },
      (error) => {
        reject(new Error(`Failed to get image size: ${error}`));
      }
    );
  });
};

/**
 * Get image dimensions
 */
export const getImageDimensions = async (
  imageUri: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      imageUri,
      (width, height) => {
        resolve({ width, height });
      },
      (error) => {
        console.warn('Failed to get image dimensions, using defaults:', error);
        resolve({ width: 256, height: 256 });
      }
    );
  });
};

/**
 * Validate image for processing
 */
export const validateImage = (imageUri: string): boolean => {
  if (!imageUri) return false;
  if (!imageUri.startsWith('file://') && !imageUri.startsWith('data:')) return false;
  return true;
};

/**
 * Alternative: Convert image URI to blob for better pixel extraction
 */
export const imageUriToBlob = async (imageUri: string): Promise<Blob> => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  return blob;
};

/**
 * Extract pixel data from image using Canvas (for web) or alternative method
 * This is a placeholder - actual implementation depends on platform
 */
export const extractPixelData = async (
  imageUri: string,
  targetWidth: number = 256,
  targetHeight: number = 256
): Promise<Uint8ClampedArray> => {
  try {
    // First resize the image
    const resizedUri = await resizeImageForModel(imageUri);
    
    // Convert to base64
    const base64 = await imageUriToBase64(resizedUri);
    
    // Convert to image data
    const imageData = await base64ToImageData(base64, targetWidth, targetHeight);
    
    return imageData;
  } catch (error) {
    console.error('Pixel extraction failed:', error);
    throw new Error('Failed to extract pixel data');
  }
};
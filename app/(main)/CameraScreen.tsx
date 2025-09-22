import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/Button';

interface CapturedImage {
  uri: string;
}

const CameraScreen: React.FC = () => {
  const router = useRouter();
  const cameraRef = useRef<Camera>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleCapture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });
        
        setCapturedImage({ uri: photo.uri });
      } catch (error) {
        console.error('Error capturing image:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleUseImage = () => {
    if (capturedImage) {
      router.push({
        pathname: '/(main)/AnalysisScreen',
        params: { imageUri: capturedImage.uri },
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  const toggleCameraType = () => {
    setType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleFlash = () => {
    setFlash(current => 
      current === FlashMode.off ? FlashMode.on : FlashMode.off
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <Button
          title="Go Back"
          onPress={handleBack}
          variant="secondary"
          style={styles.backButton}
        />
      </View>
    );
  }

  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage.uri }} style={styles.previewImage} />
          
          <View style={styles.previewOverlay}>
            <View style={styles.previewHeader}>
              <TouchableOpacity onPress={handleBack} style={styles.backIconButton}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.previewTitle}>Image Captured</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.previewActions}>
              <Button
                title="Retake"
                onPress={handleRetake}
                variant="secondary"
                style={[styles.actionButton, styles.retakeButton]}
              />
              <Button
                title="Use Image"
                onPress={handleUseImage}
                variant="primary"
                style={[styles.actionButton, styles.useImageButton]}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        flashMode={flash}
      >
        {/* Overlay with circular cutout */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.captureArea} />
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Camera</Text>
          
          <TouchableOpacity onPress={toggleFlash} style={styles.headerButton}>
            <Ionicons 
              name={flash === FlashMode.off ? "flash-off" : "flash"} 
              size={24} 
              color="#ffffff" 
            />
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleCameraType} style={styles.controlButton}>
            <Ionicons name="camera-reverse" size={28} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCapture}
            style={[styles.captureButton, isCapturing && styles.capturingButton]}
            disabled={isCapturing}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={styles.placeholder} />
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Position the object within the circle and tap to capture
          </Text>
        </View>
      </Camera>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 20,
  },
  permissionText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: 250,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  captureArea: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: '#06b6d4',
    backgroundColor: 'transparent',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 1,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  capturingButton: {
    opacity: 0.7,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  placeholder: {
    width: 50,
  },
  instructions: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  instructionText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  // Preview styles
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingBottom: 20,
  },
  backIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingBottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  retakeButton: {
    backgroundColor: '#f59e0b',
  },
  useImageButton: {
    backgroundColor: '#10b981',
  },
});

export default CameraScreen;
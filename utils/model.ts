import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import { EyeResult } from '../types';

let session: InferenceSession | null = null;

// Map model output index -> EyeResult
const IDX_TO_RESULT: EyeResult[] = ['healthy', 'monitor', 'critical'];

const softmax = (arr: Float32Array): number[] => {
  const max = Math.max(...arr);
  const exps = arr.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
};

const initSession = async () => {
  if (session) return;
  // Ensure the model exists at assets/models/eye_disease_classifier.onnx
  const model = require('../assets/models/eye_disease_classifier.onnx');
  session = await InferenceSession.create(model);
};

type PreprocessResult = {
  tensor: Tensor;       // float32 [1,3,224,224]
  width: number;
  height: number;
};

// Note: React Native does not expose raw pixel buffers by default.
// This creates a Float32Array placeholder after resizing to 224x224.
// Replace the "createZeroTensor" with real pixel-to-tensor conversion if needed.
const preprocess = async (imageUri: string): Promise<PreprocessResult> => {
  const target = { width: 224, height: 224 };
  await manipulateAsync(
    imageUri,
    [{ resize: target }],
    { compress: 1, format: SaveFormat.PNG, base64: false }
  );

  const createZeroTensor = () => {
    const chw = new Float32Array(3 * 224 * 224);
    // If you implement decoding to RGBA bytes, fill chw as CHW normalized [0..1]
    // for (let i = 0; i < 224 * 224; i++) {
    //   const r = rgba[i*4] / 255, g = rgba[i*4+1]/255, b = rgba[i*4+2]/255;
    //   chw[0*224*224 + i] = r;
    //   chw[1*224*224 + i] = g;
    //   chw[2*224*224 + i] = b;
    // }
    return chw;
  };

  const data = createZeroTensor();
  const tensor = new Tensor('float32', data, [1, 3, 224, 224]);
  return { tensor, width: 224, height: 224 };
};

export const classifyEye = async (imageUri: string): Promise<EyeResult> => {
  await initSession();
  if (!session) throw new Error('ONNX session not initialized');

  const { tensor } = await preprocess(imageUri);

  // Resolve input/output names generically
  const inputName =
    (session as any).inputNames?.[0] ??
    Object.keys((session as any).inputMetadata ?? {})[0] ??
    'input';

  const feeds: Record<string, Tensor> = { [inputName]: tensor };
  const outputMap = await session.run(feeds);

  const outputName =
    (session as any).outputNames?.[0] ?? Object.keys(outputMap)[0];

  const output = outputMap[outputName];
  if (!output || !(output.data instanceof Float32Array)) {
    throw new Error('Invalid model output');
  }

  const probs = softmax(output.data as Float32Array);
  const maxIdx = probs.indexOf(Math.max(...probs));
  return IDX_TO_RESULT[maxIdx] ?? 'monitor';
};
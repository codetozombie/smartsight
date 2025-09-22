import AsyncStorage from '@react-native-async-storage/async-storage';
import { EyeRecord, SavedRecord } from '../types';

const KEYS = {
  RESULTS: 'eye_results',
} as const;

const readJSON = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const getResults = async (): Promise<EyeRecord[]> => {
  return readJSON<EyeRecord[]>(KEYS.RESULTS, []);
};

export const saveResult = async (record: EyeRecord): Promise<void> => {
  const list = await getResults();
  const existingIdx = list.findIndex((r) => r.id === record.id);
  const next =
    existingIdx >= 0
      ? [...list.slice(0, existingIdx), record, ...list.slice(existingIdx + 1)]
      : [record, ...list];
  await AsyncStorage.setItem(KEYS.RESULTS, JSON.stringify(next));
};

export const deleteResult = async (id: string): Promise<void> => {
  const list = await getResults();
  const next = list.filter((r) => r.id !== id);
  await AsyncStorage.setItem(KEYS.RESULTS, JSON.stringify(next));
};

export const clearHistory = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEYS.RESULTS);
};

export const StorageKeys = {
  ONBOARDING_SEEN: 'onboardingSeen',
  SAVED_RECORDS: 'savedRecords',
} as const;

export const getItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return null;
  }
};

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
  }
};

export const getSavedRecords = async (): Promise<SavedRecord[]> => {
  try {
    const recordsJson = await AsyncStorage.getItem(StorageKeys.SAVED_RECORDS);
    return recordsJson ? JSON.parse(recordsJson) : [];
  } catch (error) {
    console.error('Error getting saved records:', error);
    return [];
  }
};

export const saveRecord = async (record: SavedRecord): Promise<void> => {
  try {
    const existingRecords = await getSavedRecords();
    const updatedRecords = [record, ...existingRecords];
    await AsyncStorage.setItem(StorageKeys.SAVED_RECORDS, JSON.stringify(updatedRecords));
  } catch (error) {
    console.error('Error saving record:', error);
    throw new Error('Failed to save record');
  }
};

export const deleteRecord = async (recordId: string): Promise<void> => {
  try {
    const existingRecords = await getSavedRecords();
    const filteredRecords = existingRecords.filter(record => record.id !== recordId);
    await AsyncStorage.setItem(StorageKeys.SAVED_RECORDS, JSON.stringify(filteredRecords));
  } catch (error) {
    console.error('Error deleting record:', error);
    throw new Error('Failed to delete record');
  }
};

export const getRecordById = async (recordId: string): Promise<SavedRecord | null> => {
  try {
    const records = await getSavedRecords();
    return records.find(record => record.id === recordId) || null;
  } catch (error) {
    console.error('Error getting record by ID:', error);
    return null;
  }
};
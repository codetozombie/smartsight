import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedRecord, SavedResult } from './types';

const RESULTS_KEY = 'smartsight_results';
const RECORDS_KEY = 'smartsight_records';

// Helper function to convert storage data to match SavedResult type
const convertToSavedResult = (data: any): SavedResult => {
  return {
    id: data.id,
    timestamp: data.timestamp || data.date,
    imageUri: data.imageUri,
    outcome: data.outcome || data.result,
    confidence: data.confidence || 0,
    analysis: data.analysis,
    date: data.date || data.timestamp,
    result: data.result || data.outcome, // Ensure result property exists
    notes: data.notes,
  };
};

export const saveResult = async (result: SavedResult): Promise<void> => {
  try {
    const existingResults = await getResults();
    const updatedResults = [result, ...existingResults];
    await AsyncStorage.setItem(RESULTS_KEY, JSON.stringify(updatedResults));
  } catch (error) {
    console.error('Failed to save result:', error);
    throw new Error('Failed to save analysis result');
  }
};

export const getResults = async (): Promise<SavedResult[]> => {
  try {
    const resultsJson = await AsyncStorage.getItem(RESULTS_KEY);
    if (!resultsJson) return [];
    
    const results = JSON.parse(resultsJson);
    // Convert all results to match SavedResult type
    return results.map(convertToSavedResult);
  } catch (error) {
    console.error('Failed to load results:', error);
    return [];
  }
};

export const deleteResult = async (resultId: string): Promise<void> => {
  try {
    const existingResults = await getResults();
    const updatedResults = existingResults.filter(result => result.id !== resultId);
    await AsyncStorage.setItem(RESULTS_KEY, JSON.stringify(updatedResults));
  } catch (error) {
    console.error('Failed to delete result:', error);
    throw new Error('Failed to delete analysis result');
  }
};

export const getResultById = async (resultId: string): Promise<SavedResult | null> => {
  try {
    const results = await getResults();
    const result = results.find(r => r.id === resultId);
    return result || null;
  } catch (error) {
    console.error('Failed to get result by ID:', error);
    return null;
  }
};

// Records functions (for backward compatibility)
export const saveRecord = async (record: SavedRecord): Promise<void> => {
  try {
    const existingRecords = await getRecords();
    const updatedRecords = [record, ...existingRecords];
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(updatedRecords));
  } catch (error) {
    console.error('Failed to save record:', error);
    throw new Error('Failed to save analysis record');
  }
};

export const getRecords = async (): Promise<SavedRecord[]> => {
  try {
    const recordsJson = await AsyncStorage.getItem(RECORDS_KEY);
    if (!recordsJson) return [];
    
    return JSON.parse(recordsJson);
  } catch (error) {
    console.error('Failed to load records:', error);
    return [];
  }
};

export const deleteRecord = async (recordId: string): Promise<void> => {
  try {
    const existingRecords = await getRecords();
    const updatedRecords = existingRecords.filter(record => record.id !== recordId);
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(updatedRecords));
  } catch (error) {
    console.error('Failed to delete record:', error);
    throw new Error('Failed to delete analysis record');
  }
};

export const getRecordById = async (recordId: string): Promise<SavedRecord | null> => {
  try {
    const records = await getRecords();
    const record = records.find(r => r.id === recordId);
    return record || null;
  } catch (error) {
    console.error('Failed to get record by ID:', error);
    return null;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([RESULTS_KEY, RECORDS_KEY]);
  } catch (error) {
    console.error('Failed to clear data:', error);
    throw new Error('Failed to clear application data');
  }
};
import { ThrowRecord, AnalysisResult } from '../types';

// Ensure we always have sample data loaded for displaying in the app
// This array will be modified by the app's CRUD operations
export const mockThrowHistory: ThrowRecord[] = [
  {
    id: '1',
    name: 'Backhand Practice #1',
    date: new Date(2025, 7, 14), // August 14, 2025
    videoUri: 'prev_throw_sample.jpg', // Just for reference now
    isFavorite: true,
    analysisResult: {
      hipShoulderSeparationDeg: 28.5,
      reachbackPx: 245,
      elbowPeakMs: 86,
      wristSpeedMps: 9.4,
      tip: 'Great hip-shoulder separation! Try to maintain this form consistently.'
    }
  },
  {
    id: '2',
    name: 'Flick Attempt',
    date: new Date(2025, 7, 12), // August 12, 2025
    videoUri: 'prev_throw_sample.jpg', // Just for reference now
    isFavorite: false,
    analysisResult: {
      hipShoulderSeparationDeg: 15.2,
      reachbackPx: 156,
      elbowPeakMs: 72,
      wristSpeedMps: 7.8,
      tip: 'Try to reach a bit farther back before initiating the pull.'
    }
  },
  {
    id: '3',
    name: 'Forehand Practice',
    date: new Date(2025, 7, 10), // August 10, 2025
    videoUri: 'prev_throw_sample.jpg', // Just for reference now
    isFavorite: true,
    analysisResult: {
      hipShoulderSeparationDeg: 22.7,
      reachbackPx: 210,
      elbowPeakMs: 64,
      wristSpeedMps: 8.5,
      tip: 'Extend the elbow a bit earlier—snap before release.'
    }
  },
  {
    id: '4',
    name: 'Hammer Throw',
    date: new Date(2025, 7, 8), // August 8, 2025
    videoUri: 'prev_throw_sample.jpg', // Just for reference now
    isFavorite: false,
    analysisResult: {
      hipShoulderSeparationDeg: 12.3,
      reachbackPx: 135,
      elbowPeakMs: 58,
      wristSpeedMps: 6.9,
      tip: 'Rotate your hips a touch earlier to improve power transfer.'
    }
  },
  {
    id: '5',
    name: 'Backhand Distance Test',
    date: new Date(2025, 7, 5), // August 5, 2025
    videoUri: 'prev_throw_sample.jpg', // Just for reference now
    isFavorite: false,
    analysisResult: {
      hipShoulderSeparationDeg: 26.1,
      reachbackPx: 230,
      elbowPeakMs: 80,
      wristSpeedMps: 8.9,
      tip: 'Nice throw—focus on a relaxed, full follow‑through.'
    }
  }
];

// Function to get throws sorted with favorites first, then by date
export function getThrowsSorted(): ThrowRecord[] {
  console.log("Getting throws, count:", mockThrowHistory.length);
  
  // Ensure all dates are properly instantiated as Date objects
  mockThrowHistory.forEach(item => {
    if (!(item.date instanceof Date)) {
      console.log(`Converting date for ${item.id}`);
      item.date = new Date(item.date);
    }
  });
  
  // Create a copy of the array to avoid modifying the original
  const sortedThrows = [...mockThrowHistory].sort((a, b) => {
    // First sort by favorite status
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    
    // Then sort by date (newest first)
    return b.date.getTime() - a.date.getTime();
  });
  
  console.log("Sorted throws count:", sortedThrows.length);
  console.log("First throw in list:", sortedThrows.length > 0 ? sortedThrows[0].name : "none");
  return sortedThrows;
}

// For a real app, these would interact with a database
export function toggleFavorite(id: string): void {
  const throwRecord = mockThrowHistory.find(t => t.id === id);
  if (throwRecord) {
    const oldState = throwRecord.isFavorite;
    throwRecord.isFavorite = !throwRecord.isFavorite;
    console.log(`Toggled favorite for throw ${id}: ${oldState} -> ${throwRecord.isFavorite}`);
  } else {
    console.error(`Could not find throw with ID: ${id}`);
  }
}

export function updateThrowName(id: string, newName: string): void {
  const throwRecord = mockThrowHistory.find(t => t.id === id);
  if (throwRecord) {
    throwRecord.name = newName;
  }
}

export function deleteThrow(id: string): void {
  const index = mockThrowHistory.findIndex(t => t.id === id);
  if (index !== -1) {
    mockThrowHistory.splice(index, 1);
  }
}

// Function to add a new throw record
export function addThrow(throwRecord: Omit<ThrowRecord, 'id'>): ThrowRecord {
  // Generate a unique ID
  const id = (mockThrowHistory.length + 1).toString();
  
  const newThrow: ThrowRecord = {
    ...throwRecord,
    id,
  };
  
  // Add to the beginning of the array (most recent first)
  mockThrowHistory.unshift(newThrow);
  
  console.log(`Added new throw: ${newThrow.name} (ID: ${id})`);
  return newThrow;
}

// Function to create a throw record from analysis results
export function createThrowFromAnalysis(
  analysisResult: AnalysisResult, 
  videoUri: string,
  customName?: string
): ThrowRecord {
  const now = new Date();
  const defaultName = `Throw ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  
  const throwData = {
    name: customName || defaultName,
    date: now,
    videoUri,
    isFavorite: false,
    analysisResult,
  };
  
  return addThrow(throwData);
}

// Function to get a specific throw by ID from mockThrowHistory only
export function getThrowById(id: string): ThrowRecord | undefined {
  // Check if id is valid
  if (!id || typeof id !== 'string') {
    console.error(`Invalid ID provided: ${id}, type: ${typeof id}`);
    return undefined;
  }
  
  console.log(`Searching for throw with ID: "${id}" (type: ${typeof id})`);
  
  // Check each entry and log its ID for comparison
  mockThrowHistory.forEach((item, index) => {
    console.log(`Item ${index}: id=${item.id} (${typeof item.id}), name=${item.name}`);
  });
  
  // Find the throw with the matching ID
  const record = mockThrowHistory.find(t => t.id === id);
  console.log(`Search result for ID "${id}": ${record ? `Found: ${record.name}` : 'Not found'}`);
  
  return record;
}

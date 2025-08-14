import { ThrowRecord } from '../types';

// Direct mock data for throws
export const sampleThrows: ThrowRecord[] = [
  {
    id: '1',
    name: 'Backhand Practice #1',
    date: new Date(2025, 7, 14), // August 14, 2025
    videoUri: 'prev_throw_sample.jpg',
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
    videoUri: 'prev_throw_sample.jpg',
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
    videoUri: 'prev_throw_sample.jpg',
    isFavorite: true,
    analysisResult: {
      hipShoulderSeparationDeg: 22.7,
      reachbackPx: 210,
      elbowPeakMs: 64,
      wristSpeedMps: 8.5,
      tip: 'Extend the elbow a bit earlier—snap before release.'
    }
  }
];

export type AnalysisResult = {
  hipShoulderSeparationDeg?: number;
  reachbackPx?: number;
  elbowPeakMs?: number;
  wristSpeedMps?: number;
  tip?: string;
  // add any other fields you return from Flask
};

export type ThrowRecord = {
  id: string;
  name: string;
  date: Date;
  videoUri: string; // In a real app, this would be a URL or local file path
  isFavorite: boolean;
  analysisResult: AnalysisResult;
};

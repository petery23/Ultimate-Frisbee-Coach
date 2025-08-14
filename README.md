# Ultimate Disc Golf Throw Analyzer

A React Native/Expo mobile app that uses computer vision to analyze disc golf throwing technique and provide feedback for improvement.

## Features

### 📱 Mobile App (React Native + Expo)
- **Throw Recording**: Record your disc golf throws with guided setup instructions
- **Throw History**: View and manage your previous throws with favorites
- **Detailed Analysis**: View comprehensive analysis results for each throw
- **User-Friendly UI**: Clean, themed interface with intuitive navigation

### 🔬 Analysis Backend (Python + MediaPipe)
- **Pose Detection**: Uses MediaPipe to extract body landmarks from video
- **Biomechanical Analysis**: Calculates key metrics like:
  - Hip-shoulder separation angle
  - Reachback distance
  - Elbow peak timing
  - Wrist speed at release
- **Smart Coaching Tips**: Provides personalized feedback based on analysis

## Tech Stack

### Frontend
- **React Native** with Expo Router for navigation
- **TypeScript** for type safety
- **Expo AV** for video recording and playback
- **Vector Icons** for UI elements
- **Custom themed components** for consistent styling

### Backend
- **Python Flask** server for video processing
- **MediaPipe** for pose estimation and landmark detection
- **NumPy** for mathematical calculations
- **OpenCV** for video processing

## Project Structure

```
petery-app/
├── app/                          # React Native screens
│   ├── components/              # Reusable UI components
│   ├── throws/                  # Throw history and detail views
│   ├── index.tsx               # Home screen
│   ├── instructions.tsx        # Recording setup guide
│   ├── record.tsx             # Video recording screen
│   └── results.tsx            # Analysis results display
├── components/                  # Global components
│   ├── throws/                 # Throw-specific components
│   └── ui/                     # General UI components
├── lib/                        # Utility functions and data
│   ├── api.ts                 # Backend API communication
│   ├── throwHistory.ts        # Throw data management
│   └── sampleData.ts          # Mock data for development
├── server/                     # Python analysis backend
│   ├── infer_server.py        # Flask server main file
│   ├── analysis.py            # Core analysis algorithms
│   ├── extract_landmarks.py   # MediaPipe pose detection
│   └── features.py            # Feature extraction utilities
├── assets/                     # Images and static files
└── types.ts                   # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Expo CLI (`npm install -g @expo/cli`)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the analysis server
python infer_server.py
```

## Usage

1. **Record a Throw**: Follow the guided setup to position your phone and record your disc golf throw
2. **Analysis**: The app sends your video to the Python backend for biomechanical analysis
3. **Review Results**: View detailed metrics and coaching tips for your technique
4. **Track Progress**: Save throws to your history and mark favorites for comparison

## Analysis Metrics

The app analyzes several key biomechanical factors:

- **Hip-Shoulder Separation**: Measures the rotation differential between hips and shoulders
- **Reachback Distance**: Calculates how far back you reach before initiating the throw
- **Elbow Peak Timing**: Determines when your elbow reaches its peak angle during the throw
- **Wrist Speed**: Measures wrist velocity at the point of release

## Development Status

This is an active development project. Current features include:
- ✅ Video recording with guided setup
- ✅ Python analysis backend with MediaPipe
- ✅ Throw history and management
- ✅ Detailed analysis results display
- ✅ Clean UI with bullet-point instructions

## Contributing

This is a personal project, but feedback and suggestions are welcome! Please open issues for bugs or feature requests.

## License

This project is for educational and personal use.

# server/analysis.py
from __future__ import annotations
from extract_landmarks import extract_keyframes
from features import compute_metrics, coaching_tip

def analyze_video(video_path: str):
    frames = extract_keyframes(video_path, step=2)  # every 2nd frame
    if not frames:
        return {
            "hipShoulderSeparationDeg": None,
            "reachbackPx": None,
            "elbowPeakMs": None,
            "wristSpeedMps": None,
            "tip": "No body landmarks detected. Try better lighting and a full side view."
        }
    m = compute_metrics(frames)
    if m is None:
        return {
            "hipShoulderSeparationDeg": None,
            "reachbackPx": None,
            "elbowPeakMs": None,
            "wristSpeedMps": None,
            "tip": "Clip too short. Record at least ~2–3 seconds."
        }
    m["tip"] = coaching_tip(m)
    return m

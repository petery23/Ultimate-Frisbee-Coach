# server/extract_landmarks.py
from __future__ import annotations
import cv2, math
import numpy as np
from dataclasses import dataclass

@dataclass
class KP:
    x: float; y: float   # pixels

@dataclass
class FrameData:
    t: float             # seconds
    r_shoulder: KP; r_elbow: KP; r_wrist: KP
    l_shoulder: KP; l_hip: KP; r_hip: KP

def _kp(landmarks, idx, w, h):
    lm = landmarks[idx]
    return KP(x=lm.x * w, y=lm.y * h)

def extract_keyframes(video_path: str, step: int = 2) -> list[FrameData]:
    import mediapipe as mp
    mp_pose = mp.solutions.pose

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    w  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h  = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    out: list[FrameData] = []
    with mp_pose.Pose(model_complexity=1, enable_segmentation=False,
                      min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        i = 0
        while True:
            ok, frame = cap.read()
            if not ok: break
            if i % step != 0:
                i += 1; continue
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            res = pose.process(rgb)
            if res.pose_landmarks:
                lm = res.pose_landmarks.landmark
                out.append(FrameData(
                    t=i/fps,
                    r_shoulder=_kp(lm, mp_pose.PoseLandmark.RIGHT_SHOULDER, w, h),
                    r_elbow=_kp(lm, mp_pose.PoseLandmark.RIGHT_ELBOW, w, h),
                    r_wrist=_kp(lm, mp_pose.PoseLandmark.RIGHT_WRIST, w, h),
                    l_shoulder=_kp(lm, mp_pose.PoseLandmark.LEFT_SHOULDER, w, h),
                    l_hip=_kp(lm, mp_pose.PoseLandmark.LEFT_HIP, w, h),
                    r_hip=_kp(lm, mp_pose.PoseLandmark.RIGHT_HIP, w, h),
                ))
            i += 1
    cap.release()
    return out

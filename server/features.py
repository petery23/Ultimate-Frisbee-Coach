# server/features.py
from __future__ import annotations
import numpy as np
from typing import List
from extract_landmarks import FrameData

def angle_deg(vx, vy):
    # angle w.r.t. +x axis in degrees
    return np.degrees(np.arctan2(vy, vx))

def normalize_angle(angle_deg):
    """Normalize angle to be between -180 and 180 degrees"""
    return ((angle_deg + 180) % 360) - 180

def line_angle(p1, p2):
    """Calculate angle between two points with respect to x-axis"""
    return angle_deg(p2.y - p1.y, p2.x - p1.x)

def elbow_angle_deg(s, e, w):
    """
    Calculate the angle at the elbow between shoulder-elbow and elbow-wrist vectors
    s: shoulder point, e: elbow point, w: wrist point
    """
    v1 = np.array([s.x - e.x, s.y - e.y])
    v2 = np.array([w.x - e.x, w.y - e.y])
    
    # Check for zero-length vectors to prevent division by zero
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    
    if norm_v1 < 1e-6 or norm_v2 < 1e-6:
        return 0.0  # Return 0 for degenerate case
    
    # Calculate cosine with robust normalization
    c = np.dot(v1, v2) / (norm_v1 * norm_v2)
    c = np.clip(c, -1.0, 1.0)  # Ensure value is in valid range for arccos
    
    return np.degrees(np.arccos(c))

def finite_diff(y, t):
    """
    Calculate gradient using central difference method where possible,
    and forward/backward difference at boundaries.
    
    Args:
        y: values to differentiate
        t: time points corresponding to values
        
    Returns:
        Gradient array of same size as input
    """
    y = np.asarray(y)
    t = np.asarray(t)
    
    # Check for valid inputs
    if len(y) != len(t):
        raise ValueError("y and t must have the same length")
    if len(y) <= 1:
        return np.zeros_like(y)
    
    # Use numpy's gradient function which handles irregular spacing
    dy = np.gradient(y, t)
    return dy

def detect_release_idx(frames: List[FrameData]):
    """
    Detects the frame index of disc release using wrist speed.
    Uses peak wrist speed as a heuristic for the release point.
    
    Args:
        frames: List of frame data containing joint positions
        
    Returns:
        Index of the frame where release likely occurred
    """
    if not frames:
        return 0
        
    # Extract time and wrist positions
    t = [f.t for f in frames]
    wx = [f.r_wrist.x for f in frames]
    wy = [f.r_wrist.y for f in frames]
    
    # Calculate velocities
    vx = finite_diff(wx, t)
    vy = finite_diff(wy, t)
    
    # Calculate speed (magnitude of velocity)
    speed = np.hypot(vx, vy)
    
    # Apply small smoothing to avoid noise-related false peaks
    if len(speed) > 3:
        speed = np.convolve(speed, [0.25, 0.5, 0.25], mode='same')
    
    # Find the peak speed index
    return int(np.argmax(speed))

def compute_metrics(frames: List[FrameData]):
    if len(frames) < 5:
        return None

    rel = detect_release_idx(frames)

    # Hip–shoulder separation @ release
    torso = line_angle(frames[rel].l_shoulder, frames[rel].r_shoulder)
    pelvis = line_angle(frames[rel].l_hip, frames[rel].r_hip)
    sep = normalize_angle(torso - pelvis)  # Normalize to ensure angle is in [-180, 180]

    # Reachback (max wrist behind shoulder in x BEFORE release)
    pre = frames[:max(1, rel)]
    dx = [f.r_wrist.x - f.r_shoulder.x for f in pre]
    reach_px = abs(min(dx)) if len(dx) else 0.0

    # Elbow timing: when elbow angular velocity peaks (before release)
    t = [f.t for f in frames]
    eang = [elbow_angle_deg(f.r_shoulder, f.r_elbow, f.r_wrist) for f in frames]
    eang_vel = finite_diff(eang, t)
    # consider only before release
    if rel > 3:
        peak_idx = int(np.argmax(np.abs(eang_vel[:rel])))
        elbow_ms = int((t[rel] - t[peak_idx]) * 1000.0)
    else:
        elbow_ms = None

    # Wrist speed @ release (px/s) -> pseudo m/s via rough scale (tunable)
    vx = finite_diff([f.r_wrist.x for f in frames], t)
    vy = finite_diff([f.r_wrist.y for f in frames], t)
    wspeed_px_s = float(np.hypot(vx[rel], vy[rel]))
    meters_per_px = 0.002  # TODO: calibrate; placeholder scale
    wspeed_m_s = wspeed_px_s * meters_per_px

    return {
        "hipShoulderSeparationDeg": float(sep),
        "reachbackPx": float(reach_px),
        "elbowPeakMs": elbow_ms if elbow_ms is not None else None,
        "wristSpeedMps": float(wspeed_m_s),
        "tip": None,  # filled by heuristic below
    }

def coaching_tip(metrics):
    tips = []
    if metrics["hipShoulderSeparationDeg"] is not None and metrics["hipShoulderSeparationDeg"] < 10:
        tips.append("Rotate your hips a touch earlier.")
    if metrics["reachbackPx"] is not None and metrics["reachbackPx"] < 120:
        tips.append("Reach a bit farther back before initiating the pull.")
    if metrics["elbowPeakMs"] is not None and metrics["elbowPeakMs"] < 40:
        tips.append("Extend the elbow a bit earlier—snap before release.")
    return tips[0] if tips else "Nice throw—focus on a relaxed, full follow‑through."

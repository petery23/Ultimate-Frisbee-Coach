#!/usr/bin/env python
"""
Test script for angle calculations in the frisbee throw analysis
"""
import os
import sys
import numpy as np
import matplotlib.pyplot as plt
from dataclasses import dataclass
from extract_landmarks import KP, FrameData
from features import angle_deg, line_angle, elbow_angle_deg, normalize_angle

def test_angle_functions():
    """Test the basic angle calculation functions"""
    print("Testing basic angle functions...")
    
    # Test angle_deg
    assert abs(angle_deg(1, 0) - 0) < 1e-6
    assert abs(angle_deg(0, 1) - 90) < 1e-6
    assert abs(angle_deg(-1, 0) - 180) < 1e-6
    assert abs(angle_deg(0, -1) - (-90)) < 1e-6
    print("✓ angle_deg works correctly")
    
    # Test normalize_angle
    assert abs(normalize_angle(0) - 0) < 1e-6
    assert abs(normalize_angle(180) - 180) < 1e-6
    assert abs(normalize_angle(190) - (-170)) < 1e-6
    assert abs(normalize_angle(360) - 0) < 1e-6
    assert abs(normalize_angle(-190) - 170) < 1e-6
    print("✓ normalize_angle works correctly")
    
    # Test line_angle
    p1 = KP(0, 0)
    p2 = KP(1, 0)  # Horizontal line to the right
    assert abs(line_angle(p1, p2) - 0) < 1e-6
    
    p2 = KP(0, 1)  # Vertical line upward
    assert abs(line_angle(p1, p2) - 90) < 1e-6
    print("✓ line_angle works correctly")
    
    # Test elbow_angle_deg
    shoulder = KP(0, 0)
    elbow = KP(1, 1)
    wrist = KP(2, 0)  # 90 degree angle
    angle = elbow_angle_deg(shoulder, elbow, wrist)
    assert abs(angle - 90) < 1
    print("✓ elbow_angle_deg works correctly")
    
    print("All angle function tests passed!")

def test_hip_shoulder_separation(rel_frame):
    """Test the hip-shoulder separation calculation with visualizations"""
    from features import line_angle, normalize_angle
    
    # Calculate angles
    torso = line_angle(rel_frame.l_shoulder, rel_frame.r_shoulder)
    pelvis = line_angle(rel_frame.l_hip, rel_frame.r_hip)
    sep = normalize_angle(torso - pelvis)
    
    print(f"Torso angle: {torso:.2f}°")
    print(f"Pelvis angle: {pelvis:.2f}°")
    print(f"Hip-shoulder separation: {sep:.2f}°")
    
    # Visualize
    plt.figure(figsize=(10, 6))
    
    # Draw torso
    plt.plot([rel_frame.l_shoulder.x, rel_frame.r_shoulder.x], 
             [rel_frame.l_shoulder.y, rel_frame.r_shoulder.y], 'b-', linewidth=3, label='Torso')
    
    # Draw pelvis
    plt.plot([rel_frame.l_hip.x, rel_frame.r_hip.x], 
             [rel_frame.l_hip.y, rel_frame.r_hip.y], 'r-', linewidth=3, label='Pelvis')
    
    # Draw connecting lines
    plt.plot([rel_frame.l_shoulder.x, rel_frame.l_hip.x], 
             [rel_frame.l_shoulder.y, rel_frame.l_hip.y], 'k--', alpha=0.5)
    plt.plot([rel_frame.r_shoulder.x, rel_frame.r_hip.x], 
             [rel_frame.r_shoulder.y, rel_frame.r_hip.y], 'k--', alpha=0.5)
    
    # Draw points
    plt.scatter([rel_frame.l_shoulder.x, rel_frame.r_shoulder.x, rel_frame.l_hip.x, rel_frame.r_hip.x],
               [rel_frame.l_shoulder.y, rel_frame.r_shoulder.y, rel_frame.l_hip.y, rel_frame.r_hip.y], 
               color=['blue', 'blue', 'red', 'red'], s=100)
    
    plt.legend()
    plt.title(f'Hip-Shoulder Separation: {sep:.2f}°')
    plt.axis('equal')
    plt.grid(True)
    plt.savefig('hip_shoulder_separation.png')
    plt.show()
    
    return sep

def test_with_mock_data():
    """Test angle calculations with mock data"""
    print("Testing with mock data...")
    
    # Create mock frame data representing a throw sequence
    mock_frames = []
    
    # Frame 1: Setup position
    mock_frames.append(FrameData(
        t=0.0,
        r_shoulder=KP(100, 100),
        r_elbow=KP(130, 120),
        r_wrist=KP(160, 130),
        l_shoulder=KP(80, 100),
        l_hip=KP(80, 140),
        r_hip=KP(100, 140)
    ))
    
    # Frame 2: Reachback
    mock_frames.append(FrameData(
        t=0.1,
        r_shoulder=KP(100, 100),
        r_elbow=KP(130, 110),
        r_wrist=KP(160, 90),  # Wrist goes behind
        l_shoulder=KP(80, 100),
        l_hip=KP(80, 140),
        r_hip=KP(100, 140)
    ))
    
    # Frame 3: Start of pull
    mock_frames.append(FrameData(
        t=0.2,
        r_shoulder=KP(100, 100),
        r_elbow=KP(120, 105),
        r_wrist=KP(140, 95),
        l_shoulder=KP(80, 100),
        l_hip=KP(75, 140),  # Hips starting to rotate
        r_hip=KP(105, 140)
    ))
    
    # Frame 4: Acceleration
    mock_frames.append(FrameData(
        t=0.3,
        r_shoulder=KP(100, 100),
        r_elbow=KP(110, 105),
        r_wrist=KP(105, 115),
        l_shoulder=KP(75, 100),  # Shoulders also rotating
        l_hip=KP(65, 140),  # Hips rotating more
        r_hip=KP(110, 140)
    ))
    
    # Frame 5: Release
    mock_frames.append(FrameData(
        t=0.4,
        r_shoulder=KP(95, 100),
        r_elbow=KP(75, 100),
        r_wrist=KP(50, 100),  # Wrist extends forward
        l_shoulder=KP(70, 100),  # Full shoulder rotation
        l_hip=KP(50, 140),  # Full hip rotation
        r_hip=KP(115, 140)
    ))
    
    # Frame 6: Follow through
    mock_frames.append(FrameData(
        t=0.5,
        r_shoulder=KP(90, 100),
        r_elbow=KP(60, 90),
        r_wrist=KP(30, 85),
        l_shoulder=KP(65, 100),
        l_hip=KP(45, 140),
        r_hip=KP(120, 140)
    ))
    
    # Test hip-shoulder separation at frame 5 (release)
    print("\nTesting hip-shoulder separation at release (frame 5):")
    rel_frame = mock_frames[4]
    sep = test_hip_shoulder_separation(rel_frame)
    
    # Test elbow angle
    print("\nTesting elbow angle through the throw:")
    elbow_angles = [elbow_angle_deg(f.r_shoulder, f.r_elbow, f.r_wrist) for f in mock_frames]
    
    plt.figure(figsize=(10, 6))
    plt.plot(range(len(elbow_angles)), elbow_angles, 'o-')
    plt.xlabel('Frame')
    plt.ylabel('Elbow Angle (degrees)')
    plt.title('Elbow Angle Throughout Throw')
    plt.grid(True)
    plt.savefig('elbow_angle.png')
    plt.show()
    
    print(f"Elbow angles: {', '.join([f'{a:.1f}°' for a in elbow_angles])}")
    
    # Test with a real video if provided
    if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
        test_with_real_video(sys.argv[1])

def test_with_real_video(video_path):
    """
    Test angle calculations with a real video
    
    Usage: 
        python test_angles.py path/to/video.mp4
    """
    from extract_landmarks import extract_keyframes
    from features import compute_metrics, detect_release_idx
    
    print(f"\nTesting with real video: {video_path}")
    
    # Extract keyframes
    frames = extract_keyframes(video_path, step=1)  # Use every frame for detailed analysis
    if not frames:
        print("No frames with landmarks detected. Check the video lighting and positioning.")
        return
    
    print(f"Extracted {len(frames)} frames with landmarks")
    
    # Detect release
    rel_idx = detect_release_idx(frames)
    print(f"Detected release at frame {rel_idx} (t={frames[rel_idx].t:.2f}s)")
    
    # Calculate metrics
    metrics = compute_metrics(frames)
    if metrics is None:
        print("Failed to compute metrics - clip may be too short")
        return
    
    print("\nCalculated metrics:")
    for key, value in metrics.items():
        if key != "tip":
            print(f"- {key}: {value}")
    
    # Show hip-shoulder separation at release
    print("\nAnalyzing hip-shoulder separation at release:")
    test_hip_shoulder_separation(frames[rel_idx])
    
    # Show elbow angle over time
    elbow_angles = [elbow_angle_deg(f.r_shoulder, f.r_elbow, f.r_wrist) for f in frames]
    
    plt.figure(figsize=(10, 6))
    plt.plot([f.t for f in frames], elbow_angles, 'o-')
    plt.axvline(x=frames[rel_idx].t, color='r', linestyle='--', label='Release')
    plt.xlabel('Time (s)')
    plt.ylabel('Elbow Angle (degrees)')
    plt.title('Elbow Angle Throughout Throw')
    plt.grid(True)
    plt.legend()
    plt.savefig('elbow_angle_over_time.png')
    plt.show()

if __name__ == "__main__":
    print("==== Angle Calculation Tests ====\n")
    test_angle_functions()
    print("\n==== Mock Data Tests ====")
    test_with_mock_data()

import { useRef, useState } from "react";
import { View, StyleSheet, Alert, Button, Pressable, Text } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { router } from "expo-router";
import { uploadVideo } from "../lib/api";
import FullScreenLoader from "../components/FullScreenLoader";
import { ThemedText } from "./components/ThemedText";
import { ThemedView } from "./components/ThemedView";
import { useThemeColor } from "./hooks/useThemeColor";

export default function RecordScreen() {
  // Move theme-related hooks to the top, before any conditional logic
  const buttonBgColor = useThemeColor({}, 'accent');
  const buttonTextColor = useThemeColor({}, 'background');

  const camRef = useRef<CameraView | null>(null);

  const [camPerm, requestCamPerm] = useCameraPermissions();
  const [micPerm, requestMicPerm] = useMicrophonePermissions();

  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0); // 0 = not counting, 3,2,1 = countdown
  const [countdownInterval, setCountdownInterval] = useState<number | null>(null);

  if (!camPerm || !micPerm) {
    return <ThemedView style={styles.center}><ThemedText>Checking permissions…</ThemedText></ThemedView>;
  }

  if (!camPerm.granted || !micPerm.granted) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText style={{ textAlign: "center", marginBottom: 16 }}>
          We need camera { !micPerm.granted ? "and microphone " : "" }permission to record.
        </ThemedText>
        {!camPerm.granted && <Button onPress={requestCamPerm} title="Grant Camera" />}
        {!micPerm.granted && <View style={{ height: 8 }} />}
        {!micPerm.granted && <Button onPress={requestMicPerm} title="Grant Microphone" />}
      </ThemedView>
    );
  }

  const startRecording = async () => {
    if (!camRef.current) return;
    
    // Start countdown
    setCountdown(3);
    
    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCountdownInterval(null);
          // Start actual recording after countdown
          actuallyStartRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setCountdownInterval(interval);
  };

  const actuallyStartRecording = async () => {
    if (!camRef.current) return;
    try {
      setIsRecording(true);
      const video = await camRef.current.recordAsync({ maxDuration: 4 });
      setIsRecording(false);
      setIsLoading(true);

      try {
        const metrics = await uploadVideo((video as any).uri);
        const data = encodeURIComponent(JSON.stringify(metrics));
        router.push({ pathname: "/results", params: { data } });
      } catch (e: any) {
        Alert.alert("Upload Failed", e.message ?? String(e));
      } finally {
        setIsLoading(false);
      }
    } catch (e: any) {
      setIsRecording(false);
      Alert.alert("Recording Error", e.message ?? String(e));
    }
  };

  const cancelRecording = () => {
    // Clear countdown timer if running
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }
    
    // Stop recording if in progress
    if (camRef.current && isRecording) {
      camRef.current.stopRecording();
    }
    
    // Reset all states back to initial
    setCountdown(0);
    setIsRecording(false);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <CameraView
        ref={camRef}
        style={{ flex: 1 }}
        facing="back"
        mode="video"
        videoQuality="1080p"
      >
        {/* Centered countdown overlay */}
        {countdown > 0 && (
          <View style={styles.centerCountdown}>
            <View style={styles.countdownBackground}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          </View>
        )}
        
        {/* Bottom controls */}
        <View style={styles.overlay}>
          <ThemedText style={styles.hint}>Side view • chest height • 4–6m away</ThemedText>
          
          {countdown === 0 && !isRecording ? (
            <Pressable
              onPress={startRecording}
              style={[styles.recBtn, { backgroundColor: buttonBgColor }]}
            >
              <ThemedText style={{ color: buttonTextColor, fontWeight: '600' }}>
                Start 4s recording
              </ThemedText>
            </Pressable>
          ) : (countdown > 0 || isRecording) ? (
            <Pressable
              onPress={cancelRecording}
              style={[styles.recBtn, styles.cancelBtn]}
            >
              <ThemedText style={{ color: '#fff', fontWeight: '600' }}>
                Cancel
              </ThemedText>
            </Pressable>
          ) : null}
        </View>
      </CameraView>
      {isLoading && <FullScreenLoader />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  overlay: { position: "absolute", bottom: 32, left: 0, right: 0, alignItems: "center", gap: 8 },
  hint: { color: "#fff", backgroundColor: "#0009", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 8 },
  recBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, overflow: "hidden", alignItems: "center" },
  recordingButtons: { 
    flexDirection: "row", 
    gap: 12,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#666",
  },
  centerCountdown: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    elevation: 1000,
  },
  countdownBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  countdownText: {
    fontSize: 120,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
  },
});
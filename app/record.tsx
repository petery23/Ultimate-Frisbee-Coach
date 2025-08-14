import { useRef, useState } from "react";
import { View, StyleSheet, Alert, Button, Pressable } from "react-native";
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
    try {
      setIsRecording(true);
      const video = await camRef.current.recordAsync({ maxDuration: 4 });
      setIsRecording(false);
      setIsLoading(true);

      try {
        const metrics = await uploadVideo((video as any).uri);
        const data = encodeURIComponent(JSON.stringify(metrics));
        router.replace({ pathname: "/results", params: { data } });
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

  const stopRecording = () => {
    if (camRef.current && isRecording) camRef.current.stopRecording();
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
        <View style={styles.overlay}>
          <ThemedText style={styles.hint}>Side view • chest height • 4–6m away</ThemedText>
          <Pressable
            onPress={isRecording ? stopRecording : startRecording}
            style={[styles.recBtn, { backgroundColor: buttonBgColor }]}
          >
            <ThemedText style={{ color: buttonTextColor, fontWeight: '600' }}>
              {isRecording ? "Stop" : "Start 4s recording"}
            </ThemedText>
          </Pressable>
          
          {/* Go back button */}
          {!isRecording && (
            <View style={{marginTop: 16}}>
              <Pressable
                onPress={() => router.replace('/instructions')}
                style={[styles.backBtn]}
              >
                <ThemedText style={{ color: '#FFF', fontWeight: '500' }}>
                  Go Back to Instructions
                </ThemedText>
              </Pressable>
            </View>
          )}
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
  backBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, overflow: "hidden", alignItems: "center", backgroundColor: "#0009" },
});

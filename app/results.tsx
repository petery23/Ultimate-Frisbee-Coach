import { useLocalSearchParams, Link } from "expo-router";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import type { AnalysisResult } from "../types";
import PrimaryButton from "../components/PrimaryButton";

export default function Results() {
  const params = useLocalSearchParams<{ data?: string }>();
  let result: AnalysisResult | null = null;

  try {
    if (params?.data) {
      result = JSON.parse(decodeURIComponent(params.data)) as AnalysisResult;
    }
  } catch (e) {
    // If parse fails, keep result null
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Throw Analysis</Text>

      {!result && <Text style={styles.dim}>No result payload. Try recording again.</Text>}

      {result && (
        <View style={styles.card}>
          {/* Example fields — adjust to your server's JSON */}
          <Row label="Hip–Shoulder Sep." value={`${result.hipShoulderSeparationDeg?.toFixed?.(1) ?? "—"}°`} />
          <Row label="Reachback" value={`${result.reachbackPx?.toFixed?.(0) ?? "—"} px`} />
          <Row label="Elbow Peak Time" value={`${result.elbowPeakMs ?? "—"} ms`} />
          <Row label="Wrist Speed" value={`${result.wristSpeedMps?.toFixed?.(2) ?? "—"} m/s`} />
          <View style={{ height: 12 }} />
          <Text style={styles.tipTitle}>Coach Tip</Text>
          <Text style={styles.tip}>{result.tip ?? "—"}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Link href="/" replace asChild>
          <PrimaryButton label="Back to Home" />
        </Link>
      </View>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, gap: 8, elevation: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  rowLabel: { color: "#444" },
  rowValue: { fontWeight: "600" },
  tipTitle: { fontWeight: "700", marginTop: 4 },
  tip: { color: "#333" },
  dim: { color: "#666" },
  buttonContainer: {
    marginTop: 16, 
    alignItems: 'center',
    width: 'auto',
    maxWidth: 220,
    alignSelf: 'center',
  },
});

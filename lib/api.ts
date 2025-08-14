import type { AnalysisResult } from "../types";

// Set this to your computer's LAN IP running Flask, e.g., http://192.168.1.12:5000
const API_BASE = "http://127.0.0.1:5000";

interface ReactNativeFile {
  uri: string;
  name: string;
  type: string;
}

async function uploadVideo(uri: string): Promise<AnalysisResult> {
  const file: ReactNativeFile = { uri, name: "throw.mp4", type: "video/mp4" };
  const form = new FormData();
  // RN needs the object to be castable to Blob for TS; at runtime RN handles it.
  form.append("file", file as unknown as Blob);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Server error ${res.status}${text ? `: ${text}` : ""}`);
  }
  return (await res.json()) as AnalysisResult;
}

const api = {
  API_BASE,
  uploadVideo
};

export default api;
export { uploadVideo, API_BASE };

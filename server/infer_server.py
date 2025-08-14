# server/infer_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile, os
from analysis import analyze_video

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    f = request.files.get("file")
    if not f:
        return jsonify({"error": "no file"}), 400
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    try:
        f.save(tmp.name)
        result = analyze_video(tmp.name)
        return jsonify(result)
    finally:
        try: os.remove(tmp.name)
        except Exception: pass

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

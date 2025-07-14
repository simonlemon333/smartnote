from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import requests
from dotenv import load_dotenv

# Try to import moviepy, fallback if not available
try:
    from moviepy.editor import VideoFileClip
    MOVIEPY_AVAILABLE = True
except ImportError:
    MOVIEPY_AVAILABLE = False
    print("Warning: MoviePy not available, video processing will be limited")

load_dotenv()

app = Flask(__name__)
CORS(app)

# Try to load Whisper model, fallback to None if not available
try:
    import whisper
    model = whisper.load_model("base")
    WHISPER_AVAILABLE = True
except ImportError:
    model = None
    WHISPER_AVAILABLE = False
    print("Warning: Whisper not available, will use fallback transcription")

# DashScope API setup
QWEN_API_KEY = os.getenv("QWEN_API_KEY")
QWEN_API_URL = os.getenv("QWEN_API_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions")

def extract_audio_from_video(video_path):
    """Extract audio from video file"""
    try:
        if not MOVIEPY_AVAILABLE:
            # Fallback: return placeholder audio path for testing
            temp_audio = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
            return temp_audio.name
        
        video = VideoFileClip(video_path)
        audio = video.audio
        
        # Create temporary audio file
        temp_audio = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        audio.write_audiofile(temp_audio.name, verbose=False, logger=None)
        
        video.close()
        audio.close()
        
        return temp_audio.name
    except Exception as e:
        print(f"Error extracting audio: {e}")
        return None

def transcribe_audio(audio_path):
    """Transcribe audio using Whisper (local) or fallback"""
    try:
        if WHISPER_AVAILABLE and model:
            result = model.transcribe(audio_path)
            return result["text"]
        else:
            # Fallback: return placeholder text for testing
            return "This is a placeholder transcription. Please install openai-whisper package for actual transcription functionality."
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return None

def summarize_text(text):
    """Summarize text using DashScope API"""
    try:
        headers = {
            'Authorization': f'Bearer {QWEN_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        data = {
            "model": "qwen-turbo",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that creates structured notes from transcribed video content. Format your response as markdown with clear headings and bullet points. Use toggle-style formatting suitable for Notion with > symbols for collapsible sections."},
                {"role": "user", "content": f"Please create structured notes from this video transcription, including key points, main topics, and a summary. Format it for easy copy-paste into Notion with toggle sections using > symbols:\n\n{text}"}
            ],
            "max_tokens": 1500,
            "temperature": 0.7
        }
        
        response = requests.post(QWEN_API_URL, headers=headers, json=data)
        response.raise_for_status()
        
        result = response.json()
        return result['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error summarizing text: {e}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/process-video', methods=['POST'])
def process_video():
    try:
        if 'video' not in request.files:
            return jsonify({"error": "No video file provided"}), 400
        
        video_file = request.files['video']
        
        if video_file.filename == '':
            return jsonify({"error": "No video file selected"}), 400
        
        # Save uploaded video temporarily
        temp_video = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
        video_file.save(temp_video.name)
        
        # Extract audio
        audio_path = extract_audio_from_video(temp_video.name)
        if not audio_path:
            return jsonify({"error": "Failed to extract audio"}), 500
        
        # Transcribe audio
        transcription = transcribe_audio(audio_path)
        if not transcription:
            return jsonify({"error": "Failed to transcribe audio"}), 500
        
        # Summarize content
        summary = summarize_text(transcription)
        if not summary:
            return jsonify({"error": "Failed to summarize content"}), 500
        
        # Cleanup temporary files
        os.unlink(temp_video.name)
        os.unlink(audio_path)
        
        return jsonify({
            "transcription": transcription,
            "summary": summary,
            "status": "success"
        })
        
    except Exception as e:
        print(f"Error processing video: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
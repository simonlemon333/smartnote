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

# Try to load faster-whisper model, fallback to None if not available
try:
    from faster_whisper import WhisperModel
    model = WhisperModel("base", device="cpu", compute_type="int8")
    WHISPER_AVAILABLE = True
except ImportError:
    model = None
    WHISPER_AVAILABLE = False
    print("Warning: faster-whisper not available, will use fallback transcription")

# DashScope API setup
QWEN_API_KEY = os.getenv("QWEN_API_KEY")
QWEN_API_URL = os.getenv("QWEN_API_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions")

def extract_audio_from_video(video_path):
    """Extract audio from video file"""
    try:
        print("[PROGRESS] Starting audio extraction from video...")
        if not MOVIEPY_AVAILABLE:
            # Fallback: return placeholder audio path for testing
            temp_audio = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
            return temp_audio.name
        
        video = VideoFileClip(video_path)
        audio = video.audio
        
        # Create temporary audio file
        temp_audio = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
        print(f"[PROGRESS] Extracting audio to {temp_audio.name}...")
        audio.write_audiofile(temp_audio.name, verbose=False, logger=None)
        
        video.close()
        audio.close()
        
        print("[PROGRESS] Audio extraction completed!")
        return temp_audio.name
    except Exception as e:
        print(f"[ERROR] Error extracting audio: {e}")
        return None

def transcribe_audio(audio_path):
    """Transcribe audio using faster-whisper (local) or fallback"""
    try:
        print("[PROGRESS] Starting audio transcription with Whisper...")
        if WHISPER_AVAILABLE and model:
            segments, info = model.transcribe(audio_path, language=None)  # Auto-detect language
            print(f"[PROGRESS] Detected language: {info.language} (probability: {info.language_probability:.2f})")
            print("[PROGRESS] Processing transcription segments...")
            # Combine all segments into full text
            transcription = " ".join([segment.text for segment in segments])
            print(f"[PROGRESS] Transcription completed! Total length: {len(transcription)} characters")
            return transcription, info.language  # Return both transcription and detected language
        else:
            # Fallback: return placeholder text for testing
            return "This is a placeholder transcription. Please install faster-whisper package for actual transcription functionality.", "en"
    except Exception as e:
        print(f"[ERROR] Error transcribing audio: {e}")
        return None, None

def summarize_text(text, language='en'):
    """Summarize text using DashScope API"""
    try:
        print("[PROGRESS] Starting AI summarization...")
        headers = {
            'Authorization': f'Bearer {QWEN_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Language-specific prompts
        language_instructions = {
            'zh': '请用中文创建详细的结构化笔记。',
            'en': 'Create detailed structured notes in English.',
            'ja': '日本語で詳細な構造化ノートを作成してください。',
            'ko': '한국어로 상세한 구조화된 노트를 작성해주세요.',
            'es': 'Crea notas estructuradas detalladas en español.',
            'fr': 'Créez des notes structurées détaillées en français.',
            'de': 'Erstellen Sie detaillierte strukturierte Notizen auf Deutsch.',
        }
        
        lang_instruction = language_instructions.get(language, 'Create detailed structured notes in the same language as the transcription.')
        
        # Better prompt for long videos with proper Notion toggle format
        system_prompt = f"""You are an expert note-taker that creates comprehensive structured notes from video transcriptions. 
        
IMPORTANT: {lang_instruction} Use the SAME language as the transcription content.
        
For Notion toggle format, use this exact syntax:
        - Main headings: ## Title
        - Toggle sections: ### > Section Title
        - Sub-toggles: #### > Sub-section Title
        - Bullet points: - Point content
        - Important items: **Bold text**
        
Create detailed, well-organized notes that capture all key information from long videos."""
        
        user_prompt = f"""Create comprehensive structured notes from this video transcription. This is a long video, so please:
        
        1. Create detailed sections with multiple toggle levels
        2. Include specific examples and details mentioned
        3. Use proper Notion toggle format with > symbols
        4. Organize into logical themes and topics
        5. Include a comprehensive summary at the end
        6. IMPORTANT: Write the notes in the SAME language as the transcription content
        
        Format requirements:
        - Use ## for main headings
        - Use ### > for toggle sections 
        - Use #### > for sub-toggle sections
        - Use - for bullet points
        - Use **bold** for important terms
        
        Detected language: {language}
        
        Transcription:
        {text}"""
        
        data = {
            "model": "qwen-turbo",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "max_tokens": 3000,
            "temperature": 0.3
        }
        
        response = requests.post(QWEN_API_URL, headers=headers, json=data)
        response.raise_for_status()
        
        result = response.json()
        print("[PROGRESS] AI summarization completed!")
        return result['choices'][0]['message']['content']
    except Exception as e:
        print(f"[ERROR] Error summarizing text: {e}")
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
        transcription_result = transcribe_audio(audio_path)
        if not transcription_result or not transcription_result[0]:
            return jsonify({"error": "Failed to transcribe audio"}), 500
        
        transcription, detected_language = transcription_result
        print(f"[PROGRESS] Using detected language: {detected_language} for summarization")
        
        # Summarize content with detected language
        summary = summarize_text(transcription, detected_language)
        if not summary:
            return jsonify({"error": "Failed to summarize content"}), 500
        
        # Cleanup temporary files
        os.unlink(temp_video.name)
        os.unlink(audio_path)
        
        print("[PROGRESS] Video processing completed successfully!")
        return jsonify({
            "transcription": transcription,
            "summary": summary,
            "formatted_notes": summary,
            "status": "success"
        })
        
    except Exception as e:
        print(f"[ERROR] Error processing video: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/process-transcript', methods=['POST'])
def process_transcript():
    """Process transcript directly without video upload"""
    try:
        data = request.get_json()
        if not data or 'transcript' not in data:
            return jsonify({"error": "No transcript provided"}), 400
        
        transcript = data['transcript']
        if not transcript.strip():
            return jsonify({"error": "Empty transcript provided"}), 400
        
        print("[PROGRESS] Processing transcript directly...")
        
        # Summarize content
        summary = summarize_text(transcript)
        if not summary:
            return jsonify({"error": "Failed to summarize transcript"}), 500
        
        print("[PROGRESS] Transcript processing completed successfully!")
        return jsonify({
            "transcription": transcript,
            "summary": summary,
            "formatted_notes": summary,
            "status": "success"
        })
        
    except Exception as e:
        print(f"[ERROR] Error processing transcript: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
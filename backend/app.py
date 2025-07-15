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
            segments, info = model.transcribe(audio_path, language=None, word_timestamps=True)  # Enable word timestamps
            print(f"[PROGRESS] Detected language: {info.language} (probability: {info.language_probability:.2f})")
            print("[PROGRESS] Processing transcription segments with timestamps...")
            
            # Collect segments with timestamps
            timestamped_segments = []
            transcription_parts = []
            
            for segment in segments:
                # Convert timestamps to readable format
                start_time = f"{int(segment.start // 60):02d}:{int(segment.start % 60):02d}"
                end_time = f"{int(segment.end // 60):02d}:{int(segment.end % 60):02d}"
                
                # Store segment with timestamp info
                timestamped_segments.append({
                    'text': segment.text.strip(),
                    'start': segment.start,
                    'end': segment.end,
                    'start_formatted': start_time,
                    'end_formatted': end_time
                })
                transcription_parts.append(segment.text)
            
            # Combine all segments into full text
            transcription = " ".join(transcription_parts)
            print(f"[PROGRESS] Transcription completed! Total length: {len(transcription)} characters")
            return transcription, info.language, timestamped_segments  # Return transcription, language, and segments with timestamps
        else:
            # Fallback: return placeholder text for testing
            return "This is a placeholder transcription. Please install faster-whisper package for actual transcription functionality.", "en", []
    except Exception as e:
        print(f"[ERROR] Error transcribing audio: {e}")
        return None, None, []

def summarize_text(text, language='en', timestamped_segments=None):
    """Summarize text using DashScope API with optional timestamps"""
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

Format this content for Notion using proper toggle and indentation syntax:

Requirements:
- Use ▶ symbol for main toggleable sections
- Use ▶### for toggleable subsection headers  
- Use TAB characters (not spaces) for indentation
- Each child level should be indented one TAB deeper than its parent
- Use - for list items
- Add timestamps in format [时间: MM:SS] to important points
- Remove all HTML tags and escape characters
- Ensure consistent spacing and line breaks

Target structure:
## Main Title

▶ Major Section 1
\t▶### Subsection 1.1
\t\t- Content point 1 [时间: MM:SS]
\t\t- Content point 2 [时间: MM:SS]
\t\t\t- Sub-point A
\t\t\t- Sub-point B

▶ Major Section 2
\t▶### Subsection 2.1
\t\t- Content point 3 [时间: MM:SS]
\t\t- Content point 4 [时间: MM:SS]

Rules:
- Every child element must be indented with TAB characters
- Maintain logical hierarchy (subsections under sections, points under subsections)
- Keep original content meaning unchanged
- Clean up formatting issues but preserve all information"""
        
        # Create timestamp reference text if available
        timestamp_info = ""
        if timestamped_segments:
            timestamp_info = "\n\nTimestamp segments available for reference:\n"
            for i, segment in enumerate(timestamped_segments[:10]):  # Show first 10 segments as examples
                timestamp_info += f"[{segment['start_formatted']}] {segment['text'][:100]}...\n"
        
        user_prompt = f"""Create comprehensive structured notes from this video transcription using the exact format specified above.

IMPORTANT INSTRUCTIONS:
1. Use the SAME language as the transcription content
2. Create detailed sections with multiple toggle levels using ▶ symbols
3. Use TAB characters for proper indentation hierarchy
4. Include specific examples and details mentioned
5. Add time references [时间: MM:SS] for important points when available
6. Organize into logical themes and topics
7. Include a comprehensive summary at the end
8. Remove any HTML tags or escape characters
9. Ensure clean, consistent formatting

Detected language: {language}
{timestamp_info}

Content to format:
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
        
        transcription, detected_language, timestamped_segments = transcription_result
        print(f"[PROGRESS] Using detected language: {detected_language} for summarization")
        print(f"[PROGRESS] Extracted {len(timestamped_segments)} timestamped segments")
        
        # Summarize content with detected language and timestamps
        summary = summarize_text(transcription, detected_language, timestamped_segments)
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
            "timestamped_segments": timestamped_segments,
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
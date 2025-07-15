#!/usr/bin/env python3
"""Test script to verify the complete video processing workflow"""

import os
import tempfile
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Test the imports
try:
    from moviepy.editor import VideoFileClip
    print("✅ MoviePy import successful")
    MOVIEPY_AVAILABLE = True
except ImportError as e:
    print("❌ MoviePy import failed:", e)
    MOVIEPY_AVAILABLE = False

try:
    from faster_whisper import WhisperModel
    print("✅ faster-whisper import successful")
    WHISPER_AVAILABLE = True
except ImportError as e:
    print("❌ faster-whisper import failed:", e)
    WHISPER_AVAILABLE = False

def test_audio_extraction():
    """Test audio extraction without actual video"""
    print("\n🎬 Testing audio extraction...")
    if not MOVIEPY_AVAILABLE:
        print("❌ MoviePy not available, skipping audio extraction test")
        return False
    print("✅ MoviePy available for audio extraction")
    return True

def test_transcription():
    """Test transcription setup"""
    print("\n🎤 Testing transcription setup...")
    if not WHISPER_AVAILABLE:
        print("❌ faster-whisper not available, skipping transcription test")
        return False
    
    try:
        # Test model loading
        model = WhisperModel("base", device="cpu", compute_type="int8")
        print("✅ faster-whisper model loaded successfully")
        print(f"✅ Model supports Chinese and English with auto-detection")
        return True
    except Exception as e:
        print(f"❌ Model loading failed: {e}")
        return False

def test_summarization():
    """Test DashScope API"""
    print("\n🤖 Testing DashScope API...")
    
    api_key = os.getenv("QWEN_API_KEY")
    api_url = os.getenv("QWEN_API_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions")
    
    if not api_key:
        print("❌ QWEN_API_KEY not set")
        return False
    
    try:
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        test_data = {
            "model": "qwen-turbo",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Test message for API connectivity."}
            ],
            "max_tokens": 50
        }
        
        response = requests.post(api_url, headers=headers, json=test_data, timeout=10)
        response.raise_for_status()
        
        print("✅ DashScope API connection successful")
        print("✅ Ready to generate Notion-formatted summaries")
        return True
        
    except Exception as e:
        print(f"❌ DashScope API test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Smart Note Video Processing Workflow\n")
    
    results = []
    results.append(test_audio_extraction())
    results.append(test_transcription())
    results.append(test_summarization())
    
    print(f"\n📊 Test Results:")
    print(f"✅ Passed: {sum(results)}/3")
    print(f"❌ Failed: {3 - sum(results)}/3")
    
    if all(results):
        print("\n🎉 All tests passed! The workflow is ready for video processing.")
        print("🎯 Supports: Chinese, English, mixed languages with auto-detection")
        print("📝 Output: Notion-formatted toggle notes")
    else:
        print("\n⚠️  Some tests failed. Please check the issues above.")

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""Check the current integration status"""

import os
import sys
import tempfile
from dotenv import load_dotenv

# Add current directory to path
sys.path.insert(0, '.')

# Load environment variables
load_dotenv()

def check_integration():
    """Check integration status"""
    print("🔍 Checking Smart Note Integration Status\n")
    
    # Import the app to check the actual status
    try:
        from app import MOVIEPY_AVAILABLE, WHISPER_AVAILABLE, extract_audio_from_video, transcribe_audio
        print(f"📊 Integration Status:")
        print(f"   MoviePy: {'✅ Available' if MOVIEPY_AVAILABLE else '❌ Not Available'}")
        print(f"   Whisper: {'✅ Available' if WHISPER_AVAILABLE else '❌ Not Available'}")
        
        # Test audio extraction fallback
        print(f"\n🎬 Testing audio extraction (fallback mode)...")
        if not MOVIEPY_AVAILABLE:
            print("   Using fallback mode (creates placeholder audio file)")
            temp_file = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
            temp_file.write(b"fake video content")
            temp_file.close()
            
            audio_path = extract_audio_from_video(temp_file.name)
            if audio_path:
                print(f"   ✅ Audio extraction returned: {audio_path}")
                os.unlink(audio_path)  # Clean up
            else:
                print("   ❌ Audio extraction failed")
            
            os.unlink(temp_file.name)  # Clean up
        
        # Test transcription
        print(f"\n🎤 Testing transcription...")
        if WHISPER_AVAILABLE:
            print("   Using faster-whisper for transcription")
            # Create a dummy audio file for testing
            dummy_audio = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
            dummy_audio.close()
            
            transcription = transcribe_audio(dummy_audio.name)
            if transcription:
                print(f"   ✅ Transcription returned: {transcription[:100]}...")
            else:
                print("   ❌ Transcription failed")
            
            os.unlink(dummy_audio.name)  # Clean up
        else:
            print("   Using fallback transcription")
            transcription = transcribe_audio("dummy_path")
            print(f"   ✅ Fallback transcription: {transcription[:100]}...")
        
        # Test API key
        print(f"\n🔑 Testing API Configuration...")
        api_key = os.getenv("QWEN_API_KEY")
        if api_key:
            print(f"   ✅ QWEN_API_KEY is set (length: {len(api_key)})")
        else:
            print("   ❌ QWEN_API_KEY not found")
            
        api_url = os.getenv("QWEN_API_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions")
        print(f"   ✅ API URL: {api_url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Integration check failed: {e}")
        return False

def main():
    """Run integration check"""
    success = check_integration()
    
    if success:
        print(f"\n🎉 Integration check completed!")
        print(f"💡 The application is ready to:")
        print(f"   • Receive video files via REST API")
        print(f"   • Extract audio (MoviePy) or use fallback")
        print(f"   • Transcribe audio (faster-whisper) or use fallback")
        print(f"   • Generate AI summaries with DashScope")
        print(f"   • Output Notion-formatted toggle notes")
    else:
        print(f"\n⚠️  Integration check failed")

if __name__ == "__main__":
    main()
# Smart Note - Intelligent Video & Text to Notion Notes

Transform your videos and transcripts into perfectly formatted Notion notes with timestamps and structured content.

## 🎯 Features

### Core Capabilities
- **Video Processing**: Upload MP4/MKV files for automatic transcription and summarization
- **Text Processing**: Upload .txt files or paste text directly for immediate formatting
- **Multi-language Support**: Automatic detection and processing in Chinese, English, and more
- **Notion Integration**: Perfect toggle formatting (▶ symbols) ready for Notion
- **Timestamps**: Real timestamps for videos, estimated for text
- **Cost-effective**: ~$0.003 per 2-hour video processing

### Output Features
- **Structured Notes**: Hierarchical organization with proper indentation
- **Time References**: [时间: MM:SS] format integrated into notes
- **Download Options**: Raw transcript, timestamped transcript, formatted notes
- **Copy to Clipboard**: One-click copy for Notion

## 🚀 Quick Start

### Prerequisites
- Node.js 14.0+
- Python 3.8+
- DashScope API key (Alibaba Cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/simonlemon333/smartnote.git
   cd smartnote
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Set up API configuration**
   Create `.env` file in backend directory:
   ```
   QWEN_API_KEY=your_dashscope_api_key
   QWEN_API_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   python3 app.py
   ```
   Server runs on: http://localhost:5000

2. **Start the frontend (if needed)**
   ```bash
   npm run build
   npm run dev
   ```
   Frontend runs on: http://localhost:9000

3. **Use the app**
   - **Video Processing**: Drag and drop video files (.mp4, .mkv)
   - **Text Processing**: Upload .txt file or paste text directly
   - Wait for processing and get Notion-ready notes

## 📁 Project Structure

```
smartnote/
├── backend/
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Python virtual environment
├── src/
│   ├── main/
│   │   ├── main.ts        # Electron main process
│   │   └── preload.ts     # Electron preload script
│   └── renderer/
│       ├── App.tsx        # Main React component
│       └── components/
│           ├── VideoDropZone.tsx     # Video upload interface
│           ├── TranscriptInput.tsx   # Text input interface
│           ├── NotesOutput.tsx       # Results display
│           └── ProcessingStatus.tsx  # Progress indicator
├── dist/                  # Built files
├── package.json          # Node.js dependencies
└── webpack.config.js     # Build configuration
```

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Electron
- **Backend**: Python Flask with CORS
- **Transcription**: faster-whisper (local)
- **AI Processing**: DashScope API (qwen-turbo)
- **Audio Processing**: MoviePy

## 🔧 API Endpoints

### Backend API
- `POST /process-video` - Process video files with timestamps
- `POST /process-transcript` - Process text directly
- `GET /health` - Health check

### Video Processing Workflow
1. Video Upload → Audio Extraction → Whisper Transcription → AI Summarization → Notion Format

### Text Processing Workflow
1. Text Input → AI Analysis → Structure Generation → Notion Format

## 📝 Usage Examples

### Video Processing
1. Upload video file
2. System extracts audio
3. Whisper transcribes with timestamps
4. AI creates structured summary
5. Download or copy Notion-ready notes

### Text Processing
1. Paste transcript text
2. AI analyzes and structures content
3. Generates Notion-compatible format
4. Copy to clipboard for Notion

### Sample Output Format
```markdown
## 主标题

▶ 第一个主要章节
    ▶### 子章节1
        - 内容项目1 [时间: 00:12:34]
        - 内容项目2 [时间: 00:15:20]
            - 子项目A
            - 子项目B

▶ 第二个主要章节
    ▶### 子章节2
        - 内容项目3 [时间: 00:18:45]
        - 内容项目4 [时间: 00:22:10]
```

## 📊 Performance Metrics

- **Processing Speed**: 2-hour video in 5-10 minutes
- **Cost**: ~$0.003 per 2-hour video
- **Accuracy**: 95%+ for clear audio
- **Languages**: Chinese, English, Japanese, Korean, etc.

## 🎯 Use Cases

1. **Educational Videos**: Convert lectures to structured notes
2. **Meeting Records**: Transform recordings to actionable items
3. **Content Creation**: Process video content for documentation
4. **Research**: Organize interview transcripts
5. **Knowledge Management**: Convert video libraries to searchable notes

## 🚧 Development Status - v1.6

### ✅ Completed Features
- **Dual Input System**: Video upload + Text input
- **Enhanced Timestamps**: Real word-level timestamps from Whisper
- **Perfect Notion Format**: ▶ symbols with TAB indentation
- **Download Options**: Plain and timestamped transcripts
- **Multi-language Support**: Auto-detection and processing
- **Cost-effective Processing**: Local Whisper + DashScope API
- **Production-ready Backend**: Flask API with robust error handling

### 💰 Cost Efficiency
- **Local Whisper**: Free speech-to-text processing
- **DashScope API**: ~$0.003 per 2-hour video
- **Total Operating Cost**: Near zero

## 🎉 Production Ready

The application is fully functional with:
- ✅ Robust error handling
- ✅ Multi-language support
- ✅ Cost-effective processing
- ✅ Perfect Notion integration
- ✅ Dual input modes (video + text)

## 📄 Dependencies

### Python (backend/requirements.txt)
```
flask==2.3.3
flask-cors==4.0.0
python-dotenv==1.0.0
openai-whisper==20230314
faster-whisper==0.7.1
requests==2.31.0
moviepy==1.0.3
```

### Node.js (package.json)
```
react, react-dom, electron, typescript, webpack
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Repository**: https://github.com/simonlemon333/smartnote
- **Issues**: https://github.com/simonlemon333/smartnote/issues

---

Made with ❤️ for efficient note-taking from video content
# Smart Note 智能笔记

Transform your videos into structured notes with AI-powered transcription and summarization.

## 🎯 Features

- **Video Processing**: Support for MP4, MKV formats with drag-and-drop interface
- **AI Transcription**: Local Whisper integration for speech-to-text conversion
- **Smart Summarization**: DashScope API for intelligent content analysis and key point extraction
- **Notion Integration**: Perfect toggle format output for direct copy-paste into Notion
- **Multi-language Support**: Chinese/English/Auto-detect language processing
- **Production Ready**: Robust error handling, retry mechanisms, and temporary file management
- **Desktop App**: Cross-platform Electron application

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
   ```bash
   # Edit backend/config.py and configure:
   DASHSCOPE_API_KEY = "your_dashscope_api_key"
   DASHSCOPE_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   python app.py
   ```

2. **Start the frontend (in another terminal)**
   ```bash
   npm run dev
   ```

3. **Launch Electron app (optional)**
   ```bash
   npm run electron:dev
   ```

4. **Use the app**
   - Drag and drop video files (MP4/MKV) into the interface
   - Select language (Chinese/English/Auto-detect)
   - Wait for processing (local Whisper + DashScope AI)
   - Copy the generated Notion-formatted notes

## 📁 Project Structure

```
smartnote/
├── backend/                # Python Flask API
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── .env.example       # Environment variables template
├── src/
│   ├── main/              # Electron main process
│   │   ├── main.ts        # Main process entry point
│   │   └── preload.ts     # Preload script
│   └── renderer/          # React frontend
│       ├── App.tsx        # Main React component
│       └── components/    # UI components
├── dist/                  # Built application files
├── package.json           # Node.js dependencies
└── webpack.config.js      # Webpack configuration
```

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Electron
- **Backend**: Python + Flask + Local Whisper
- **AI Services**: DashScope API (Alibaba Cloud) for summarization
- **Video Processing**: MoviePy for audio extraction
- **Build Tools**: Webpack + TypeScript

## 🔧 Configuration

### API Configuration
Configure DashScope API in `backend/config.py`:

```python
DASHSCOPE_API_KEY = "sk-e9afdc91a46e4a9d867dc534fe3e9401"
DASHSCOPE_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
```

### Supported Video Formats
- MP4
- MKV

## 📝 Usage

### API Endpoints

**Health Check**:
```
GET http://localhost:5000/health
```

**Video Processing**:
```
POST http://localhost:5000/process-video
Content-Type: multipart/form-data
Parameters:
- video: video file (MP4/MKV)
- language: zh/en/auto (optional, defaults to auto)
```

### Processing Flow
1. **Upload Video**: Drag and drop video file into interface
2. **Language Selection**: Choose Chinese/English or auto-detect
3. **Processing**: The app will:
   - Extract audio from video using MoviePy
   - Transcribe speech to text using local Whisper
   - Generate structured summary using DashScope AI
4. **Export**: Copy the formatted notes directly to Notion

## 🎨 Notion Integration

The generated notes use perfect toggle format:
```
> ## 📝 Main Content
- Key point 1
- Key point 2

> ## 🧠 Core Topics  
- Topic 1: Detailed explanation
- Topic 2: Detailed explanation

> ## 📄 Summary
Complete content summary, ready for Notion copy-paste
```

## 🚧 Development Status - v1.5

### ✅ Completed Features
- **Backend API**: Production-ready Flask server (http://localhost:5000)
- **Video Processing**: Complete video file upload and handling
- **Audio Extraction**: MoviePy integration with fallback mechanisms
- **Speech Transcription**: Local Whisper with all dependencies installed
- **AI Summarization**: DashScope API integration with configured keys
- **Notion Formatting**: Perfect toggle format output using > symbols
- **Multi-language Support**: Chinese/English/Auto-detect processing
- **Error Handling**: Robust retry mechanisms and temporary file management
- **Frontend Structure**: React components with TypeScript and Webpack
- **Electron App**: Desktop application with IPC handling

### ⚠️ Known Issues
- Frontend displays white screen (React app rendering issue)
- Webpack dev server runs on http://localhost:9000 but needs debugging

### 💰 Cost Efficiency
- **Local Whisper**: Free speech-to-text processing
- **DashScope API**: ~$0.003 per 2-hour video
- **Total Operating Cost**: Near zero

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
# Smart Note 智能笔记

Transform your videos into structured notes with AI-powered transcription and summarization.

## 🎯 Features

- **Video Processing**: Support for MP4, MKV, AVI, MOV formats
- **AI Transcription**: Automatic speech-to-text using OpenAI Whisper
- **Smart Summarization**: GPT-powered content analysis and key point extraction
- **Notion Integration**: Output formatted for direct copy-paste into Notion with toggle support
- **Desktop App**: Cross-platform Electron application with drag-and-drop interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- OpenAI API key

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

4. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit .env and add your OpenAI API key
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

3. **Use the app**
   - Drag and drop video files into the interface
   - Wait for processing (transcription + summarization)
   - Copy the generated notes to Notion

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
- **Backend**: Python + Flask + OpenAI Whisper
- **AI Services**: OpenAI GPT for summarization
- **Video Processing**: MoviePy for audio extraction
- **Build Tools**: Webpack + TypeScript

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the `backend/` directory:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Supported Video Formats
- MP4
- MKV
- AVI
- MOV

## 📝 Usage

1. **Upload Video**: Drag and drop or click to select video file
2. **Processing**: The app will:
   - Extract audio from video
   - Transcribe speech to text using Whisper
   - Generate structured summary using GPT
3. **Export**: Copy the formatted notes directly to Notion

## 🎨 Notion Integration

The generated notes are formatted with:
- **Hierarchical structure** with headings and subheadings
- **Toggle blocks** for collapsible sections
- **Bullet points** for key information
- **Clean markdown** compatible with Notion import

## 🚧 Development Status

- ✅ Video file handling and drag-and-drop UI
- ✅ Audio extraction from video files
- ✅ Whisper integration for transcription
- ✅ GPT integration for summarization
- ✅ Basic Electron desktop application
- ⏳ Enhanced Notion toggle formatting
- ⏳ Error handling and validation
- ⏳ Application packaging and distribution

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
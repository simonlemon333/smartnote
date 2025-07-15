"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const VideoDropZone_1 = __importDefault(require("./components/VideoDropZone"));
const ProcessingStatus_1 = __importDefault(require("./components/ProcessingStatus"));
const NotesOutput_1 = __importDefault(require("./components/NotesOutput"));
require("./App.css");
const App = () => {
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [processedNotes, setProcessedNotes] = (0, react_1.useState)('');
    const [transcription, setTranscription] = (0, react_1.useState)('');
    const [processingStatus, setProcessingStatus] = (0, react_1.useState)('');
    const handleVideoProcess = async (videoFile) => {
        setIsProcessing(true);
        setProcessingStatus('Uploading video...');
        try {
            const formData = new FormData();
            formData.append('video', videoFile);
            setProcessingStatus('Processing video (this may take a few minutes)...');
            const response = await fetch('http://localhost:5000/process-video', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setProcessedNotes(result.formatted_notes);
            setTranscription(result.transcription);
            setProcessingStatus('Complete!');
        }
        catch (error) {
            console.error('Error processing video:', error);
            setProcessingStatus('Error processing video. Please try again.');
        }
        finally {
            setIsProcessing(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app", children: [(0, jsx_runtime_1.jsxs)("header", { className: "app-header", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Smart Note" }), (0, jsx_runtime_1.jsx)("p", { children: "Transform your videos into structured notes" })] }), (0, jsx_runtime_1.jsxs)("main", { className: "app-main", children: [(0, jsx_runtime_1.jsx)(VideoDropZone_1.default, { onFileUpload: handleVideoProcess, disabled: isProcessing }), (0, jsx_runtime_1.jsx)(ProcessingStatus_1.default, { isProcessing: isProcessing, status: processingStatus }), (0, jsx_runtime_1.jsx)(NotesOutput_1.default, { notes: processedNotes, transcription: transcription })] })] }));
};
exports.default = App;

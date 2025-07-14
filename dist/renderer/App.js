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
    const [generatedNotes, setGeneratedNotes] = (0, react_1.useState)('');
    const [processingStatus, setProcessingStatus] = (0, react_1.useState)('');
    const handleVideoUpload = async (file) => {
        setIsProcessing(true);
        setProcessingStatus('Processing video...');
        try {
            // For drag-and-drop, we need to get the file path
            let videoPath = '';
            if (file.path) {
                videoPath = file.path;
            }
            else {
                // If no path available, use file dialog
                const selectedPath = await window.electronAPI.selectVideoFile();
                if (!selectedPath) {
                    setProcessingStatus('No video selected');
                    setIsProcessing(false);
                    return;
                }
                videoPath = selectedPath;
            }
            const result = await window.electronAPI.processVideo(videoPath);
            if (result.success) {
                setProcessingStatus('Video processed successfully!');
                setGeneratedNotes(result.summary || result.transcription || 'Processing completed');
            }
            else {
                setProcessingStatus(`Error: ${result.error}`);
            }
            setIsProcessing(false);
        }
        catch (error) {
            setProcessingStatus('Error processing video');
            setIsProcessing(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app", children: [(0, jsx_runtime_1.jsxs)("header", { className: "app-header", children: [(0, jsx_runtime_1.jsx)("h1", { children: "Smart Note" }), (0, jsx_runtime_1.jsx)("p", { children: "Transform your videos into structured notes" })] }), (0, jsx_runtime_1.jsxs)("main", { className: "app-main", children: [(0, jsx_runtime_1.jsx)(VideoDropZone_1.default, { onFileUpload: handleVideoUpload }), (0, jsx_runtime_1.jsx)(ProcessingStatus_1.default, { isProcessing: isProcessing, status: processingStatus }), (0, jsx_runtime_1.jsx)(NotesOutput_1.default, { notes: generatedNotes })] })] }));
};
exports.default = App;

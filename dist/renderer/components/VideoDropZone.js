"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./VideoDropZone.css");
const VideoDropZone = ({ onFileUpload, disabled = false }) => {
    const [isDragOver, setIsDragOver] = (0, react_1.useState)(false);
    const handleDragOver = (0, react_1.useCallback)((e) => {
        if (disabled)
            return;
        e.preventDefault();
        setIsDragOver(true);
    }, [disabled]);
    const handleDragLeave = (0, react_1.useCallback)((e) => {
        if (disabled)
            return;
        e.preventDefault();
        setIsDragOver(false);
    }, [disabled]);
    const handleDrop = (0, react_1.useCallback)((e) => {
        if (disabled)
            return;
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        const videoFile = files.find(file => file.type.startsWith('video/') ||
            file.name.endsWith('.mp4') ||
            file.name.endsWith('.mkv'));
        if (videoFile) {
            onFileUpload(videoFile);
        }
    }, [onFileUpload, disabled]);
    const handleFileInput = (0, react_1.useCallback)((e) => {
        if (disabled)
            return;
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    }, [onFileUpload, disabled]);
    return ((0, jsx_runtime_1.jsx)("div", { className: `video-drop-zone ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`, children: (0, jsx_runtime_1.jsx)("div", { className: "drop-area", onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, children: (0, jsx_runtime_1.jsxs)("div", { className: "drop-content", children: [(0, jsx_runtime_1.jsx)("div", { className: "drop-icon", children: "\uD83D\uDCF9" }), (0, jsx_runtime_1.jsx)("h3", { children: disabled ? 'Processing...' : 'Drop your video file here' }), (0, jsx_runtime_1.jsx)("p", { children: disabled ? 'Please wait while your video is being processed' : 'Supports MP4, MKV formats' }), !disabled && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "or-divider", children: "or" }), (0, jsx_runtime_1.jsxs)("label", { className: "file-input-label", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "video/*,.mp4,.mkv", onChange: handleFileInput, className: "file-input", disabled: disabled }), "Choose File"] })] }))] }) }) }));
};
exports.default = VideoDropZone;

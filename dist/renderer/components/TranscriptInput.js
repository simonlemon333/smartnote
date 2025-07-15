"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./TranscriptInput.css");
const TranscriptInput = ({ onTranscriptSubmit, disabled }) => {
    const [transcript, setTranscript] = (0, react_1.useState)('');
    const handleSubmit = () => {
        if (transcript.trim()) {
            onTranscriptSubmit(transcript.trim());
        }
    };
    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                setTranscript(content);
            };
            reader.readAsText(file);
        }
    };
    const handlePaste = (event) => {
        // Allow default paste behavior
        setTimeout(() => {
            const pastedText = event.currentTarget.value;
            setTranscript(pastedText);
        }, 0);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "transcript-input", children: [(0, jsx_runtime_1.jsxs)("div", { className: "transcript-input-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "\uD83D\uDCC4 Process Transcript" }), (0, jsx_runtime_1.jsx)("p", { children: "Upload a text file or paste your transcript directly" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "transcript-input-methods", children: [(0, jsx_runtime_1.jsxs)("div", { className: "file-upload-section", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".txt", onChange: handleFileUpload, disabled: disabled, id: "transcript-file", style: { display: 'none' } }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "transcript-file", className: `file-upload-button ${disabled ? 'disabled' : ''}`, children: "\uD83D\uDCC1 Upload Text File" })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-input-section", children: (0, jsx_runtime_1.jsx)("textarea", { value: transcript, onChange: (e) => setTranscript(e.target.value), onPaste: handlePaste, placeholder: "Or paste your transcript here...", disabled: disabled, rows: 10, className: "transcript-textarea" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "transcript-input-actions", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleSubmit, disabled: disabled || !transcript.trim(), className: "process-button", children: "\uD83E\uDDE0 Process Transcript" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setTranscript(''), disabled: disabled, className: "clear-button", children: "\uD83D\uDDD1\uFE0F Clear" })] }), transcript && ((0, jsx_runtime_1.jsxs)("div", { className: "transcript-preview", children: [(0, jsx_runtime_1.jsxs)("p", { className: "preview-label", children: ["Preview (", transcript.length, " characters):"] }), (0, jsx_runtime_1.jsxs)("div", { className: "preview-text", children: [transcript.substring(0, 200), "..."] })] }))] }));
};
exports.default = TranscriptInput;

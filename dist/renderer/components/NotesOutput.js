"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./NotesOutput.css");
const NotesOutput = ({ notes, transcription }) => {
    if (!notes)
        return null;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(notes);
    };
    const downloadTranscript = () => {
        if (!transcription)
            return;
        const blob = new Blob([transcription], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "notes-output", children: [(0, jsx_runtime_1.jsxs)("div", { className: "notes-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Generated Notes" }), (0, jsx_runtime_1.jsxs)("div", { className: "button-group", children: [(0, jsx_runtime_1.jsx)("button", { className: "copy-button", onClick: copyToClipboard, children: "\uD83D\uDCCB Copy to Clipboard" }), transcription && ((0, jsx_runtime_1.jsx)("button", { className: "download-button", onClick: downloadTranscript, children: "\uD83D\uDCC4 Download Transcript" }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "notes-content", children: (0, jsx_runtime_1.jsx)("pre", { children: notes }) })] }));
};
exports.default = NotesOutput;

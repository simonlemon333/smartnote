"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./NotesOutput.css");
const NotesOutput = ({ notes }) => {
    if (!notes)
        return null;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(notes);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "notes-output", children: [(0, jsx_runtime_1.jsxs)("div", { className: "notes-header", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Generated Notes" }), (0, jsx_runtime_1.jsx)("button", { className: "copy-button", onClick: copyToClipboard, children: "\uD83D\uDCCB Copy to Clipboard" })] }), (0, jsx_runtime_1.jsx)("div", { className: "notes-content", children: (0, jsx_runtime_1.jsx)("pre", { children: notes }) })] }));
};
exports.default = NotesOutput;

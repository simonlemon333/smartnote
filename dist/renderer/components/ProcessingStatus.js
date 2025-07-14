"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./ProcessingStatus.css");
const ProcessingStatus = ({ isProcessing, status }) => {
    if (!status)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "processing-status", children: (0, jsx_runtime_1.jsxs)("div", { className: "status-content", children: [isProcessing && ((0, jsx_runtime_1.jsx)("div", { className: "loading-spinner", children: (0, jsx_runtime_1.jsx)("div", { className: "spinner" }) })), (0, jsx_runtime_1.jsx)("span", { className: "status-text", children: status })] }) }));
};
exports.default = ProcessingStatus;

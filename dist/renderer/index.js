"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("react-dom/client");
const App_1 = __importDefault(require("./App"));
console.log('Starting React app...');
function initApp() {
    const container = document.getElementById('root');
    if (!container) {
        console.error('Root container not found!');
    }
    else {
        console.log('Root container found, creating React root...');
        const root = (0, client_1.createRoot)(container);
        root.render((0, jsx_runtime_1.jsx)(App_1.default, {}));
        console.log('React app rendered!');
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
}
else {
    initApp();
}

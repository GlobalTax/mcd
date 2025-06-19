import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
const container = document.getElementById("root");
if (!container) {
    throw new Error("Failed to find the root element");
}
const root = ReactDOM.createRoot(container);
root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));

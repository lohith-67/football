import React from 'react';
globalThis.React = React;
globalThis.window = globalThis.window || {};
globalThis.window.Motion = {
    motion: {
        div: ({ children, ...props }) => React.createElement('div', props, children),
        p: ({ children, ...props }) => React.createElement('p', props, children),
    },
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children)
};
globalThis.window.API_BASE_URL = 'http://localhost:8000';

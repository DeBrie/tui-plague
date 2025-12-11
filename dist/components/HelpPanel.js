import React from 'react';
import { Box, Text } from 'ink';
export const HelpPanel = () => {
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "single", borderColor: "gray", paddingX: 1 },
        React.createElement(Text, { bold: true, color: "gray" }, "Controls"),
        React.createElement(Box, { flexDirection: "row", justifyContent: "space-between" },
            React.createElement(Box, { flexDirection: "column" },
                React.createElement(Text, { dimColor: true }, "Space: Pause/Resume"),
                React.createElement(Text, { dimColor: true }, "+/-: Change speed"),
                React.createElement(Text, { dimColor: true }, "Tab: Switch panels")),
            React.createElement(Box, { flexDirection: "column" },
                React.createElement(Text, { dimColor: true }, "1-3: Disease sub-tabs"),
                React.createElement(Text, { dimColor: true }, "\u2191\u2193: Navigate"),
                React.createElement(Text, { dimColor: true }, "Enter: Select/Evolve")),
            React.createElement(Box, { flexDirection: "column" },
                React.createElement(Text, { dimColor: true }, "Q: Quit game")))));
};

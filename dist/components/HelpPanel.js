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
                React.createElement(Text, { dimColor: true }, "Up/Down: Navigate"),
                React.createElement(Text, { dimColor: true }, "Enter: Select/Evolve")),
            React.createElement(Box, { flexDirection: "column" },
                React.createElement(Text, { dimColor: true }, "T: Toggle transits"),
                React.createElement(Text, { dimColor: true }, "Esc: Quit game"))),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { dimColor: true }, "Legend: [X]=Borders Closed [A]=Airport Closed [S]=Seaport Closed [!]=High Awareness"))));
};

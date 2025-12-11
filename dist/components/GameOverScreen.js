import React from 'react';
import { Box, Text, useInput } from 'ink';
const formatNumber = (num) => {
    if (num >= 1000000000)
        return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000)
        return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000)
        return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};
export const GameOverScreen = ({ state, onRestart }) => {
    useInput((input, key) => {
        if (key.return || input === 'r') {
            onRestart();
        }
    });
    const { victory, plague, day, totalDead, totalPopulation, cureProgress } = state;
    return (React.createElement(Box, { flexDirection: "column", alignItems: "center", paddingY: 2 },
        victory ? (React.createElement(React.Fragment, null,
            React.createElement(Text, { bold: true, color: "red" }, `
 __     _____ ____ _____ ___  ______   ___
 \ \   / /_ _/ ___|_   _/ _ \|  _ \ \ / / |
  \ \ / / | | |     | || | | | |_) \ V /| |
   \ V /  | | |___  | || |_| |  _ < | | |_|
    \_/  |___\____| |_| \___/|_| \_\|_| (_)
`),
            React.createElement(Text, { color: "red", bold: true },
                "[*] ",
                plague.name,
                " has eradicated humanity! [*]"))) : (React.createElement(React.Fragment, null,
            React.createElement(Text, { bold: true, color: "green" }, `
  ____  _____ _____ _____    _  _____ 
 |  _ \| ____|  ___| ____|  / \|_   _|
 | | | |  _| | |_  |  _|   / _ \ | |  
 | |_| | |___|  _| | |___ / ___ \| |  
 |____/|_____|_|   |_____/_/   \_\_|  
`),
            React.createElement(Text, { color: "green", bold: true },
                "[+] Humanity has developed a cure for ",
                plague.name,
                "! [+]"))),
        React.createElement(Box, { flexDirection: "column", marginTop: 2, borderStyle: "single", paddingX: 3, paddingY: 1 },
            React.createElement(Text, { bold: true }, "Final Statistics"),
            React.createElement(Text, null,
                "Days Elapsed: ",
                React.createElement(Text, { color: "yellow" }, day)),
            React.createElement(Text, null,
                "Total Deaths: ",
                React.createElement(Text, { color: "red" }, formatNumber(totalDead))),
            React.createElement(Text, null,
                "World Population: ",
                React.createElement(Text, { color: "green" }, formatNumber(totalPopulation - totalDead))),
            React.createElement(Text, null,
                "Cure Progress: ",
                React.createElement(Text, { color: "cyan" },
                    cureProgress.toFixed(1),
                    "%"))),
        React.createElement(Box, { marginTop: 2 },
            React.createElement(Text, { dimColor: true }, "Press Enter or 'R' to play again"))));
};

import React from 'react';
import { Box, Text } from 'ink';
const formatNumber = (num) => {
    if (num >= 1000000000)
        return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000)
        return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000)
        return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};
export const Header = ({ state }) => {
    const { plague, day, dnaPoints, cureProgress, totalInfected, totalDead, totalPopulation, isPaused, gameSpeed } = state;
    const healthyCount = totalPopulation - totalInfected - totalDead;
    const infectedPercent = ((totalInfected / totalPopulation) * 100).toFixed(2);
    const deadPercent = ((totalDead / totalPopulation) * 100).toFixed(2);
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "double", borderColor: "red", paddingX: 1 },
        React.createElement(Box, { justifyContent: "space-between" },
            React.createElement(Text, { bold: true, color: "red" },
                "\u2623 ",
                plague.name,
                " \u2623"),
            React.createElement(Text, null,
                "Day: ",
                React.createElement(Text, { color: "yellow" }, day),
                ' | ',
                React.createElement(Text, { color: "cyan" },
                    "DNA: ",
                    dnaPoints),
                ' | ',
                "Speed: ",
                React.createElement(Text, { color: "green" }, isPaused ? 'PAUSED' : '▶'.repeat(gameSpeed)))),
        React.createElement(Box, { marginTop: 1, justifyContent: "space-between" },
            React.createElement(Box, null,
                React.createElement(Text, { color: "green" },
                    "Healthy: ",
                    formatNumber(healthyCount)),
                React.createElement(Text, null, " | "),
                React.createElement(Text, { color: "yellow" },
                    "Infected: ",
                    formatNumber(totalInfected),
                    " (",
                    infectedPercent,
                    "%)"),
                React.createElement(Text, null, " | "),
                React.createElement(Text, { color: "red" },
                    "Dead: ",
                    formatNumber(totalDead),
                    " (",
                    deadPercent,
                    "%)")),
            React.createElement(Box, null,
                React.createElement(Text, null, "Cure: "),
                React.createElement(Text, { color: cureProgress > 50 ? 'red' : cureProgress > 25 ? 'yellow' : 'green' },
                    '█'.repeat(Math.floor(cureProgress / 5)),
                    '░'.repeat(20 - Math.floor(cureProgress / 5))),
                React.createElement(Text, null,
                    " ",
                    cureProgress.toFixed(1),
                    "%"))),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { dimColor: true },
                "INF: ",
                plague.infectivity,
                " | SEV: ",
                plague.severity,
                " | LTH: ",
                plague.lethality,
                ' | ',
                "Air: ",
                plague.airborne,
                " | Water: ",
                plague.waterborne,
                " | Insect: ",
                plague.insectborne,
                ' | ',
                "Cold: ",
                plague.coldResistance,
                " | Heat: ",
                plague.heatResistance,
                " | Drug: ",
                plague.drugResistance))));
};

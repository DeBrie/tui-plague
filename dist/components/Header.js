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
const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
        case 'easy': return 'green';
        case 'normal': return 'yellow';
        case 'hard': return 'red';
        default: return 'white';
    }
};
export const Header = ({ state }) => {
    const { plague, day, dnaPoints, cureProgress, totalInfected, totalDead, totalPopulation, isPaused, gameSpeed, difficulty, visibility } = state;
    const healthyCount = totalPopulation - totalInfected - totalDead;
    const infectedPercent = ((totalInfected / totalPopulation) * 100).toFixed(2);
    const deadPercent = ((totalDead / totalPopulation) * 100).toFixed(2);
    // Create progress bars using simple ASCII
    const cureBarFilled = Math.floor(cureProgress / 5);
    const cureBar = '#'.repeat(cureBarFilled) + '-'.repeat(20 - cureBarFilled);
    const visBarFilled = Math.floor(visibility / 5);
    const visBar = '#'.repeat(visBarFilled) + '-'.repeat(20 - visBarFilled);
    const speedIndicator = isPaused ? 'PAUSED' : '>'.repeat(gameSpeed);
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "double", borderColor: "red", paddingX: 1 },
        React.createElement(Box, { justifyContent: "space-between" },
            React.createElement(Text, { bold: true, color: "red" },
                "[*] ",
                plague.name,
                " [*]"),
            React.createElement(Text, null,
                "Day: ",
                React.createElement(Text, { color: "yellow" }, day),
                ' | ',
                React.createElement(Text, { color: "cyan" },
                    "DNA: ",
                    dnaPoints),
                ' | ',
                "Speed: ",
                React.createElement(Text, { color: "green" }, speedIndicator),
                ' | ',
                React.createElement(Text, { color: getDifficultyColor(difficulty) }, difficulty.toUpperCase()))),
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
                    "%)"))),
        React.createElement(Box, { marginTop: 1, justifyContent: "space-between" },
            React.createElement(Box, null,
                React.createElement(Text, null, "Cure: "),
                React.createElement(Text, { color: cureProgress > 50 ? 'red' : cureProgress > 25 ? 'yellow' : 'green' },
                    "[",
                    cureBar,
                    "]"),
                React.createElement(Text, null,
                    " ",
                    cureProgress.toFixed(1),
                    "%")),
            React.createElement(Box, null,
                React.createElement(Text, null, "Visibility: "),
                React.createElement(Text, { color: visibility > 50 ? 'red' : visibility > 25 ? 'yellow' : 'green' },
                    "[",
                    visBar,
                    "]"),
                React.createElement(Text, null,
                    " ",
                    visibility.toFixed(1),
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

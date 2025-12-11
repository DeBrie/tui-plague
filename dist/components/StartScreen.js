import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
const DIFFICULTIES = [
    { id: 'easy', name: 'Easy', desc: 'Slower cure, more DNA, borders close slowly', color: 'green' },
    { id: 'normal', name: 'Normal', desc: 'Balanced gameplay experience', color: 'yellow' },
    { id: 'hard', name: 'Hard', desc: 'Fast cure, less DNA, aggressive border closures', color: 'red' },
];
export const StartScreen = ({ countries, onStart }) => {
    const [step, setStep] = useState('name');
    const [plagueName, setPlagueName] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [difficulty, setDifficulty] = useState('normal');
    const [difficultyIndex, setDifficultyIndex] = useState(1);
    useInput((input, key) => {
        if (step === 'name') {
            if (key.return && plagueName.length > 0) {
                setStep('difficulty');
            }
            else if (key.backspace || key.delete) {
                setPlagueName(prev => prev.slice(0, -1));
            }
            else if (input && !key.ctrl && !key.meta && input.length === 1) {
                setPlagueName(prev => prev + input);
            }
        }
        else if (step === 'difficulty') {
            if (key.upArrow) {
                setDifficultyIndex(prev => Math.max(0, prev - 1));
            }
            else if (key.downArrow) {
                setDifficultyIndex(prev => Math.min(DIFFICULTIES.length - 1, prev + 1));
            }
            else if (key.return) {
                setDifficulty(DIFFICULTIES[difficultyIndex].id);
                setStep('country');
            }
            else if (key.escape) {
                setStep('name');
            }
        }
        else if (step === 'country') {
            if (key.upArrow) {
                setSelectedIndex(prev => Math.max(0, prev - 1));
            }
            else if (key.downArrow) {
                setSelectedIndex(prev => Math.min(countries.length - 1, prev + 1));
            }
            else if (key.return) {
                onStart(countries[selectedIndex].id, plagueName, difficulty);
            }
            else if (key.escape) {
                setStep('difficulty');
            }
        }
    });
    return (React.createElement(Box, { flexDirection: "column", alignItems: "center", paddingY: 2 },
        React.createElement(Text, { bold: true, color: "red" }, `
  _____ _   _ ___   ____  _        _    ____ _   _ _____ 
 |_   _| | | |_ _| |  _ \| |      / \  / ___| | | | ____|
   | | | | | || |  | |_) | |     / _ \| |  _| | | |  _|  
   | | | |_| || |  |  __/| |___ / ___ \ |_| | |_| | |___ 
   |_|  \___/|___| |_|   |_____/_/   \_\____|\___/|_____|
`),
        React.createElement(Text, { color: "yellow", bold: true }, "[*] Infect the World [*]"),
        React.createElement(Box, { marginTop: 2, flexDirection: "column", alignItems: "center" }, step === 'name' ? (React.createElement(React.Fragment, null,
            React.createElement(Text, null, "Name your plague:"),
            React.createElement(Box, { borderStyle: "single", paddingX: 2, marginTop: 1 },
                React.createElement(Text, { color: "red" },
                    plagueName,
                    React.createElement(Text, { color: "gray" }, "_"))),
            React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, { dimColor: true }, "Type a name and press Enter")))) : step === 'difficulty' ? (React.createElement(React.Fragment, null,
            React.createElement(Text, null, "Select difficulty:"),
            React.createElement(Box, { flexDirection: "column", marginTop: 1 }, DIFFICULTIES.map((diff, idx) => {
                const isSelected = idx === difficultyIndex;
                return (React.createElement(Box, { key: diff.id, flexDirection: "column" },
                    React.createElement(Text, { inverse: isSelected, color: diff.color },
                        isSelected ? '> ' : '  ',
                        diff.name),
                    isSelected && (React.createElement(Text, { dimColor: true },
                        "    ",
                        diff.desc))));
            })),
            React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, { dimColor: true }, "Up/Down: Navigate | Enter: Select | Esc: Back")))) : (React.createElement(React.Fragment, null,
            React.createElement(Text, null,
                "Select starting country: ",
                React.createElement(Text, { color: DIFFICULTIES.find(d => d.id === difficulty)?.color },
                    "[",
                    difficulty.toUpperCase(),
                    "]")),
            React.createElement(Box, { flexDirection: "column", marginTop: 1, height: 15 }, countries.slice(Math.max(0, selectedIndex - 7), selectedIndex + 8).map((country, idx) => {
                const actualIndex = Math.max(0, selectedIndex - 7) + idx;
                const isSelected = actualIndex === selectedIndex;
                return (React.createElement(Text, { key: country.id, inverse: isSelected },
                    isSelected ? '> ' : '  ',
                    country.name,
                    React.createElement(Text, { dimColor: true },
                        " - Pop: ",
                        (country.population / 1000000).toFixed(1),
                        "M, ",
                        country.climate,
                        ", ",
                        country.wealth)));
            })),
            React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, { dimColor: true }, "Up/Down: Navigate | Enter: Select | Esc: Back")))))));
};

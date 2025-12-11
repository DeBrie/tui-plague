import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
export const StartScreen = ({ countries, onStart }) => {
    const [step, setStep] = useState('name');
    const [plagueName, setPlagueName] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    useInput((input, key) => {
        if (step === 'name') {
            if (key.return && plagueName.length > 0) {
                setStep('country');
            }
            else if (key.backspace || key.delete) {
                setPlagueName(prev => prev.slice(0, -1));
            }
            else if (input && !key.ctrl && !key.meta && input.length === 1) {
                setPlagueName(prev => prev + input);
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
                onStart(countries[selectedIndex].id, plagueName);
            }
            else if (key.escape) {
                setStep('name');
            }
        }
    });
    return (React.createElement(Box, { flexDirection: "column", alignItems: "center", paddingY: 2 },
        React.createElement(Text, { bold: true, color: "red" }, `
   ████████╗██╗   ██╗██╗    ██████╗ ██╗      █████╗  ██████╗ ██╗   ██╗███████╗
   ╚══██╔══╝██║   ██║██║    ██╔══██╗██║     ██╔══██╗██╔════╝ ██║   ██║██╔════╝
      ██║   ██║   ██║██║    ██████╔╝██║     ███████║██║  ███╗██║   ██║█████╗  
      ██║   ██║   ██║██║    ██╔═══╝ ██║     ██╔══██║██║   ██║██║   ██║██╔══╝  
      ██║   ╚██████╔╝██║    ██║     ███████╗██║  ██║╚██████╔╝╚██████╔╝███████╗
      ╚═╝    ╚═════╝ ╚═╝    ╚═╝     ╚══════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝
        `),
        React.createElement(Text, { color: "yellow", bold: true }, "\u2623 Infect the World \u2623"),
        React.createElement(Box, { marginTop: 2, flexDirection: "column", alignItems: "center" }, step === 'name' ? (React.createElement(React.Fragment, null,
            React.createElement(Text, null, "Name your plague:"),
            React.createElement(Box, { borderStyle: "single", paddingX: 2, marginTop: 1 },
                React.createElement(Text, { color: "red" },
                    plagueName,
                    React.createElement(Text, { color: "gray" }, "_"))),
            React.createElement(Box, { marginTop: 1 },
                React.createElement(Text, { dimColor: true }, "Type a name and press Enter")))) : (React.createElement(React.Fragment, null,
            React.createElement(Text, null, "Select starting country:"),
            React.createElement(Box, { flexDirection: "column", marginTop: 1, height: 15 }, countries.slice(Math.max(0, selectedIndex - 7), selectedIndex + 8).map((country, idx) => {
                const actualIndex = Math.max(0, selectedIndex - 7) + idx;
                const isSelected = actualIndex === selectedIndex;
                return (React.createElement(Text, { key: country.id, inverse: isSelected },
                    isSelected ? '▶ ' : '  ',
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
                React.createElement(Text, { dimColor: true }, "\u2191\u2193 Navigate | Enter: Select | Esc: Back")))))));
};

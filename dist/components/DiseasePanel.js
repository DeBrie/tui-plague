import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
export const DiseasePanel = ({ symptoms, transmissions, abilities, dnaPoints, onEvolveSymptom, onEvolveTransmission, onEvolveAbility, isActive, }) => {
    const [subTab, setSubTab] = useState('symptoms');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const getCurrentItems = () => {
        switch (subTab) {
            case 'symptoms': return symptoms;
            case 'transmission': return transmissions;
            case 'abilities': return abilities;
        }
    };
    const items = getCurrentItems();
    useInput((input, key) => {
        if (!isActive)
            return;
        if (input === '1')
            setSubTab('symptoms');
        if (input === '2')
            setSubTab('transmission');
        if (input === '3')
            setSubTab('abilities');
        if (key.upArrow) {
            setSelectedIndex(prev => Math.max(0, prev - 1));
        }
        if (key.downArrow) {
            setSelectedIndex(prev => Math.min(items.length - 1, prev + 1));
        }
        if (key.return) {
            const item = items[selectedIndex];
            if (item) {
                if (subTab === 'symptoms')
                    onEvolveSymptom(item.id);
                if (subTab === 'transmission')
                    onEvolveTransmission(item.id);
                if (subTab === 'abilities')
                    onEvolveAbility(item.id);
            }
        }
    }, { isActive });
    // Reset selection when changing tabs
    React.useEffect(() => {
        setSelectedIndex(0);
    }, [subTab]);
    const canUnlock = (item) => {
        if (item.unlocked)
            return false;
        if (dnaPoints < item.cost)
            return false;
        if ('requires' in item && item.requires) {
            return item.requires.every(reqId => symptoms.find(s => s.id === reqId)?.unlocked);
        }
        if ('level' in item && item.level > 1) {
            const sameType = (subTab === 'transmission' ? transmissions : abilities);
            const prevLevel = sameType.find(t => t.type === item.type && t.level === item.level - 1);
            return prevLevel?.unlocked ?? false;
        }
        return true;
    };
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "single", borderColor: "magenta", paddingX: 1 },
        React.createElement(Box, null,
            React.createElement(Text, { bold: true, color: "magenta" }, "\uD83E\uDDEC Disease Evolution"),
            React.createElement(Text, null, " | DNA: "),
            React.createElement(Text, { color: "cyan", bold: true }, dnaPoints)),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { color: subTab === 'symptoms' ? 'yellow' : 'white', bold: subTab === 'symptoms' }, "[1] Symptoms"),
            React.createElement(Text, null, " | "),
            React.createElement(Text, { color: subTab === 'transmission' ? 'yellow' : 'white', bold: subTab === 'transmission' }, "[2] Transmission"),
            React.createElement(Text, null, " | "),
            React.createElement(Text, { color: subTab === 'abilities' ? 'yellow' : 'white', bold: subTab === 'abilities' }, "[3] Abilities")),
        React.createElement(Box, { flexDirection: "column", marginTop: 1, height: 15 }, items.map((item, index) => {
            const isSelected = index === selectedIndex && isActive;
            const canBuy = canUnlock(item);
            let statusColor = 'gray';
            let statusText = `[${item.cost} DNA]`;
            if (item.unlocked) {
                statusColor = 'green';
                statusText = '✓ Evolved';
            }
            else if (canBuy) {
                statusColor = 'cyan';
            }
            else if (dnaPoints < item.cost) {
                statusColor = 'red';
            }
            return (React.createElement(Box, { key: item.id, flexDirection: "column" },
                React.createElement(Text, { inverse: isSelected },
                    React.createElement(Text, { color: statusColor }, isSelected ? '▶ ' : '  '),
                    React.createElement(Text, { bold: !item.unlocked }, item.name),
                    React.createElement(Text, { color: statusColor },
                        " ",
                        statusText)),
                isSelected && (React.createElement(Text, { dimColor: true, wrap: "wrap" },
                    '   ',
                    item.description,
                    'requires' in item && item.requires && (React.createElement(Text, { color: "yellow" },
                        " [Requires: ",
                        item.requires.join(', '),
                        "]")),
                    'infectivityBonus' in item && (React.createElement(Text, { color: "green" },
                        " +",
                        item.infectivityBonus,
                        " INF")),
                    'severityBonus' in item && (React.createElement(Text, { color: "yellow" },
                        " +",
                        item.severityBonus,
                        " SEV")),
                    'lethalityBonus' in item && (React.createElement(Text, { color: "red" },
                        " +",
                        item.lethalityBonus,
                        " LTH"))))));
        })),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { dimColor: true }, "\u2191\u2193 Navigate | Enter: Evolve | 1-3: Switch tabs"))));
};

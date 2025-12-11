import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
export const DiseasePanel = ({ symptoms, transmissions, abilities, specialAbilities, dnaPoints, onEvolveSymptom, onEvolveTransmission, onEvolveAbility, onEvolveSpecial, isActive, }) => {
    const [subTab, setSubTab] = useState('symptoms');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const getCurrentItems = () => {
        switch (subTab) {
            case 'symptoms': return symptoms;
            case 'transmission': return transmissions;
            case 'abilities': return abilities;
            case 'special': return specialAbilities;
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
        if (input === '4')
            setSubTab('special');
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
                if (subTab === 'special')
                    onEvolveSpecial(item.id);
            }
        }
    }, { isActive });
    // Reset selection when changing tabs
    React.useEffect(() => {
        setSelectedIndex(0);
    }, [subTab]);
    const canUnlock = (item) => {
        // Special abilities have different logic
        if ('category' in item) {
            const special = item;
            if (special.timesPurchased >= special.maxPurchases)
                return false;
            if (dnaPoints < special.cost)
                return false;
            return true;
        }
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
            React.createElement(Text, { bold: true, color: "magenta" }, "[DISEASE EVOLUTION]"),
            React.createElement(Text, null, " | DNA: "),
            React.createElement(Text, { color: "cyan", bold: true }, dnaPoints)),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { color: subTab === 'symptoms' ? 'yellow' : 'white', bold: subTab === 'symptoms' }, "[1]Sym"),
            React.createElement(Text, null, " "),
            React.createElement(Text, { color: subTab === 'transmission' ? 'yellow' : 'white', bold: subTab === 'transmission' }, "[2]Trans"),
            React.createElement(Text, null, " "),
            React.createElement(Text, { color: subTab === 'abilities' ? 'yellow' : 'white', bold: subTab === 'abilities' }, "[3]Abil"),
            React.createElement(Text, null, " "),
            React.createElement(Text, { color: subTab === 'special' ? 'yellow' : 'white', bold: subTab === 'special' }, "[4]Special")),
        React.createElement(Box, { flexDirection: "column", marginTop: 1, height: 15 }, items.map((item, index) => {
            const isSelected = index === selectedIndex && isActive;
            const canBuy = canUnlock(item);
            const isSpecial = 'category' in item;
            const special = isSpecial ? item : null;
            let statusColor = 'gray';
            let statusText = `[${item.cost} DNA]`;
            if (isSpecial && special) {
                if (special.timesPurchased >= special.maxPurchases) {
                    statusColor = 'green';
                    statusText = special.repeatable ? `[MAX ${special.timesPurchased}x]` : '[OK]';
                }
                else if (canBuy) {
                    statusColor = 'cyan';
                    if (special.repeatable) {
                        statusText = `[${item.cost} DNA] (${special.timesPurchased}/${special.maxPurchases})`;
                    }
                }
                else if (dnaPoints < item.cost) {
                    statusColor = 'red';
                }
            }
            else {
                if (item.unlocked) {
                    statusColor = 'green';
                    statusText = '[OK] Evolved';
                }
                else if (canBuy) {
                    statusColor = 'cyan';
                }
                else if (dnaPoints < item.cost) {
                    statusColor = 'red';
                }
            }
            return (React.createElement(Box, { key: item.id, flexDirection: "column" },
                React.createElement(Text, { inverse: isSelected },
                    React.createElement(Text, { color: statusColor }, isSelected ? '> ' : '  '),
                    React.createElement(Text, { bold: isSpecial ? (special.timesPurchased < special.maxPurchases) : !item.unlocked }, item.name),
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
                        " LTH")),
                    'category' in item && (React.createElement(Text, { color: "magenta" },
                        " [",
                        item.category.toUpperCase(),
                        "]"))))));
        })),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { dimColor: true }, "Up/Down: Navigate | Enter: Evolve | 1-4: Switch tabs"))));
};

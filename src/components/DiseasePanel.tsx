import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Symptom, Transmission, Ability } from '../types.js';

interface DiseasePanelProps {
    symptoms: Symptom[];
    transmissions: Transmission[];
    abilities: Ability[];
    dnaPoints: number;
    onEvolveSymptom: (id: string) => void;
    onEvolveTransmission: (id: string) => void;
    onEvolveAbility: (id: string) => void;
    isActive: boolean;
}

type SubTab = 'symptoms' | 'transmission' | 'abilities';

export const DiseasePanel: React.FC<DiseasePanelProps> = ({
    symptoms,
    transmissions,
    abilities,
    dnaPoints,
    onEvolveSymptom,
    onEvolveTransmission,
    onEvolveAbility,
    isActive,
}) => {
    const [subTab, setSubTab] = useState<SubTab>('symptoms');
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
        if (!isActive) return;

        if (input === '1') setSubTab('symptoms');
        if (input === '2') setSubTab('transmission');
        if (input === '3') setSubTab('abilities');

        if (key.upArrow) {
            setSelectedIndex(prev => Math.max(0, prev - 1));
        }
        if (key.downArrow) {
            setSelectedIndex(prev => Math.min(items.length - 1, prev + 1));
        }
        if (key.return) {
            const item = items[selectedIndex];
            if (item) {
                if (subTab === 'symptoms') onEvolveSymptom(item.id);
                if (subTab === 'transmission') onEvolveTransmission(item.id);
                if (subTab === 'abilities') onEvolveAbility(item.id);
            }
        }
    }, { isActive });

    // Reset selection when changing tabs
    React.useEffect(() => {
        setSelectedIndex(0);
    }, [subTab]);

    const canUnlock = (item: Symptom | Transmission | Ability): boolean => {
        if (item.unlocked) return false;
        if (dnaPoints < item.cost) return false;

        if ('requires' in item && item.requires) {
            return item.requires.every(reqId =>
                symptoms.find(s => s.id === reqId)?.unlocked
            );
        }

        if ('level' in item && item.level > 1) {
            const sameType = (subTab === 'transmission' ? transmissions : abilities) as (Transmission | Ability)[];
            const prevLevel = sameType.find(t =>
                t.type === (item as Transmission | Ability).type && t.level === item.level - 1
            );
            return prevLevel?.unlocked ?? false;
        }

        return true;
    };

    return (
        <Box flexDirection="column" borderStyle="single" borderColor="magenta" paddingX={1}>
            <Box>
                <Text bold color="magenta">🧬 Disease Evolution</Text>
                <Text> | DNA: </Text>
                <Text color="cyan" bold>{dnaPoints}</Text>
            </Box>

            <Box marginTop={1}>
                <Text color={subTab === 'symptoms' ? 'yellow' : 'white'} bold={subTab === 'symptoms'}>
                    [1] Symptoms
                </Text>
                <Text> | </Text>
                <Text color={subTab === 'transmission' ? 'yellow' : 'white'} bold={subTab === 'transmission'}>
                    [2] Transmission
                </Text>
                <Text> | </Text>
                <Text color={subTab === 'abilities' ? 'yellow' : 'white'} bold={subTab === 'abilities'}>
                    [3] Abilities
                </Text>
            </Box>

            <Box flexDirection="column" marginTop={1} height={15}>
                {items.map((item, index) => {
                    const isSelected = index === selectedIndex && isActive;
                    const canBuy = canUnlock(item);

                    let statusColor = 'gray';
                    let statusText = `[${item.cost} DNA]`;

                    if (item.unlocked) {
                        statusColor = 'green';
                        statusText = '✓ Evolved';
                    } else if (canBuy) {
                        statusColor = 'cyan';
                    } else if (dnaPoints < item.cost) {
                        statusColor = 'red';
                    }

                    return (
                        <Box key={item.id} flexDirection="column">
                            <Text inverse={isSelected}>
                                <Text color={statusColor}>{isSelected ? '▶ ' : '  '}</Text>
                                <Text bold={!item.unlocked}>{item.name}</Text>
                                <Text color={statusColor}> {statusText}</Text>
                            </Text>
                            {isSelected && (
                                <Text dimColor wrap="wrap">
                                    {'   '}{item.description}
                                    {'requires' in item && item.requires && (
                                        <Text color="yellow"> [Requires: {item.requires.join(', ')}]</Text>
                                    )}
                                    {'infectivityBonus' in item && (
                                        <Text color="green"> +{(item as Symptom).infectivityBonus} INF</Text>
                                    )}
                                    {'severityBonus' in item && (
                                        <Text color="yellow"> +{(item as Symptom).severityBonus} SEV</Text>
                                    )}
                                    {'lethalityBonus' in item && (
                                        <Text color="red"> +{(item as Symptom).lethalityBonus} LTH</Text>
                                    )}
                                </Text>
                            )}
                        </Box>
                    );
                })}
            </Box>

            <Box marginTop={1}>
                <Text dimColor>↑↓ Navigate | Enter: Evolve | 1-3: Switch tabs</Text>
            </Box>
        </Box>
    );
};

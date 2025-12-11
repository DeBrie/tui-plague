import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Country, Difficulty } from '../types.js';

interface StartScreenProps {
    countries: Country[];
    onStart: (countryId: string, plagueName: string, difficulty: Difficulty) => void;
}

const DIFFICULTIES: { id: Difficulty; name: string; desc: string; color: string }[] = [
    { id: 'easy', name: 'Easy', desc: 'Slower cure, more DNA, borders close slowly', color: 'green' },
    { id: 'normal', name: 'Normal', desc: 'Balanced gameplay experience', color: 'yellow' },
    { id: 'hard', name: 'Hard', desc: 'Fast cure, less DNA, aggressive border closures', color: 'red' },
];

export const StartScreen: React.FC<StartScreenProps> = ({ countries, onStart }) => {
    const [step, setStep] = useState<'name' | 'difficulty' | 'country'>('name');
    const [plagueName, setPlagueName] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [difficulty, setDifficulty] = useState<Difficulty>('normal');
    const [difficultyIndex, setDifficultyIndex] = useState(1);

    useInput((input, key) => {
        if (step === 'name') {
            if (key.return && plagueName.length > 0) {
                setStep('difficulty');
            } else if (key.backspace || key.delete) {
                setPlagueName(prev => prev.slice(0, -1));
            } else if (input && !key.ctrl && !key.meta && input.length === 1) {
                setPlagueName(prev => prev + input);
            }
        } else if (step === 'difficulty') {
            if (key.upArrow) {
                setDifficultyIndex(prev => Math.max(0, prev - 1));
            } else if (key.downArrow) {
                setDifficultyIndex(prev => Math.min(DIFFICULTIES.length - 1, prev + 1));
            } else if (key.return) {
                setDifficulty(DIFFICULTIES[difficultyIndex].id);
                setStep('country');
            } else if (key.escape) {
                setStep('name');
            }
        } else if (step === 'country') {
            if (key.upArrow) {
                setSelectedIndex(prev => Math.max(0, prev - 1));
            } else if (key.downArrow) {
                setSelectedIndex(prev => Math.min(countries.length - 1, prev + 1));
            } else if (key.return) {
                onStart(countries[selectedIndex].id, plagueName, difficulty);
            } else if (key.escape) {
                setStep('difficulty');
            }
        }
    });

    return (
        <Box flexDirection="column" alignItems="center" paddingY={2}>
            <Text bold color="red">
                {`
  _____ _   _ ___   ____  _        _    ____ _   _ _____ 
 |_   _| | | |_ _| |  _ \| |      / \  / ___| | | | ____|
   | | | | | || |  | |_) | |     / _ \| |  _| | | |  _|  
   | | | |_| || |  |  __/| |___ / ___ \ |_| | |_| | |___ 
   |_|  \___/|___| |_|   |_____/_/   \_\____|\___/|_____|
`}
            </Text>

            <Text color="yellow" bold>[*] Infect the World [*]</Text>

            <Box marginTop={2} flexDirection="column" alignItems="center">
                {step === 'name' ? (
                    <>
                        <Text>Name your plague:</Text>
                        <Box borderStyle="single" paddingX={2} marginTop={1}>
                            <Text color="red">{plagueName}<Text color="gray">_</Text></Text>
                        </Box>
                        <Box marginTop={1}><Text dimColor>Type a name and press Enter</Text></Box>
                    </>
                ) : step === 'difficulty' ? (
                    <>
                        <Text>Select difficulty:</Text>
                        <Box flexDirection="column" marginTop={1}>
                            {DIFFICULTIES.map((diff, idx) => {
                                const isSelected = idx === difficultyIndex;
                                return (
                                    <Box key={diff.id} flexDirection="column">
                                        <Text inverse={isSelected} color={diff.color}>
                                            {isSelected ? '> ' : '  '}{diff.name}
                                        </Text>
                                        {isSelected && (
                                            <Text dimColor>    {diff.desc}</Text>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                        <Box marginTop={1}><Text dimColor>Up/Down: Navigate | Enter: Select | Esc: Back</Text></Box>
                    </>
                ) : (
                    <>
                        <Text>Select starting country: <Text color={DIFFICULTIES.find(d => d.id === difficulty)?.color}>[{difficulty.toUpperCase()}]</Text></Text>
                        <Box flexDirection="column" marginTop={1} height={15}>
                            {countries.slice(Math.max(0, selectedIndex - 7), selectedIndex + 8).map((country, idx) => {
                                const actualIndex = Math.max(0, selectedIndex - 7) + idx;
                                const isSelected = actualIndex === selectedIndex;
                                return (
                                    <Text key={country.id} inverse={isSelected}>
                                        {isSelected ? '> ' : '  '}
                                        {country.name}
                                        <Text dimColor> - Pop: {(country.population / 1000000).toFixed(1)}M, {country.climate}, {country.wealth}</Text>
                                    </Text>
                                );
                            })}
                        </Box>
                        <Box marginTop={1}><Text dimColor>Up/Down: Navigate | Enter: Select | Esc: Back</Text></Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Country } from '../types.js';

interface StartScreenProps {
    countries: Country[];
    onStart: (countryId: string, plagueName: string) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ countries, onStart }) => {
    const [step, setStep] = useState<'name' | 'country'>('name');
    const [plagueName, setPlagueName] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    useInput((input, key) => {
        if (step === 'name') {
            if (key.return && plagueName.length > 0) {
                setStep('country');
            } else if (key.backspace || key.delete) {
                setPlagueName(prev => prev.slice(0, -1));
            } else if (input && !key.ctrl && !key.meta && input.length === 1) {
                setPlagueName(prev => prev + input);
            }
        } else if (step === 'country') {
            if (key.upArrow) {
                setSelectedIndex(prev => Math.max(0, prev - 1));
            } else if (key.downArrow) {
                setSelectedIndex(prev => Math.min(countries.length - 1, prev + 1));
            } else if (key.return) {
                onStart(countries[selectedIndex].id, plagueName);
            } else if (key.escape) {
                setStep('name');
            }
        }
    });

    return (
        <Box flexDirection="column" alignItems="center" paddingY={2}>
            <Text bold color="red">
                {`
   ████████╗██╗   ██╗██╗    ██████╗ ██╗      █████╗  ██████╗ ██╗   ██╗███████╗
   ╚══██╔══╝██║   ██║██║    ██╔══██╗██║     ██╔══██╗██╔════╝ ██║   ██║██╔════╝
      ██║   ██║   ██║██║    ██████╔╝██║     ███████║██║  ███╗██║   ██║█████╗  
      ██║   ██║   ██║██║    ██╔═══╝ ██║     ██╔══██║██║   ██║██║   ██║██╔══╝  
      ██║   ╚██████╔╝██║    ██║     ███████╗██║  ██║╚██████╔╝╚██████╔╝███████╗
      ╚═╝    ╚═════╝ ╚═╝    ╚═╝     ╚══════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝
        `}
            </Text>

            <Text color="yellow" bold>☣ Infect the World ☣</Text>

            <Box marginTop={2} flexDirection="column" alignItems="center">
                {step === 'name' ? (
                    <>
                        <Text>Name your plague:</Text>
                        <Box borderStyle="single" paddingX={2} marginTop={1}>
                            <Text color="red">{plagueName}<Text color="gray">_</Text></Text>
                        </Box>
                        <Box marginTop={1}><Text dimColor>Type a name and press Enter</Text></Box>
                    </>
                ) : (
                    <>
                        <Text>Select starting country:</Text>
                        <Box flexDirection="column" marginTop={1} height={15}>
                            {countries.slice(Math.max(0, selectedIndex - 7), selectedIndex + 8).map((country, idx) => {
                                const actualIndex = Math.max(0, selectedIndex - 7) + idx;
                                const isSelected = actualIndex === selectedIndex;
                                return (
                                    <Text key={country.id} inverse={isSelected}>
                                        {isSelected ? '▶ ' : '  '}
                                        {country.name}
                                        <Text dimColor> - Pop: {(country.population / 1000000).toFixed(1)}M, {country.climate}, {country.wealth}</Text>
                                    </Text>
                                );
                            })}
                        </Box>
                        <Box marginTop={1}><Text dimColor>↑↓ Navigate | Enter: Select | Esc: Back</Text></Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

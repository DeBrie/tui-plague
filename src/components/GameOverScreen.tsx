import React from 'react';
import { Box, Text, useInput } from 'ink';
import { GameState } from '../types.js';

interface GameOverScreenProps {
    state: GameState;
    onRestart: () => void;
}

const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ state, onRestart }) => {
    useInput((input, key) => {
        if (key.return || input === 'r') {
            onRestart();
        }
    });

    const { victory, plague, day, totalDead, totalPopulation, cureProgress } = state;

    return (
        <Box flexDirection="column" alignItems="center" paddingY={2}>
            {victory ? (
                <>
                    <Text bold color="red">
                        {`
    ██╗   ██╗██╗ ██████╗████████╗ ██████╗ ██████╗ ██╗   ██╗██╗
    ██║   ██║██║██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝██║
    ██║   ██║██║██║        ██║   ██║   ██║██████╔╝ ╚████╔╝ ██║
    ╚██╗ ██╔╝██║██║        ██║   ██║   ██║██╔══██╗  ╚██╔╝  ╚═╝
     ╚████╔╝ ██║╚██████╗   ██║   ╚██████╔╝██║  ██║   ██║   ██╗
      ╚═══╝  ╚═╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝
            `}
                    </Text>
                    <Text color="red" bold>☣ {plague.name} has eradicated humanity! ☣</Text>
                </>
            ) : (
                <>
                    <Text bold color="green">
                        {`
    ██████╗ ███████╗███████╗███████╗ █████╗ ████████╗
    ██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗╚══██╔══╝
    ██║  ██║█████╗  █████╗  █████╗  ███████║   ██║   
    ██║  ██║██╔══╝  ██╔══╝  ██╔══╝  ██╔══██║   ██║   
    ██████╔╝███████╗██║     ███████╗██║  ██║   ██║   
    ╚═════╝ ╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   
            `}
                    </Text>
                    <Text color="green" bold>💉 Humanity has developed a cure for {plague.name}! 💉</Text>
                </>
            )}

            <Box flexDirection="column" marginTop={2} borderStyle="single" paddingX={3} paddingY={1}>
                <Text bold>Final Statistics</Text>
                <Text>Days Elapsed: <Text color="yellow">{day}</Text></Text>
                <Text>Total Deaths: <Text color="red">{formatNumber(totalDead)}</Text></Text>
                <Text>World Population: <Text color="green">{formatNumber(totalPopulation - totalDead)}</Text></Text>
                <Text>Cure Progress: <Text color="cyan">{cureProgress.toFixed(1)}%</Text></Text>
            </Box>

            <Box marginTop={2}>
                <Text dimColor>Press Enter or 'R' to play again</Text>
            </Box>
        </Box>
    );
};

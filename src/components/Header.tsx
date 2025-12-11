import React from 'react';
import { Box, Text } from 'ink';
import { GameState } from '../types.js';

interface HeaderProps {
    state: GameState;
}

const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
        case 'easy': return 'green';
        case 'normal': return 'yellow';
        case 'hard': return 'red';
        default: return 'white';
    }
};

export const Header: React.FC<HeaderProps> = ({ state }) => {
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

    return (
        <Box flexDirection="column" borderStyle="double" borderColor="red" paddingX={1}>
            <Box justifyContent="space-between">
                <Text bold color="red">[*] {plague.name} [*]</Text>
                <Text>
                    Day: <Text color="yellow">{day}</Text>
                    {' | '}
                    <Text color="cyan">DNA: {dnaPoints}</Text>
                    {' | '}
                    Speed: <Text color="green">{speedIndicator}</Text>
                    {' | '}
                    <Text color={getDifficultyColor(difficulty)}>{difficulty.toUpperCase()}</Text>
                </Text>
            </Box>

            <Box marginTop={1} justifyContent="space-between">
                <Box>
                    <Text color="green">Healthy: {formatNumber(healthyCount)}</Text>
                    <Text> | </Text>
                    <Text color="yellow">Infected: {formatNumber(totalInfected)} ({infectedPercent}%)</Text>
                    <Text> | </Text>
                    <Text color="red">Dead: {formatNumber(totalDead)} ({deadPercent}%)</Text>
                </Box>
            </Box>

            <Box marginTop={1} justifyContent="space-between">
                <Box>
                    <Text>Cure: </Text>
                    <Text color={cureProgress > 50 ? 'red' : cureProgress > 25 ? 'yellow' : 'green'}>
                        [{cureBar}]
                    </Text>
                    <Text> {cureProgress.toFixed(1)}%</Text>
                </Box>
                <Box>
                    <Text>Visibility: </Text>
                    <Text color={visibility > 50 ? 'red' : visibility > 25 ? 'yellow' : 'green'}>
                        [{visBar}]
                    </Text>
                    <Text> {visibility.toFixed(1)}%</Text>
                </Box>
            </Box>

            <Box marginTop={1}>
                <Text dimColor>
                    INF: {plague.infectivity} | SEV: {plague.severity} | LTH: {plague.lethality}
                    {' | '}
                    Air: {plague.airborne} | Water: {plague.waterborne} | Insect: {plague.insectborne}
                    {' | '}
                    Cold: {plague.coldResistance} | Heat: {plague.heatResistance} | Drug: {plague.drugResistance}
                </Text>
            </Box>
        </Box>
    );
};

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

export const Header: React.FC<HeaderProps> = ({ state }) => {
    const { plague, day, dnaPoints, cureProgress, totalInfected, totalDead, totalPopulation, isPaused, gameSpeed } = state;

    const healthyCount = totalPopulation - totalInfected - totalDead;
    const infectedPercent = ((totalInfected / totalPopulation) * 100).toFixed(2);
    const deadPercent = ((totalDead / totalPopulation) * 100).toFixed(2);

    return (
        <Box flexDirection="column" borderStyle="double" borderColor="red" paddingX={1}>
            <Box justifyContent="space-between">
                <Text bold color="red">☣ {plague.name} ☣</Text>
                <Text>
                    Day: <Text color="yellow">{day}</Text>
                    {' | '}
                    <Text color="cyan">DNA: {dnaPoints}</Text>
                    {' | '}
                    Speed: <Text color="green">{isPaused ? 'PAUSED' : '▶'.repeat(gameSpeed)}</Text>
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
                <Box>
                    <Text>Cure: </Text>
                    <Text color={cureProgress > 50 ? 'red' : cureProgress > 25 ? 'yellow' : 'green'}>
                        {'█'.repeat(Math.floor(cureProgress / 5))}{'░'.repeat(20 - Math.floor(cureProgress / 5))}
                    </Text>
                    <Text> {cureProgress.toFixed(1)}%</Text>
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

import React from 'react';
import { Box, Text } from 'ink';
import { TransitEvent, Country } from '../types.js';

interface TransitPanelProps {
    transits: TransitEvent[];
    countries: Country[];
    currentDay: number;
}

const getTransitIcon = (type: 'air' | 'sea' | 'land'): string => {
    switch (type) {
        case 'air': return '[AIR]';
        case 'sea': return '[SEA]';
        case 'land': return '[LAND]';
    }
};

const getTransitColor = (type: 'air' | 'sea' | 'land'): string => {
    switch (type) {
        case 'air': return 'cyan';
        case 'sea': return 'blue';
        case 'land': return 'yellow';
    }
};

export const TransitPanel: React.FC<TransitPanelProps> = ({ transits, countries, currentDay }) => {
    const getCountryName = (id: string): string => {
        return countries.find(c => c.id === id)?.name || id;
    };

    // Get potential transit routes (countries with open ports/borders that could spread)
    const infectedCountries = countries.filter(c => c.infected > 0);
    const potentialRoutes: { from: string; to: string; type: 'air' | 'sea' | 'land'; chance: string }[] = [];

    for (const from of infectedCountries) {
        const infectedRatio = from.infected / from.population;
        if (infectedRatio < 0.001) continue; // Too few infected to spread

        for (const to of countries) {
            if (to.id === from.id || to.infected > 0) continue;

            // Check air routes
            if (from.airports && from.airportOpen && to.airports && to.airportOpen) {
                const chance = Math.min(99, Math.floor(infectedRatio * 100 * 1.5));
                if (chance > 0) {
                    potentialRoutes.push({ from: from.id, to: to.id, type: 'air', chance: `${chance}%` });
                }
            }

            // Check sea routes
            if (from.seaports && from.seaportOpen && to.seaports && to.seaportOpen) {
                const chance = Math.min(99, Math.floor(infectedRatio * 100 * 1.2));
                if (chance > 0 && !potentialRoutes.find(r => r.from === from.id && r.to === to.id)) {
                    potentialRoutes.push({ from: from.id, to: to.id, type: 'sea', chance: `${chance}%` });
                }
            }

            // Check land routes
            if (from.borders.includes(to.id) && from.isOpen && to.isOpen) {
                const chance = Math.min(99, Math.floor(infectedRatio * 100 * 2));
                if (chance > 0 && !potentialRoutes.find(r => r.from === from.id && r.to === to.id)) {
                    potentialRoutes.push({ from: from.id, to: to.id, type: 'land', chance: `${chance}%` });
                }
            }
        }
    }

    // Sort by chance descending
    potentialRoutes.sort((a, b) => parseInt(b.chance) - parseInt(a.chance));

    return (
        <Box flexDirection="column" borderStyle="single" borderColor="cyan" paddingX={1}>
            <Text bold color="cyan">Transit Routes</Text>

            <Box flexDirection="row" marginTop={1}>
                <Box flexDirection="column" width="50%">
                    <Text bold underline>Recent Infections</Text>
                    <Box flexDirection="column" height={8}>
                        {transits.length === 0 ? (
                            <Text dimColor>No recent transit infections</Text>
                        ) : (
                            transits.slice(-8).reverse().map((transit, idx) => (
                                <Text key={transit.id}>
                                    <Text color={getTransitColor(transit.type)}>{getTransitIcon(transit.type)}</Text>
                                    <Text> {getCountryName(transit.from)}</Text>
                                    <Text dimColor> -&gt; </Text>
                                    <Text color="red">{getCountryName(transit.to)}</Text>
                                    <Text dimColor> D{transit.day}</Text>
                                </Text>
                            ))
                        )}
                    </Box>
                </Box>

                <Box flexDirection="column" width="50%">
                    <Text bold underline>Potential Routes</Text>
                    <Box flexDirection="column" height={8}>
                        {potentialRoutes.length === 0 ? (
                            <Text dimColor>No potential routes</Text>
                        ) : (
                            potentialRoutes.slice(0, 8).map((route, idx) => (
                                <Text key={`${route.from}-${route.to}`}>
                                    <Text color={getTransitColor(route.type)}>{getTransitIcon(route.type)}</Text>
                                    <Text> {getCountryName(route.from)}</Text>
                                    <Text dimColor> -&gt; </Text>
                                    <Text>{getCountryName(route.to)}</Text>
                                    <Text color="yellow"> {route.chance}</Text>
                                </Text>
                            ))
                        )}
                    </Box>
                </Box>
            </Box>

            <Box marginTop={1}>
                <Text dimColor>
                    <Text color="cyan">[AIR]</Text> Air |
                    <Text color="blue"> [SEA]</Text> Sea |
                    <Text color="yellow"> [LAND]</Text> Land
                </Text>
            </Box>
        </Box>
    );
};

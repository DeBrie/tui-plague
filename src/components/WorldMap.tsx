import React from 'react';
import { Box, Text } from 'ink';
import { Country } from '../types.js';

interface WorldMapProps {
    countries: Country[];
    selectedCountry: string | null;
    onSelectCountry: (id: string) => void;
}

const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
};

const getCountryColor = (country: Country): string => {
    if (country.infected === 0 && country.dead === 0) return 'green';

    const infectedRatio = country.infected / country.population;
    const deadRatio = country.dead / country.population;

    if (deadRatio > 0.5) return 'gray';
    if (deadRatio > 0.1) return 'red';
    if (infectedRatio > 0.5) return 'redBright';
    if (infectedRatio > 0.1) return 'yellow';
    if (infectedRatio > 0.01) return 'yellowBright';
    return 'greenBright';
};

const getStatusIcon = (country: Country): string => {
    const icons: string[] = [];
    if (!country.isOpen) icons.push('🚫');
    if (!country.airportOpen && country.airports) icons.push('✈️');
    if (!country.seaportOpen && country.seaports) icons.push('🚢');
    if (country.awareness > 50) icons.push('👁️');
    return icons.join('') || '';
};

export const WorldMap: React.FC<WorldMapProps> = ({ countries, selectedCountry, onSelectCountry }) => {
    // Group countries by region for display
    const regions = {
        'North America': countries.filter(c => ['usa', 'canada', 'mexico', 'greenland'].includes(c.id)),
        'South America': countries.filter(c => ['brazil', 'argentina'].includes(c.id)),
        'Europe': countries.filter(c => ['uk', 'france', 'germany', 'spain', 'italy', 'poland', 'iceland'].includes(c.id)),
        'Africa': countries.filter(c => ['egypt', 'morocco', 'southafrica', 'madagascar'].includes(c.id)),
        'Asia': countries.filter(c => ['russia', 'china', 'india', 'japan', 'saudi', 'pakistan'].includes(c.id)),
        'Oceania': countries.filter(c => ['australia', 'indonesia'].includes(c.id)),
    };

    return (
        <Box flexDirection="column" borderStyle="single" borderColor="blue" paddingX={1}>
            <Text bold color="blue">🌍 World Map</Text>
            <Box flexDirection="row" flexWrap="wrap" marginTop={1}>
                {Object.entries(regions).map(([region, regionCountries]) => (
                    <Box key={region} flexDirection="column" marginRight={2} marginBottom={1} width={30}>
                        <Text bold underline>{region}</Text>
                        {regionCountries.map(country => {
                            const color = getCountryColor(country);
                            const isSelected = country.id === selectedCountry;
                            const infectedPct = ((country.infected / country.population) * 100).toFixed(1);
                            const deadPct = ((country.dead / country.population) * 100).toFixed(1);

                            return (
                                <Box key={country.id} flexDirection="column">
                                    <Text
                                        color={color}
                                        inverse={isSelected}
                                    >
                                        {country.name} {getStatusIcon(country)}
                                    </Text>
                                    <Text dimColor>
                                        {' '}↳ I:{formatNumber(country.infected)}({infectedPct}%) D:{formatNumber(country.dead)}({deadPct}%)
                                    </Text>
                                </Box>
                            );
                        })}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

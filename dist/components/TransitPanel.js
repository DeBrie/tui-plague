import React from 'react';
import { Box, Text } from 'ink';
const getTransitIcon = (type) => {
    switch (type) {
        case 'air': return '[AIR]';
        case 'sea': return '[SEA]';
        case 'land': return '[LAND]';
    }
};
const getTransitColor = (type) => {
    switch (type) {
        case 'air': return 'cyan';
        case 'sea': return 'blue';
        case 'land': return 'yellow';
    }
};
export const TransitPanel = ({ transits, countries, currentDay }) => {
    const getCountryName = (id) => {
        return countries.find(c => c.id === id)?.name || id;
    };
    // Get potential transit routes (countries with open ports/borders that could spread)
    const infectedCountries = countries.filter(c => c.infected > 0);
    const potentialRoutes = [];
    for (const from of infectedCountries) {
        const infectedRatio = from.infected / from.population;
        if (infectedRatio < 0.001)
            continue; // Too few infected to spread
        for (const to of countries) {
            if (to.id === from.id || to.infected > 0)
                continue;
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
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "single", borderColor: "cyan", paddingX: 1 },
        React.createElement(Text, { bold: true, color: "cyan" }, "Transit Routes"),
        React.createElement(Box, { flexDirection: "row", marginTop: 1 },
            React.createElement(Box, { flexDirection: "column", width: "50%" },
                React.createElement(Text, { bold: true, underline: true }, "Recent Infections"),
                React.createElement(Box, { flexDirection: "column", height: 8 }, transits.length === 0 ? (React.createElement(Text, { dimColor: true }, "No recent transit infections")) : (transits.slice(-8).reverse().map((transit, idx) => (React.createElement(Text, { key: transit.id },
                    React.createElement(Text, { color: getTransitColor(transit.type) }, getTransitIcon(transit.type)),
                    React.createElement(Text, null,
                        " ",
                        getCountryName(transit.from)),
                    React.createElement(Text, { dimColor: true }, " -> "),
                    React.createElement(Text, { color: "red" }, getCountryName(transit.to)),
                    React.createElement(Text, { dimColor: true },
                        " D",
                        transit.day))))))),
            React.createElement(Box, { flexDirection: "column", width: "50%" },
                React.createElement(Text, { bold: true, underline: true }, "Potential Routes"),
                React.createElement(Box, { flexDirection: "column", height: 8 }, potentialRoutes.length === 0 ? (React.createElement(Text, { dimColor: true }, "No potential routes")) : (potentialRoutes.slice(0, 8).map((route, idx) => (React.createElement(Text, { key: `${route.from}-${route.to}` },
                    React.createElement(Text, { color: getTransitColor(route.type) }, getTransitIcon(route.type)),
                    React.createElement(Text, null,
                        " ",
                        getCountryName(route.from)),
                    React.createElement(Text, { dimColor: true }, " -> "),
                    React.createElement(Text, null, getCountryName(route.to)),
                    React.createElement(Text, { color: "yellow" },
                        " ",
                        route.chance)))))))),
        React.createElement(Box, { marginTop: 1 },
            React.createElement(Text, { dimColor: true },
                React.createElement(Text, { color: "cyan" }, "[AIR]"),
                " Air |",
                React.createElement(Text, { color: "blue" }, " [SEA]"),
                " Sea |",
                React.createElement(Text, { color: "yellow" }, " [LAND]"),
                " Land"))));
};

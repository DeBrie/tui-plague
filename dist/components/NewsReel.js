import React from 'react';
import { Box, Text } from 'ink';
const getNewsColor = (type) => {
    switch (type) {
        case 'first_case':
        case 'spread_to_country':
            return 'yellow';
        case 'deaths_start':
        case 'mass_deaths':
        case 'country_devastated':
            return 'red';
        case 'border_closed':
        case 'airport_closed':
        case 'seaport_closed':
            return 'magenta';
        case 'cure_started':
        case 'cure_progress':
        case 'research':
            return 'cyan';
        case 'awareness':
        case 'panic':
            return 'yellow';
        case 'symptom_noticed':
        case 'mutation':
            return 'green';
        case 'general':
        default:
            return 'white';
    }
};
const getNewsIcon = (type) => {
    switch (type) {
        case 'first_case':
            return '[!]';
        case 'spread_to_country':
            return '[+]';
        case 'deaths_start':
        case 'mass_deaths':
            return '[X]';
        case 'country_devastated':
            return '[!!!]';
        case 'border_closed':
            return '[BORDER]';
        case 'airport_closed':
            return '[AIR]';
        case 'seaport_closed':
            return '[SEA]';
        case 'cure_started':
        case 'cure_progress':
            return '[CURE]';
        case 'awareness':
        case 'panic':
            return '[ALERT]';
        case 'research':
            return '[LAB]';
        case 'symptom_noticed':
        case 'mutation':
            return '[BIO]';
        case 'general':
        default:
            return '[NEWS]';
    }
};
export const NewsReel = ({ newsItems, maxItems = 8 }) => {
    // Sort by day descending, then by priority descending
    const sortedNews = [...newsItems]
        .sort((a, b) => {
        if (b.day !== a.day)
            return b.day - a.day;
        return b.priority - a.priority;
    })
        .slice(0, maxItems);
    return (React.createElement(Box, { flexDirection: "column", borderStyle: "single", borderColor: "yellow", paddingX: 1 },
        React.createElement(Text, { bold: true, color: "yellow" }, "[NEWS TICKER]"),
        React.createElement(Box, { flexDirection: "column", marginTop: 1, height: maxItems }, sortedNews.length === 0 ? (React.createElement(Text, { dimColor: true }, "No news yet...")) : (sortedNews.map((item, idx) => (React.createElement(Box, { key: item.id, flexDirection: "row" },
            React.createElement(Text, { dimColor: true },
                "D",
                item.day.toString().padStart(3, '0'),
                " "),
            React.createElement(Text, { color: getNewsColor(item.type) },
                getNewsIcon(item.type),
                " "),
            React.createElement(Text, { color: getNewsColor(item.type), wrap: "truncate" }, item.headline))))))));
};

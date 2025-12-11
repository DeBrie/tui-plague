import React from 'react';
import { Box, Text } from 'ink';
import { NewsItem, NewsType } from '../types.js';

interface NewsReelProps {
    newsItems: NewsItem[];
    maxItems?: number;
}

const getNewsColor = (type: NewsType): string => {
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

const getNewsIcon = (type: NewsType): string => {
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

export const NewsReel: React.FC<NewsReelProps> = ({ newsItems, maxItems = 8 }) => {
    // Sort by day descending, then by priority descending
    const sortedNews = [...newsItems]
        .sort((a, b) => {
            if (b.day !== a.day) return b.day - a.day;
            return b.priority - a.priority;
        })
        .slice(0, maxItems);

    return (
        <Box flexDirection="column" borderStyle="single" borderColor="yellow" paddingX={1}>
            <Text bold color="yellow">[NEWS TICKER]</Text>

            <Box flexDirection="column" marginTop={1} height={maxItems}>
                {sortedNews.length === 0 ? (
                    <Text dimColor>No news yet...</Text>
                ) : (
                    sortedNews.map((item, idx) => (
                        <Box key={item.id} flexDirection="row">
                            <Text dimColor>D{item.day.toString().padStart(3, '0')} </Text>
                            <Text color={getNewsColor(item.type)}>{getNewsIcon(item.type)} </Text>
                            <Text color={getNewsColor(item.type)} wrap="truncate">
                                {item.headline}
                            </Text>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

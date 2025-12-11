import React from 'react';
import { Box, Text } from 'ink';

export const HelpPanel: React.FC = () => {
    return (
        <Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1}>
            <Text bold color="gray">Controls</Text>
            <Box flexDirection="row" justifyContent="space-between">
                <Box flexDirection="column">
                    <Text dimColor>Space: Pause/Resume</Text>
                    <Text dimColor>+/-: Change speed</Text>
                    <Text dimColor>Tab: Switch panels</Text>
                </Box>
                <Box flexDirection="column">
                    <Text dimColor>1-3: Disease sub-tabs</Text>
                    <Text dimColor>↑↓: Navigate</Text>
                    <Text dimColor>Enter: Select/Evolve</Text>
                </Box>
                <Box flexDirection="column">
                    <Text dimColor>Q: Quit game</Text>
                </Box>
            </Box>
        </Box>
    );
};

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
                    <Text dimColor>1-4: Disease sub-tabs</Text>
                    <Text dimColor>Up/Down: Navigate</Text>
                    <Text dimColor>Enter: Select/Evolve</Text>
                </Box>
                <Box flexDirection="column">
                    <Text dimColor>T: Toggle transits</Text>
                    <Text dimColor>Esc: Quit game</Text>
                </Box>
            </Box>
            <Box marginTop={1}>
                <Text dimColor>Legend: [X]=Borders Closed [A]=Airport Closed [S]=Seaport Closed [!]=High Awareness</Text>
            </Box>
        </Box>
    );
};

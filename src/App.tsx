import React, { useState, useEffect, useCallback } from 'react';
import { Box, useApp, useInput } from 'ink';
import { GameState } from './types.js';
import {
    createInitialState,
    gameTick,
    startGame,
    evolveSymptom,
    evolveTransmission,
    evolveAbility,
    getSymptoms,
    getTransmissions,
    getAbilities,
} from './engine/gameEngine.js';
import { Header } from './components/Header.js';
import { WorldMap } from './components/WorldMap.js';
import { DiseasePanel } from './components/DiseasePanel.js';
import { StartScreen } from './components/StartScreen.js';
import { GameOverScreen } from './components/GameOverScreen.js';
import { HelpPanel } from './components/HelpPanel.js';

type ActivePanel = 'world' | 'disease';

export const App: React.FC = () => {
    const { exit } = useApp();
    const [gameState, setGameState] = useState<GameState>(createInitialState);
    const [activePanel, setActivePanel] = useState<ActivePanel>('disease');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    // Game tick loop
    useEffect(() => {
        if (!gameState.gameStarted || gameState.isPaused || gameState.gameOver) {
            return;
        }

        const tickInterval = 1000 / gameState.gameSpeed;
        const timer = setInterval(() => {
            setGameState(prev => gameTick(prev));
        }, tickInterval);

        return () => clearInterval(timer);
    }, [gameState.gameStarted, gameState.isPaused, gameState.gameOver, gameState.gameSpeed]);

    // Handle game start
    const handleStart = useCallback((countryId: string, plagueName: string) => {
        setGameState(prev => startGame(prev, countryId, plagueName));
    }, []);

    // Handle restart
    const handleRestart = useCallback(() => {
        setGameState(createInitialState());
    }, []);

    // Handle evolving
    const handleEvolveSymptom = useCallback((id: string) => {
        setGameState(prev => evolveSymptom(prev, id));
    }, []);

    const handleEvolveTransmission = useCallback((id: string) => {
        setGameState(prev => evolveTransmission(prev, id));
    }, []);

    const handleEvolveAbility = useCallback((id: string) => {
        setGameState(prev => evolveAbility(prev, id));
    }, []);

    // Global input handling
    useInput((input, key) => {
        // Quit game
        if (input === 'q' || input === 'Q') {
            exit();
            return;
        }

        // Only handle these when game is running
        if (!gameState.gameStarted || gameState.gameOver) return;

        // Pause/Resume
        if (input === ' ') {
            setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
        }

        // Speed control
        if (input === '+' || input === '=') {
            setGameState(prev => ({ ...prev, gameSpeed: Math.min(3, prev.gameSpeed + 1) }));
        }
        if (input === '-') {
            setGameState(prev => ({ ...prev, gameSpeed: Math.max(1, prev.gameSpeed - 1) }));
        }

        // Tab switching
        if (key.tab) {
            setActivePanel(prev => prev === 'world' ? 'disease' : 'world');
        }
    });

    // Show start screen
    if (!gameState.gameStarted) {
        return <StartScreen countries={gameState.countries} onStart={handleStart} />;
    }

    // Show game over screen
    if (gameState.gameOver) {
        return <GameOverScreen state={gameState} onRestart={handleRestart} />;
    }

    // Main game view
    return (
        <Box flexDirection="column">
            <Header state={gameState} />

            <Box flexDirection="row" marginTop={1}>
                <Box flexDirection="column" width="60%">
                    <WorldMap
                        countries={gameState.countries}
                        selectedCountry={selectedCountry}
                        onSelectCountry={setSelectedCountry}
                    />
                </Box>

                <Box flexDirection="column" width="40%">
                    <DiseasePanel
                        symptoms={getSymptoms()}
                        transmissions={getTransmissions()}
                        abilities={getAbilities()}
                        dnaPoints={gameState.dnaPoints}
                        onEvolveSymptom={handleEvolveSymptom}
                        onEvolveTransmission={handleEvolveTransmission}
                        onEvolveAbility={handleEvolveAbility}
                        isActive={activePanel === 'disease'}
                    />
                </Box>
            </Box>

            <HelpPanel />
        </Box>
    );
};

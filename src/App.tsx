import React, { useState, useEffect, useCallback } from 'react';
import { Box, useApp, useInput } from 'ink';
import { GameState, Difficulty } from './types.js';
import {
    createInitialState,
    gameTick,
    startGame,
    evolveSymptom,
    evolveTransmission,
    evolveAbility,
    evolveSpecialAbility,
    getSymptoms,
    getTransmissions,
    getAbilities,
    getSpecialAbilities,
} from './engine/gameEngine.js';
import { Header } from './components/Header.js';
import { WorldMap } from './components/WorldMap.js';
import { DiseasePanel } from './components/DiseasePanel.js';
import { StartScreen } from './components/StartScreen.js';
import { GameOverScreen } from './components/GameOverScreen.js';
import { HelpPanel } from './components/HelpPanel.js';
import { TransitPanel } from './components/TransitPanel.js';
import { NewsReel } from './components/NewsReel.js';

type ActivePanel = 'world' | 'disease';

export const App: React.FC = () => {
    const { exit } = useApp();
    const [gameState, setGameState] = useState<GameState>(() => createInitialState('normal'));
    const [activePanel, setActivePanel] = useState<ActivePanel>('disease');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [showTransits, setShowTransits] = useState(true);

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
    const handleStart = useCallback((countryId: string, plagueName: string, difficulty: Difficulty) => {
        setGameState(prev => {
            const newState = createInitialState(difficulty);
            return startGame(newState, countryId, plagueName);
        });
    }, []);

    // Handle restart
    const handleRestart = useCallback(() => {
        setGameState(createInitialState('normal'));
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

    const handleEvolveSpecial = useCallback((id: string) => {
        setGameState(prev => evolveSpecialAbility(prev, id));
    }, []);

    // Global input handling
    useInput((input, key) => {
        // Quit game (only when game is running, not during name input)
        if (key.escape && gameState.gameStarted) {
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

        // Toggle transit panel
        if (input === 't' || input === 'T') {
            setShowTransits(prev => !prev);
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
                    {showTransits && (
                        <TransitPanel
                            transits={gameState.recentTransits}
                            countries={gameState.countries}
                            currentDay={gameState.day}
                        />
                    )}
                </Box>

                <Box flexDirection="column" width="40%">
                    <DiseasePanel
                        symptoms={getSymptoms()}
                        transmissions={getTransmissions()}
                        abilities={getAbilities()}
                        specialAbilities={getSpecialAbilities()}
                        dnaPoints={gameState.dnaPoints}
                        onEvolveSymptom={handleEvolveSymptom}
                        onEvolveTransmission={handleEvolveTransmission}
                        onEvolveAbility={handleEvolveAbility}
                        onEvolveSpecial={handleEvolveSpecial}
                        isActive={activePanel === 'disease'}
                    />
                    <NewsReel newsItems={gameState.newsItems} maxItems={6} />
                </Box>
            </Box>

            <HelpPanel />
        </Box>
    );
};

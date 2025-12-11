import React, { useState, useEffect, useCallback } from 'react';
import { Box, useApp, useInput } from 'ink';
import { createInitialState, gameTick, startGame, evolveSymptom, evolveTransmission, evolveAbility, getSymptoms, getTransmissions, getAbilities, } from './engine/gameEngine.js';
import { Header } from './components/Header.js';
import { WorldMap } from './components/WorldMap.js';
import { DiseasePanel } from './components/DiseasePanel.js';
import { StartScreen } from './components/StartScreen.js';
import { GameOverScreen } from './components/GameOverScreen.js';
import { HelpPanel } from './components/HelpPanel.js';
import { TransitPanel } from './components/TransitPanel.js';
import { NewsReel } from './components/NewsReel.js';
export const App = () => {
    const { exit } = useApp();
    const [gameState, setGameState] = useState(() => createInitialState('normal'));
    const [activePanel, setActivePanel] = useState('disease');
    const [selectedCountry, setSelectedCountry] = useState(null);
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
    const handleStart = useCallback((countryId, plagueName, difficulty) => {
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
    const handleEvolveSymptom = useCallback((id) => {
        setGameState(prev => evolveSymptom(prev, id));
    }, []);
    const handleEvolveTransmission = useCallback((id) => {
        setGameState(prev => evolveTransmission(prev, id));
    }, []);
    const handleEvolveAbility = useCallback((id) => {
        setGameState(prev => evolveAbility(prev, id));
    }, []);
    // Global input handling
    useInput((input, key) => {
        // Quit game (only when game is running, not during name input)
        if (key.escape && gameState.gameStarted) {
            exit();
            return;
        }
        // Only handle these when game is running
        if (!gameState.gameStarted || gameState.gameOver)
            return;
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
        return React.createElement(StartScreen, { countries: gameState.countries, onStart: handleStart });
    }
    // Show game over screen
    if (gameState.gameOver) {
        return React.createElement(GameOverScreen, { state: gameState, onRestart: handleRestart });
    }
    // Main game view
    return (React.createElement(Box, { flexDirection: "column" },
        React.createElement(Header, { state: gameState }),
        React.createElement(Box, { flexDirection: "row", marginTop: 1 },
            React.createElement(Box, { flexDirection: "column", width: "60%" },
                React.createElement(WorldMap, { countries: gameState.countries, selectedCountry: selectedCountry, onSelectCountry: setSelectedCountry }),
                showTransits && (React.createElement(TransitPanel, { transits: gameState.recentTransits, countries: gameState.countries, currentDay: gameState.day }))),
            React.createElement(Box, { flexDirection: "column", width: "40%" },
                React.createElement(DiseasePanel, { symptoms: getSymptoms(), transmissions: getTransmissions(), abilities: getAbilities(), dnaPoints: gameState.dnaPoints, onEvolveSymptom: handleEvolveSymptom, onEvolveTransmission: handleEvolveTransmission, onEvolveAbility: handleEvolveAbility, isActive: activePanel === 'disease' }),
                React.createElement(NewsReel, { newsItems: gameState.newsItems, maxItems: 6 }))),
        React.createElement(HelpPanel, null)));
};

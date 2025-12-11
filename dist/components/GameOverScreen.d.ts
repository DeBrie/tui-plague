import React from 'react';
import { GameState } from '../types.js';
interface GameOverScreenProps {
    state: GameState;
    onRestart: () => void;
}
export declare const GameOverScreen: React.FC<GameOverScreenProps>;
export {};

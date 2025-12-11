import React from 'react';
import { Country, Difficulty } from '../types.js';
interface StartScreenProps {
    countries: Country[];
    onStart: (countryId: string, plagueName: string, difficulty: Difficulty) => void;
}
export declare const StartScreen: React.FC<StartScreenProps>;
export {};

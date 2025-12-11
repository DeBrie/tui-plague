import React from 'react';
import { Country } from '../types.js';
interface StartScreenProps {
    countries: Country[];
    onStart: (countryId: string, plagueName: string) => void;
}
export declare const StartScreen: React.FC<StartScreenProps>;
export {};

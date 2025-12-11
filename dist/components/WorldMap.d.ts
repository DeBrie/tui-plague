import React from 'react';
import { Country } from '../types.js';
interface WorldMapProps {
    countries: Country[];
    selectedCountry: string | null;
    onSelectCountry: (id: string) => void;
}
export declare const WorldMap: React.FC<WorldMapProps>;
export {};

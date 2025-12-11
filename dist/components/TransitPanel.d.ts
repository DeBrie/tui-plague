import React from 'react';
import { TransitEvent, Country } from '../types.js';
interface TransitPanelProps {
    transits: TransitEvent[];
    countries: Country[];
    currentDay: number;
}
export declare const TransitPanel: React.FC<TransitPanelProps>;
export {};

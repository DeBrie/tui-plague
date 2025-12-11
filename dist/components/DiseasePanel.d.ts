import React from 'react';
import { Symptom, Transmission, Ability, SpecialAbility } from '../types.js';
interface DiseasePanelProps {
    symptoms: Symptom[];
    transmissions: Transmission[];
    abilities: Ability[];
    specialAbilities: SpecialAbility[];
    dnaPoints: number;
    onEvolveSymptom: (id: string) => void;
    onEvolveTransmission: (id: string) => void;
    onEvolveAbility: (id: string) => void;
    onEvolveSpecial: (id: string) => void;
    isActive: boolean;
}
export declare const DiseasePanel: React.FC<DiseasePanelProps>;
export {};

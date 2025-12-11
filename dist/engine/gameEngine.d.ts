import { GameState, Symptom, Transmission, Ability, Difficulty, SpecialAbility } from "../types.js";
export declare const getSymptoms: () => Symptom[];
export declare const getTransmissions: () => Transmission[];
export declare const getAbilities: () => Ability[];
export declare const getSpecialAbilities: () => SpecialAbility[];
export interface DifficultySettings {
    cureSpeedMultiplier: number;
    awarenessMultiplier: number;
    startingDna: number;
    dnaGainMultiplier: number;
    borderCloseChance: number;
}
export declare const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings>;
export declare const createInitialState: (difficulty?: Difficulty) => GameState;
export declare const gameTick: (state: GameState) => GameState;
export declare const evolveSymptom: (state: GameState, symptomId: string) => GameState;
export declare const evolveTransmission: (state: GameState, transmissionId: string) => GameState;
export declare const evolveAbility: (state: GameState, abilityId: string) => GameState;
export declare const evolveSpecialAbility: (state: GameState, abilityId: string) => GameState;
export declare const startGame: (state: GameState, countryId: string, plagueName: string) => GameState;

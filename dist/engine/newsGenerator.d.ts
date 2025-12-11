import { GameState, NewsItem } from "../types.js";
export declare const resetNewsTracker: () => void;
export declare const generateNews: (prevState: GameState, newState: GameState) => NewsItem[];

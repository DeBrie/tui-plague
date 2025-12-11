export interface Country {
    id: string;
    name: string;
    population: number;
    infected: number;
    dead: number;
    healthy: number;
    climate: "hot" | "cold" | "temperate";
    wealth: "rich" | "poor" | "average";
    density: "urban" | "rural" | "mixed";
    borders: string[];
    airports: boolean;
    seaports: boolean;
    isOpen: boolean;
    airportOpen: boolean;
    seaportOpen: boolean;
    awareness: number;
    cureContribution: number;
}
export interface Plague {
    name: string;
    infectivity: number;
    severity: number;
    lethality: number;
    airborne: number;
    waterborne: number;
    insectborne: number;
    bloodborne: number;
    coldResistance: number;
    heatResistance: number;
    drugResistance: number;
    symptoms: Symptom[];
    cureSlowdown: number;
    visibilityReduction: number;
    borderBypass: number;
    airportBypass: number;
    seaportBypass: number;
}
export interface Symptom {
    id: string;
    name: string;
    description: string;
    cost: number;
    infectivityBonus: number;
    severityBonus: number;
    lethalityBonus: number;
    unlocked: boolean;
    requires?: string[];
}
export interface Transmission {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: "air" | "water" | "insect" | "blood";
    level: number;
    unlocked: boolean;
}
export interface Ability {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: "cold" | "heat" | "drug";
    level: number;
    unlocked: boolean;
}
export interface SpecialAbility {
    id: string;
    name: string;
    description: string;
    cost: number;
    category: "stealth" | "mutation" | "resilience" | "spread" | "lethal";
    effect: {
        type: string;
        value: number;
    };
    unlocked: boolean;
    repeatable: boolean;
    timesPurchased: number;
    maxPurchases: number;
}
export type Difficulty = "easy" | "normal" | "hard";
export interface TransitEvent {
    id: string;
    from: string;
    to: string;
    type: "air" | "sea" | "land";
    day: number;
    infected: number;
}
export type NewsType = "first_case" | "spread_to_country" | "deaths_start" | "mass_deaths" | "border_closed" | "airport_closed" | "seaport_closed" | "cure_started" | "cure_progress" | "awareness" | "symptom_noticed" | "country_devastated" | "panic" | "research" | "mutation" | "general";
export interface NewsItem {
    id: string;
    day: number;
    type: NewsType;
    headline: string;
    priority: number;
}
export interface GameState {
    plague: Plague;
    countries: Country[];
    dnaPoints: number;
    day: number;
    gameSpeed: number;
    isPaused: boolean;
    cureProgress: number;
    totalInfected: number;
    totalDead: number;
    totalPopulation: number;
    gameOver: boolean;
    victory: boolean;
    startingCountry: string | null;
    gameStarted: boolean;
    selectedTab: "world" | "disease" | "abilities";
    difficulty: Difficulty;
    visibility: number;
    recentTransits: TransitEvent[];
    newsItems: NewsItem[];
}
export type GameAction = {
    type: "START_GAME";
    countryId: string;
    plagueName: string;
} | {
    type: "TICK";
} | {
    type: "TOGGLE_PAUSE";
} | {
    type: "SET_SPEED";
    speed: number;
} | {
    type: "EVOLVE_SYMPTOM";
    symptomId: string;
} | {
    type: "EVOLVE_TRANSMISSION";
    transmissionId: string;
} | {
    type: "EVOLVE_ABILITY";
    abilityId: string;
} | {
    type: "SET_TAB";
    tab: "world" | "disease" | "abilities";
};

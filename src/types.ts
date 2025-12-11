// Game types and interfaces

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
  borders: string[]; // IDs of neighboring countries
  airports: boolean;
  seaports: boolean;
  isOpen: boolean; // borders open
  airportOpen: boolean;
  seaportOpen: boolean;
  awareness: number; // 0-100, affects spread and cure research
  cureContribution: number; // contribution to global cure
}

export interface Plague {
  name: string;
  infectivity: number; // 0-100, how easily it spreads
  severity: number; // 0-100, how sick people get
  lethality: number; // 0-100, how deadly it is

  // Transmission traits
  airborne: number; // 0-5 levels
  waterborne: number;
  insectborne: number;
  bloodborne: number;

  // Resistance traits
  coldResistance: number; // 0-5
  heatResistance: number;
  drugResistance: number;

  // Symptoms (each adds to severity/lethality/infectivity)
  symptoms: Symptom[];

  // Special modifiers from abilities
  cureSlowdown: number; // 0-1, reduces cure speed
  visibilityReduction: number; // flat reduction to visibility
  borderBypass: number; // chance to bypass closed borders
  airportBypass: number; // chance to bypass closed airports
  seaportBypass: number; // chance to bypass closed seaports
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
  requires?: string[]; // prerequisite symptom IDs
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

export type NewsType =
  | "first_case"
  | "spread_to_country"
  | "deaths_start"
  | "mass_deaths"
  | "border_closed"
  | "airport_closed"
  | "seaport_closed"
  | "cure_started"
  | "cure_progress"
  | "awareness"
  | "symptom_noticed"
  | "country_devastated"
  | "panic"
  | "research"
  | "mutation"
  | "general";

export interface NewsItem {
  id: string;
  day: number;
  type: NewsType;
  headline: string;
  priority: number; // higher = more important
}

export interface GameState {
  plague: Plague;
  countries: Country[];
  dnaPoints: number;
  day: number;
  gameSpeed: number; // 1-3
  isPaused: boolean;
  cureProgress: number; // 0-100
  totalInfected: number;
  totalDead: number;
  totalPopulation: number;
  gameOver: boolean;
  victory: boolean; // true = everyone dead, false = cure completed
  startingCountry: string | null;
  gameStarted: boolean;
  selectedTab: "world" | "disease" | "abilities";
  difficulty: Difficulty;
  visibility: number; // 0-100, how noticeable the disease is globally
  recentTransits: TransitEvent[]; // recent transit events for visualization
  newsItems: NewsItem[]; // news headlines
}

export type GameAction =
  | { type: "START_GAME"; countryId: string; plagueName: string }
  | { type: "TICK" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "SET_SPEED"; speed: number }
  | { type: "EVOLVE_SYMPTOM"; symptomId: string }
  | { type: "EVOLVE_TRANSMISSION"; transmissionId: string }
  | { type: "EVOLVE_ABILITY"; abilityId: string }
  | { type: "SET_TAB"; tab: "world" | "disease" | "abilities" };

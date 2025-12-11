import {
  GameState,
  Country,
  Plague,
  Symptom,
  Transmission,
  Ability,
} from "../types.js";
import { createCountries } from "../data/countries.js";
import { createSymptoms } from "../data/symptoms.js";
import { createTransmissions } from "../data/transmissions.js";
import { createAbilities } from "../data/abilities.js";

// Store upgrades separately from game state
let symptoms: Symptom[] = [];
let transmissions: Transmission[] = [];
let abilities: Ability[] = [];

export const getSymptoms = () => symptoms;
export const getTransmissions = () => transmissions;
export const getAbilities = () => abilities;

export const createInitialState = (): GameState => {
  const countries = createCountries();
  symptoms = createSymptoms();
  transmissions = createTransmissions();
  abilities = createAbilities();

  const totalPopulation = countries.reduce((sum, c) => sum + c.population, 0);

  return {
    plague: {
      name: "Unknown Pathogen",
      infectivity: 5,
      severity: 1,
      lethality: 0,
      airborne: 0,
      waterborne: 0,
      insectborne: 0,
      bloodborne: 0,
      coldResistance: 0,
      heatResistance: 0,
      drugResistance: 0,
      symptoms: [],
    },
    countries,
    dnaPoints: 0,
    day: 0,
    gameSpeed: 1,
    isPaused: true,
    cureProgress: 0,
    totalInfected: 0,
    totalDead: 0,
    totalPopulation,
    gameOver: false,
    victory: false,
    startingCountry: null,
    gameStarted: false,
    selectedTab: "world",
  };
};

// Calculate infection spread rate for a country
const calculateSpreadRate = (country: Country, plague: Plague): number => {
  let rate = plague.infectivity / 100;

  // Climate modifiers
  if (country.climate === "cold") {
    rate *= 0.5 + plague.coldResistance * 0.2;
  } else if (country.climate === "hot") {
    rate *= 0.5 + plague.heatResistance * 0.2;
  }

  // Wealth affects spread (rich countries have better healthcare)
  if (country.wealth === "rich") {
    rate *= 0.7 - plague.drugResistance * 0.1;
  } else if (country.wealth === "poor") {
    rate *= 1.3;
  }

  // Density affects spread
  if (country.density === "urban") {
    rate *= 1.4;
  } else if (country.density === "rural") {
    rate *= 0.7;
  }

  // Awareness reduces spread
  rate *= 1 - country.awareness / 200;

  return Math.max(0.001, Math.min(rate, 0.5));
};

// Calculate death rate for a country
const calculateDeathRate = (country: Country, plague: Plague): number => {
  let rate = plague.lethality / 1000;

  // Rich countries have better survival rates
  if (country.wealth === "rich") {
    rate *= 0.5 - plague.drugResistance * 0.05;
  } else if (country.wealth === "poor") {
    rate *= 1.5;
  }

  return Math.max(0, Math.min(rate, 0.1));
};

// Check if infection can spread to a country
const canSpreadTo = (
  from: Country,
  to: Country,
  plague: Plague,
  countries: Country[]
): boolean => {
  if (to.infected > 0) return true; // Already infected
  if (!to.isOpen && !from.borders.includes(to.id)) return false;

  // Check land borders
  if (from.borders.includes(to.id) && from.isOpen && to.isOpen) {
    return true;
  }

  // Check air travel
  if (from.airports && from.airportOpen && to.airports && to.airportOpen) {
    if (plague.airborne >= 1) return true;
  }

  // Check sea travel
  if (from.seaports && from.seaportOpen && to.seaports && to.seaportOpen) {
    if (plague.waterborne >= 1) return true;
  }

  return false;
};

// Spread infection between countries
const spreadBetweenCountries = (state: GameState): Country[] => {
  const { countries, plague } = state;
  const updatedCountries = [...countries];

  for (const country of countries) {
    if (country.infected === 0) continue;

    // Try to spread to connected countries
    for (const other of countries) {
      if (other.id === country.id) continue;
      if (other.infected > 0) continue;

      if (canSpreadTo(country, other, plague, countries)) {
        // Calculate spread chance based on infected population
        const infectedRatio = country.infected / country.population;
        let spreadChance = infectedRatio * 0.1;

        // Transmission bonuses
        if (country.borders.includes(other.id)) {
          spreadChance *= 1.5;
        }
        if (plague.airborne > 0 && country.airports && other.airports) {
          spreadChance *= 1 + plague.airborne * 0.3;
        }
        if (plague.waterborne > 0 && country.seaports && other.seaports) {
          spreadChance *= 1 + plague.waterborne * 0.3;
        }
        if (
          plague.insectborne > 0 &&
          (country.climate === "hot" || other.climate === "hot")
        ) {
          spreadChance *= 1 + plague.insectborne * 0.2;
        }

        if (Math.random() < spreadChance) {
          const idx = updatedCountries.findIndex((c) => c.id === other.id);
          const initialInfected = Math.max(1, Math.floor(Math.random() * 10));
          updatedCountries[idx] = {
            ...other,
            infected: initialInfected,
            healthy: other.healthy - initialInfected,
          };
        }
      }
    }
  }

  return updatedCountries;
};

// Update country response (close borders, etc.)
const updateCountryResponse = (
  country: Country,
  globalInfected: number,
  globalDead: number,
  totalPop: number
): Country => {
  const updated = { ...country };

  // Increase awareness based on local and global situation
  const localInfectedRatio = country.infected / country.population;
  const globalInfectedRatio = globalInfected / totalPop;
  const globalDeadRatio = globalDead / totalPop;

  let awarenessIncrease = 0;
  if (localInfectedRatio > 0.001) awarenessIncrease += 0.5;
  if (localInfectedRatio > 0.01) awarenessIncrease += 1;
  if (localInfectedRatio > 0.1) awarenessIncrease += 2;
  if (globalInfectedRatio > 0.01) awarenessIncrease += 0.3;
  if (globalDeadRatio > 0.001) awarenessIncrease += 1;

  updated.awareness = Math.min(100, country.awareness + awarenessIncrease);

  // Countries may close borders/ports based on awareness
  if (updated.awareness > 30 && Math.random() < 0.02) {
    updated.isOpen = false;
  }
  if (updated.awareness > 50 && Math.random() < 0.03) {
    updated.airportOpen = false;
  }
  if (updated.awareness > 70 && Math.random() < 0.02) {
    updated.seaportOpen = false;
  }

  // Rich countries contribute more to cure
  if (updated.awareness > 20 && country.infected > 0) {
    const wealthMultiplier =
      country.wealth === "rich" ? 2 : country.wealth === "average" ? 1 : 0.5;
    updated.cureContribution = updated.awareness * wealthMultiplier * 0.01;
  }

  return updated;
};

// Main game tick
export const gameTick = (state: GameState): GameState => {
  if (state.isPaused || !state.gameStarted || state.gameOver) {
    return state;
  }

  let { countries, plague, dnaPoints, cureProgress, totalInfected, totalDead } =
    state;

  // Update each country
  countries = countries.map((country) => {
    if (country.infected === 0) return country;

    const spreadRate = calculateSpreadRate(country, plague);
    const deathRate = calculateDeathRate(country, plague);

    // Calculate new infections within country
    const potentialNewInfections = Math.floor(
      country.infected * spreadRate * (1 + Math.random())
    );
    const newInfections = Math.min(potentialNewInfections, country.healthy);

    // Calculate deaths
    const newDeaths = Math.floor(
      country.infected * deathRate * (0.5 + Math.random())
    );
    const actualDeaths = Math.min(newDeaths, country.infected);

    return {
      ...country,
      infected: country.infected + newInfections - actualDeaths,
      healthy: country.healthy - newInfections,
      dead: country.dead + actualDeaths,
    };
  });

  // Spread between countries
  countries = spreadBetweenCountries({ ...state, countries });

  // Update country responses
  const newTotalInfected = countries.reduce((sum, c) => sum + c.infected, 0);
  const newTotalDead = countries.reduce((sum, c) => sum + c.dead, 0);

  countries = countries.map((c) =>
    updateCountryResponse(
      c,
      newTotalInfected,
      newTotalDead,
      state.totalPopulation
    )
  );

  // Generate DNA points based on infections and deaths
  const infectionGain = Math.floor((newTotalInfected - totalInfected) / 100000);
  const deathGain = Math.floor((newTotalDead - totalDead) / 50000);
  dnaPoints += Math.max(0, infectionGain + deathGain);

  // Random DNA point bubbles
  if (Math.random() < 0.1 && newTotalInfected > 1000) {
    dnaPoints += Math.floor(Math.random() * 3) + 1;
  }

  // Update cure progress
  const totalCureContribution = countries.reduce(
    (sum, c) => sum + c.cureContribution,
    0
  );
  const cureSpeed = totalCureContribution * (1 - plague.drugResistance * 0.1);
  cureProgress = Math.min(100, cureProgress + cureSpeed * 0.1);

  // Check win/lose conditions
  const totalHealthy = countries.reduce((sum, c) => sum + c.healthy, 0);
  const allDead = totalHealthy === 0 && newTotalInfected === 0;
  const cureComplete = cureProgress >= 100;

  return {
    ...state,
    countries,
    dnaPoints,
    day: state.day + 1,
    cureProgress,
    totalInfected: newTotalInfected,
    totalDead: newTotalDead,
    gameOver: allDead || cureComplete,
    victory: allDead,
  };
};

// Evolve a symptom
export const evolveSymptom = (
  state: GameState,
  symptomId: string
): GameState => {
  const symptom = symptoms.find((s) => s.id === symptomId);
  if (!symptom || symptom.unlocked) return state;
  if (state.dnaPoints < symptom.cost) return state;

  // Check prerequisites
  if (symptom.requires) {
    const hasPrereqs = symptom.requires.every(
      (reqId) => symptoms.find((s) => s.id === reqId)?.unlocked
    );
    if (!hasPrereqs) return state;
  }

  symptom.unlocked = true;

  return {
    ...state,
    dnaPoints: state.dnaPoints - symptom.cost,
    plague: {
      ...state.plague,
      infectivity: Math.min(
        100,
        state.plague.infectivity + symptom.infectivityBonus
      ),
      severity: Math.min(100, state.plague.severity + symptom.severityBonus),
      lethality: Math.min(100, state.plague.lethality + symptom.lethalityBonus),
      symptoms: [...state.plague.symptoms, symptom],
    },
  };
};

// Evolve a transmission
export const evolveTransmission = (
  state: GameState,
  transmissionId: string
): GameState => {
  const transmission = transmissions.find((t) => t.id === transmissionId);
  if (!transmission || transmission.unlocked) return state;
  if (state.dnaPoints < transmission.cost) return state;

  // Check if previous level is unlocked
  if (transmission.level > 1) {
    const prevLevel = transmissions.find(
      (t) => t.type === transmission.type && t.level === transmission.level - 1
    );
    if (!prevLevel?.unlocked) return state;
  }

  transmission.unlocked = true;

  const plague = { ...state.plague };
  switch (transmission.type) {
    case "air":
      plague.airborne = transmission.level;
      plague.infectivity = Math.min(100, plague.infectivity + 3);
      break;
    case "water":
      plague.waterborne = transmission.level;
      plague.infectivity = Math.min(100, plague.infectivity + 3);
      break;
    case "insect":
      plague.insectborne = transmission.level;
      plague.infectivity = Math.min(100, plague.infectivity + 2);
      break;
    case "blood":
      plague.bloodborne = transmission.level;
      plague.infectivity = Math.min(100, plague.infectivity + 2);
      break;
  }

  return {
    ...state,
    dnaPoints: state.dnaPoints - transmission.cost,
    plague,
  };
};

// Evolve an ability
export const evolveAbility = (
  state: GameState,
  abilityId: string
): GameState => {
  const ability = abilities.find((a) => a.id === abilityId);
  if (!ability || ability.unlocked) return state;
  if (state.dnaPoints < ability.cost) return state;

  // Check if previous level is unlocked
  if (ability.level > 1) {
    const prevLevel = abilities.find(
      (a) => a.type === ability.type && a.level === ability.level - 1
    );
    if (!prevLevel?.unlocked) return state;
  }

  ability.unlocked = true;

  const plague = { ...state.plague };
  switch (ability.type) {
    case "cold":
      plague.coldResistance = ability.level;
      break;
    case "heat":
      plague.heatResistance = ability.level;
      break;
    case "drug":
      plague.drugResistance = ability.level;
      break;
  }

  return {
    ...state,
    dnaPoints: state.dnaPoints - ability.cost,
    plague,
  };
};

// Start the game
export const startGame = (
  state: GameState,
  countryId: string,
  plagueName: string
): GameState => {
  const countryIdx = state.countries.findIndex((c) => c.id === countryId);
  if (countryIdx === -1) return state;

  const countries = [...state.countries];
  const country = countries[countryIdx];

  // Start with a small number of infected
  const initialInfected = Math.max(
    1,
    Math.floor(country.population * 0.000001)
  );
  countries[countryIdx] = {
    ...country,
    infected: initialInfected,
    healthy: country.healthy - initialInfected,
  };

  return {
    ...state,
    countries,
    plague: {
      ...state.plague,
      name: plagueName || "Unknown Pathogen",
    },
    startingCountry: countryId,
    gameStarted: true,
    isPaused: false,
    dnaPoints: 5, // Starting DNA points
    totalInfected: initialInfected,
  };
};

import { createCountries } from "../data/countries.js";
import { createSymptoms } from "../data/symptoms.js";
import { createTransmissions } from "../data/transmissions.js";
import { createAbilities } from "../data/abilities.js";
import { generateNews, resetNewsTracker } from "./newsGenerator.js";
// Store upgrades separately from game state
let symptoms = [];
let transmissions = [];
let abilities = [];
export const getSymptoms = () => symptoms;
export const getTransmissions = () => transmissions;
export const getAbilities = () => abilities;
export const DIFFICULTY_SETTINGS = {
    easy: {
        cureSpeedMultiplier: 0.3,
        awarenessMultiplier: 0.5,
        startingDna: 15,
        dnaGainMultiplier: 1.5,
        borderCloseChance: 0.5,
    },
    normal: {
        cureSpeedMultiplier: 0.6,
        awarenessMultiplier: 0.8,
        startingDna: 10,
        dnaGainMultiplier: 1.0,
        borderCloseChance: 0.8,
    },
    hard: {
        cureSpeedMultiplier: 1.0,
        awarenessMultiplier: 1.2,
        startingDna: 5,
        dnaGainMultiplier: 0.7,
        borderCloseChance: 1.2,
    },
};
export const createInitialState = (difficulty = "normal") => {
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
        difficulty,
        visibility: 0,
        recentTransits: [],
        newsItems: [],
    };
};
// Calculate infection spread rate for a country
const calculateSpreadRate = (country, plague) => {
    let rate = plague.infectivity / 100;
    // Climate modifiers
    if (country.climate === "cold") {
        rate *= 0.5 + plague.coldResistance * 0.2;
    }
    else if (country.climate === "hot") {
        rate *= 0.5 + plague.heatResistance * 0.2;
    }
    // Wealth affects spread (rich countries have better healthcare)
    if (country.wealth === "rich") {
        rate *= 0.7 - plague.drugResistance * 0.1;
    }
    else if (country.wealth === "poor") {
        rate *= 1.3;
    }
    // Density affects spread
    if (country.density === "urban") {
        rate *= 1.4;
    }
    else if (country.density === "rural") {
        rate *= 0.7;
    }
    // Awareness reduces spread
    rate *= 1 - country.awareness / 200;
    return Math.max(0.001, Math.min(rate, 0.5));
};
// Calculate death rate for a country
const calculateDeathRate = (country, plague) => {
    let rate = plague.lethality / 1000;
    // Rich countries have better survival rates
    if (country.wealth === "rich") {
        rate *= 0.5 - plague.drugResistance * 0.05;
    }
    else if (country.wealth === "poor") {
        rate *= 1.5;
    }
    return Math.max(0, Math.min(rate, 0.1));
};
// Check if infection can spread to a country
const canSpreadTo = (from, to, plague, countries) => {
    if (to.infected > 0)
        return true; // Already infected
    // Check land borders - always possible if borders are open
    if (from.borders.includes(to.id)) {
        // Can spread via land if either country has open borders
        if (from.isOpen || to.isOpen) {
            return true;
        }
    }
    // Check air travel - requires both airports open
    if (from.airports && from.airportOpen && to.airports && to.airportOpen) {
        return true; // Air travel always possible when airports open
    }
    // Check sea travel - requires both seaports open
    if (from.seaports && from.seaportOpen && to.seaports && to.seaportOpen) {
        return true; // Sea travel always possible when seaports open
    }
    return false;
};
// Spread infection between countries - returns updated countries and transit events
const spreadBetweenCountries = (state) => {
    const { countries, plague, day } = state;
    const updatedCountries = [...countries];
    const newTransits = [];
    for (const country of countries) {
        if (country.infected === 0)
            continue;
        // Try to spread to connected countries
        for (const other of countries) {
            if (other.id === country.id)
                continue;
            if (other.infected > 0)
                continue;
            if (canSpreadTo(country, other, plague, countries)) {
                // Calculate spread chance based on infected population
                const infectedRatio = country.infected / country.population;
                // Base chance is much higher - 50% at full infection
                let spreadChance = infectedRatio * 0.5;
                // Determine transit type and apply bonuses
                let transitType = "air"; // Default for non-border
                // Land borders have highest spread chance
                if (country.borders.includes(other.id)) {
                    spreadChance *= 2.0; // Double chance for land borders
                    transitType = "land";
                    // Extra bonus if both borders fully open
                    if (country.isOpen && other.isOpen) {
                        spreadChance *= 1.5;
                    }
                }
                // Air travel bonuses
                if (country.airports &&
                    other.airports &&
                    country.airportOpen &&
                    other.airportOpen) {
                    spreadChance *= 1 + plague.airborne * 0.3;
                    if (!country.borders.includes(other.id))
                        transitType = "air";
                }
                // Sea travel bonuses
                if (country.seaports &&
                    other.seaports &&
                    country.seaportOpen &&
                    other.seaportOpen) {
                    spreadChance *= 1 + plague.waterborne * 0.3;
                    if (!country.borders.includes(other.id) && transitType !== "air")
                        transitType = "sea";
                }
                // Insect transmission bonus in hot climates
                if (plague.insectborne > 0 &&
                    (country.climate === "hot" || other.climate === "hot")) {
                    spreadChance *= 1 + plague.insectborne * 0.2;
                }
                // Infectivity bonus
                spreadChance *= 1 + plague.infectivity * 0.02;
                if (Math.random() < spreadChance) {
                    const idx = updatedCountries.findIndex((c) => c.id === other.id);
                    const initialInfected = Math.max(1, Math.floor(Math.random() * 10));
                    updatedCountries[idx] = {
                        ...other,
                        infected: initialInfected,
                        healthy: other.healthy - initialInfected,
                    };
                    // Record transit event
                    newTransits.push({
                        id: `${country.id}-${other.id}-${day}`,
                        from: country.id,
                        to: other.id,
                        type: transitType,
                        day,
                        infected: initialInfected,
                    });
                }
            }
        }
    }
    return { countries: updatedCountries, transits: newTransits };
};
// Calculate visibility based on plague stats and global situation
const calculateVisibility = (plague, totalInfected, totalDead, totalPop) => {
    let visibility = 0;
    // Severity directly increases visibility
    visibility += plague.severity * 0.5;
    // Lethality makes it very noticeable
    visibility += plague.lethality * 0.8;
    // Symptoms that are visible
    for (const symptom of plague.symptoms) {
        visibility += symptom.severityBonus * 0.3;
        visibility += symptom.lethalityBonus * 0.5;
    }
    // Global infection rate
    const infectedRatio = totalInfected / totalPop;
    visibility += infectedRatio * 100;
    // Deaths are very noticeable
    const deadRatio = totalDead / totalPop;
    visibility += deadRatio * 200;
    return Math.min(100, Math.max(0, visibility));
};
// Update country response (close borders, etc.)
const updateCountryResponse = (country, globalInfected, globalDead, totalPop, difficulty, visibility) => {
    const updated = { ...country };
    const settings = DIFFICULTY_SETTINGS[difficulty];
    // Increase awareness based on local and global situation
    const localInfectedRatio = country.infected / country.population;
    const localDeadRatio = country.dead / country.population;
    const globalInfectedRatio = globalInfected / totalPop;
    const globalDeadRatio = globalDead / totalPop;
    let awarenessIncrease = 0;
    if (localInfectedRatio > 0.001)
        awarenessIncrease += 0.3;
    if (localInfectedRatio > 0.01)
        awarenessIncrease += 0.5;
    if (localInfectedRatio > 0.1)
        awarenessIncrease += 1;
    if (globalInfectedRatio > 0.01)
        awarenessIncrease += 0.2;
    if (globalDeadRatio > 0.001)
        awarenessIncrease += 0.5;
    // Visibility affects awareness gain
    awarenessIncrease *= 1 + visibility / 100;
    awarenessIncrease *= settings.awarenessMultiplier;
    updated.awareness = Math.min(100, country.awareness + awarenessIncrease);
    // Countries may close borders/ports based on awareness - scaled by difficulty
    const closeChance = settings.borderCloseChance;
    if (updated.awareness > 40 && Math.random() < 0.015 * closeChance) {
        updated.isOpen = false;
    }
    if (updated.awareness > 60 && Math.random() < 0.02 * closeChance) {
        updated.airportOpen = false;
    }
    if (updated.awareness > 80 && Math.random() < 0.015 * closeChance) {
        updated.seaportOpen = false;
    }
    // Cure contribution - reduced when country has high death rate (resources diverted)
    if (updated.awareness > 20 && country.infected > 0) {
        const wealthMultiplier = country.wealth === "rich" ? 2 : country.wealth === "average" ? 1 : 0.5;
        // Deaths reduce cure contribution (overwhelmed healthcare)
        const deathPenalty = Math.max(0.2, 1 - localDeadRatio * 5);
        // Infected population reduces research capacity
        const infectedPenalty = Math.max(0.3, 1 - localInfectedRatio * 2);
        updated.cureContribution =
            updated.awareness *
                wealthMultiplier *
                0.01 *
                deathPenalty *
                infectedPenalty;
    }
    return updated;
};
// Main game tick
export const gameTick = (state) => {
    if (state.isPaused || !state.gameStarted || state.gameOver) {
        return state;
    }
    const settings = DIFFICULTY_SETTINGS[state.difficulty];
    let { countries, plague, dnaPoints, cureProgress, totalInfected, totalDead, recentTransits, } = state;
    // Update each country
    countries = countries.map((country) => {
        if (country.infected === 0)
            return country;
        const spreadRate = calculateSpreadRate(country, plague);
        const deathRate = calculateDeathRate(country, plague);
        // Calculate new infections within country
        const potentialNewInfections = Math.floor(country.infected * spreadRate * (1 + Math.random()));
        const newInfections = Math.min(potentialNewInfections, country.healthy);
        // Calculate deaths
        const newDeaths = Math.floor(country.infected * deathRate * (0.5 + Math.random()));
        const actualDeaths = Math.min(newDeaths, country.infected);
        return {
            ...country,
            infected: country.infected + newInfections - actualDeaths,
            healthy: country.healthy - newInfections,
            dead: country.dead + actualDeaths,
        };
    });
    // Spread between countries
    const spreadResult = spreadBetweenCountries({ ...state, countries });
    countries = spreadResult.countries;
    // Keep only recent transits (last 20 days)
    const newTransits = [...recentTransits, ...spreadResult.transits]
        .filter((t) => state.day - t.day < 20)
        .slice(-50); // Keep max 50 events
    // Update country responses
    const newTotalInfected = countries.reduce((sum, c) => sum + c.infected, 0);
    const newTotalDead = countries.reduce((sum, c) => sum + c.dead, 0);
    // Calculate visibility
    const visibility = calculateVisibility(plague, newTotalInfected, newTotalDead, state.totalPopulation);
    countries = countries.map((c) => updateCountryResponse(c, newTotalInfected, newTotalDead, state.totalPopulation, state.difficulty, visibility));
    // Generate DNA points based on infections and deaths - scaled by difficulty
    const infectionGain = Math.floor((newTotalInfected - totalInfected) / 100000);
    const deathGain = Math.floor((newTotalDead - totalDead) / 50000);
    dnaPoints += Math.max(0, Math.floor((infectionGain + deathGain) * settings.dnaGainMultiplier));
    // Random DNA point bubbles
    if (Math.random() < 0.1 && newTotalInfected > 1000) {
        dnaPoints += Math.floor((Math.random() * 3 + 1) * settings.dnaGainMultiplier);
    }
    // Update cure progress - scaled by difficulty and affected by global death rate
    const totalCureContribution = countries.reduce((sum, c) => sum + c.cureContribution, 0);
    // Global death rate slows cure (scientists dying, resources diverted)
    const globalDeathRatio = newTotalDead / state.totalPopulation;
    const deathSlowdown = Math.max(0.1, 1 - globalDeathRatio * 3);
    const cureSpeed = totalCureContribution *
        (1 - plague.drugResistance * 0.15) *
        deathSlowdown *
        settings.cureSpeedMultiplier;
    cureProgress = Math.min(100, cureProgress + cureSpeed * 0.08);
    // Check win/lose conditions
    const totalHealthy = countries.reduce((sum, c) => sum + c.healthy, 0);
    const allDead = totalHealthy === 0 && newTotalInfected === 0;
    const cureComplete = cureProgress >= 100;
    // Build new state before generating news
    const newState = {
        ...state,
        countries,
        dnaPoints,
        day: state.day + 1,
        cureProgress,
        totalInfected: newTotalInfected,
        totalDead: newTotalDead,
        gameOver: allDead || cureComplete,
        victory: allDead,
        visibility,
        recentTransits: newTransits,
        newsItems: state.newsItems,
    };
    // Generate news based on state changes
    const newNews = generateNews(state, newState);
    // Keep last 50 news items
    const allNews = [...state.newsItems, ...newNews].slice(-50);
    return {
        ...newState,
        newsItems: allNews,
    };
};
// Evolve a symptom
export const evolveSymptom = (state, symptomId) => {
    const symptom = symptoms.find((s) => s.id === symptomId);
    if (!symptom || symptom.unlocked)
        return state;
    if (state.dnaPoints < symptom.cost)
        return state;
    // Check prerequisites
    if (symptom.requires) {
        const hasPrereqs = symptom.requires.every((reqId) => symptoms.find((s) => s.id === reqId)?.unlocked);
        if (!hasPrereqs)
            return state;
    }
    symptom.unlocked = true;
    return {
        ...state,
        dnaPoints: state.dnaPoints - symptom.cost,
        plague: {
            ...state.plague,
            infectivity: Math.min(100, state.plague.infectivity + symptom.infectivityBonus),
            severity: Math.min(100, state.plague.severity + symptom.severityBonus),
            lethality: Math.min(100, state.plague.lethality + symptom.lethalityBonus),
            symptoms: [...state.plague.symptoms, symptom],
        },
    };
};
// Evolve a transmission
export const evolveTransmission = (state, transmissionId) => {
    const transmission = transmissions.find((t) => t.id === transmissionId);
    if (!transmission || transmission.unlocked)
        return state;
    if (state.dnaPoints < transmission.cost)
        return state;
    // Check if previous level is unlocked
    if (transmission.level > 1) {
        const prevLevel = transmissions.find((t) => t.type === transmission.type && t.level === transmission.level - 1);
        if (!prevLevel?.unlocked)
            return state;
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
export const evolveAbility = (state, abilityId) => {
    const ability = abilities.find((a) => a.id === abilityId);
    if (!ability || ability.unlocked)
        return state;
    if (state.dnaPoints < ability.cost)
        return state;
    // Check if previous level is unlocked
    if (ability.level > 1) {
        const prevLevel = abilities.find((a) => a.type === ability.type && a.level === ability.level - 1);
        if (!prevLevel?.unlocked)
            return state;
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
export const startGame = (state, countryId, plagueName) => {
    const countryIdx = state.countries.findIndex((c) => c.id === countryId);
    if (countryIdx === -1)
        return state;
    // Reset news tracker for new game
    resetNewsTracker();
    const settings = DIFFICULTY_SETTINGS[state.difficulty];
    const countries = [...state.countries];
    const country = countries[countryIdx];
    // Start with a small number of infected
    const initialInfected = Math.max(1, Math.floor(country.population * 0.000001));
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
        dnaPoints: settings.startingDna,
        totalInfected: initialInfected,
    };
};

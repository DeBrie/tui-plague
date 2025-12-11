let newsTracker = {
    firstCaseReported: false,
    countriesInfected: new Set(),
    countriesWithDeaths: new Set(),
    countriesClosed: new Set(),
    airportsClosed: new Set(),
    seaportsClosed: new Set(),
    cureStarted: false,
    cureMilestones: new Set(),
    awarenessAlerts: new Set(),
    devastatedCountries: new Set(),
};
export const resetNewsTracker = () => {
    newsTracker = {
        firstCaseReported: false,
        countriesInfected: new Set(),
        countriesWithDeaths: new Set(),
        countriesClosed: new Set(),
        airportsClosed: new Set(),
        seaportsClosed: new Set(),
        cureStarted: false,
        cureMilestones: new Set(),
        awarenessAlerts: new Set(),
        devastatedCountries: new Set(),
    };
};
const createNewsItem = (day, type, headline, priority) => ({
    id: `${type}-${day}-${Math.random().toString(36).substr(2, 9)}`,
    day,
    type,
    headline,
    priority,
});
// Headlines for first case discovery
const firstCaseHeadlines = (country, plague) => [
    `BREAKING: Strange illness reported in ${country}`,
    `Health officials in ${country} investigating unknown pathogen`,
    `${country} reports unusual disease outbreak`,
    `Mysterious illness "${plague}" identified in ${country}`,
    `Scientists puzzled by new disease in ${country}`,
    `${country} health ministry confirms new pathogen: ${plague}`,
];
// Headlines for spread to new country
const spreadHeadlines = (country, plague) => [
    `${plague} confirmed in ${country}`,
    `First case of ${plague} detected in ${country}`,
    `${country} reports first ${plague} infection`,
    `ALERT: ${plague} has reached ${country}`,
    `${country} joins list of affected nations`,
    `Health emergency declared as ${plague} arrives in ${country}`,
    `Traveler brings ${plague} to ${country}`,
    `${country} confirms imported case of ${plague}`,
];
// Headlines for first deaths
const deathHeadlines = (country, plague) => [
    `Tragic: First ${plague} death reported in ${country}`,
    `${country} mourns first victim of ${plague}`,
    `${plague} claims first life in ${country}`,
    `Fatal case of ${plague} confirmed in ${country}`,
    `Death toll begins in ${country} as ${plague} proves deadly`,
    `${country} hospital reports first ${plague} fatality`,
];
// Headlines for mass deaths
const massDeathHeadlines = (country, deaths) => [
    `Crisis deepens: ${deaths} dead in ${country}`,
    `${country} death toll reaches ${deaths}`,
    `Morgues overwhelmed in ${country} as deaths hit ${deaths}`,
    `${country} declares state of emergency, ${deaths} dead`,
    `Mass graves dug in ${country} as casualties mount`,
    `${country} healthcare system collapses, ${deaths} fatalities`,
];
// Headlines for border closures
const borderClosedHeadlines = (country) => [
    `${country} closes all borders`,
    `LOCKDOWN: ${country} seals borders to prevent spread`,
    `${country} implements strict border controls`,
    `No entry: ${country} shuts down all border crossings`,
    `${country} goes into isolation mode`,
    `Travel ban: ${country} closes borders indefinitely`,
];
// Headlines for airport closures
const airportClosedHeadlines = (country) => [
    `${country} grounds all flights`,
    `Airports shut down across ${country}`,
    `${country} suspends all air travel`,
    `No fly zone: ${country} closes airspace`,
    `${country} cancels all international flights`,
    `Aviation halt: ${country} airports go dark`,
];
// Headlines for seaport closures
const seaportClosedHeadlines = (country) => [
    `${country} closes all seaports`,
    `Maritime shutdown in ${country}`,
    `${country} halts all shipping operations`,
    `Port closure: ${country} blocks all vessels`,
    `${country} navy enforces port blockade`,
    `No ships allowed: ${country} seals ports`,
];
// Headlines for cure research
const cureStartedHeadlines = (plague) => [
    `Scientists begin work on ${plague} cure`,
    `Global effort launched to find ${plague} treatment`,
    `WHO coordinates international ${plague} research`,
    `Race against time: Cure research begins for ${plague}`,
    `Pharmaceutical giants unite against ${plague}`,
    `Billions pledged for ${plague} vaccine development`,
];
// Headlines for cure progress
const cureProgressHeadlines = (plague, progress) => [
    `${plague} cure research ${progress}% complete`,
    `Breakthrough: Cure for ${plague} now ${progress}% developed`,
    `Hope rises as ${plague} treatment reaches ${progress}%`,
    `Scientists report ${progress}% progress on ${plague} cure`,
    `Clinical trials advance: ${plague} cure at ${progress}%`,
    `${plague} vaccine development hits ${progress}% milestone`,
];
// Headlines for high awareness
const awarenessHeadlines = (country, plague) => [
    `${country} on high alert for ${plague}`,
    `Panic buying reported in ${country} amid ${plague} fears`,
    `${country} citizens stockpile supplies`,
    `Mass exodus from cities in ${country}`,
    `${country} implements mandatory health screenings`,
    `Public fear grows in ${country} as ${plague} spreads`,
];
// Headlines for devastated countries
const devastatedHeadlines = (country) => [
    `${country} society collapses`,
    `Apocalyptic scenes in ${country}`,
    `${country} government ceases to function`,
    `Civilization crumbles in ${country}`,
    `${country} declared uninhabitable`,
    `Last survivors flee ${country}`,
];
// General flavor headlines
const generalHeadlines = (plague) => [
    `Experts warn ${plague} may mutate`,
    `Stock markets plunge amid ${plague} fears`,
    `Schools close worldwide due to ${plague}`,
    `Sports events cancelled globally`,
    `Internet traffic surges as people stay home`,
    `Toilet paper shortage reported worldwide`,
    `Conspiracy theories about ${plague} spread online`,
    `Religious leaders call for prayers against ${plague}`,
    `Military deployed to enforce quarantines`,
    `Hospitals report critical supply shortages`,
    `Scientists debate ${plague} origin`,
    `Social distancing becomes new normal`,
    `Economic recession feared due to ${plague}`,
    `Crime rates drop as people stay indoors`,
    `Wildlife returns to empty city streets`,
    `Air quality improves as travel decreases`,
    `Mental health crisis emerges during lockdowns`,
    `Online shopping overwhelms delivery services`,
    `Zoom calls replace in-person meetings`,
    `Masks become fashion statement`,
    `Hand sanitizer worth its weight in gold`,
    `Celebrities share quarantine experiences`,
    `Essential workers hailed as heroes`,
    `Anti-lockdown protests erupt in several nations`,
    `Scientists urge calm amid ${plague} panic`,
];
// Symptom noticed headlines
const symptomHeadlines = (symptom, plague) => [
    `New symptom identified: ${plague} causes ${symptom}`,
    `Doctors report ${symptom} in ${plague} patients`,
    `${symptom} linked to ${plague} infection`,
    `Warning: ${plague} now causing ${symptom}`,
    `Medical journals document ${symptom} from ${plague}`,
];
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const formatNumber = (num) => {
    if (num >= 1000000000)
        return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000)
        return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000)
        return (num / 1000).toFixed(0) + "K";
    return num.toString();
};
export const generateNews = (prevState, newState) => {
    const news = [];
    const { plague, countries, day, cureProgress, visibility } = newState;
    const plagueName = plague.name;
    // First case ever reported
    if (!newsTracker.firstCaseReported && newState.totalInfected > 0) {
        const startingCountry = countries.find((c) => c.id === newState.startingCountry);
        if (startingCountry) {
            news.push(createNewsItem(day, "first_case", pickRandom(firstCaseHeadlines(startingCountry.name, plagueName)), 10));
            newsTracker.firstCaseReported = true;
            newsTracker.countriesInfected.add(startingCountry.id);
        }
    }
    // Check each country for events
    for (const country of countries) {
        const prevCountry = prevState.countries.find((c) => c.id === country.id);
        if (!prevCountry)
            continue;
        // New country infected
        if (prevCountry.infected === 0 &&
            country.infected > 0 &&
            !newsTracker.countriesInfected.has(country.id)) {
            news.push(createNewsItem(day, "spread_to_country", pickRandom(spreadHeadlines(country.name, plagueName)), 8));
            newsTracker.countriesInfected.add(country.id);
        }
        // First deaths in country
        if (prevCountry.dead === 0 &&
            country.dead > 0 &&
            !newsTracker.countriesWithDeaths.has(country.id)) {
            news.push(createNewsItem(day, "deaths_start", pickRandom(deathHeadlines(country.name, plagueName)), 9));
            newsTracker.countriesWithDeaths.add(country.id);
        }
        // Mass deaths milestone (every 10% of population)
        const deathPercent = Math.floor((country.dead / country.population) * 10) * 10;
        if (deathPercent >= 10 &&
            !newsTracker.devastatedCountries.has(`${country.id}-${deathPercent}`)) {
            if (deathPercent >= 50 &&
                !newsTracker.devastatedCountries.has(country.id)) {
                news.push(createNewsItem(day, "country_devastated", pickRandom(devastatedHeadlines(country.name)), 10));
                newsTracker.devastatedCountries.add(country.id);
            }
            else if (deathPercent < 50) {
                news.push(createNewsItem(day, "mass_deaths", pickRandom(massDeathHeadlines(country.name, formatNumber(country.dead))), 7));
            }
            newsTracker.devastatedCountries.add(`${country.id}-${deathPercent}`);
        }
        // Border closed
        if (prevCountry.isOpen &&
            !country.isOpen &&
            !newsTracker.countriesClosed.has(country.id)) {
            news.push(createNewsItem(day, "border_closed", pickRandom(borderClosedHeadlines(country.name)), 7));
            newsTracker.countriesClosed.add(country.id);
        }
        // Airport closed
        if (prevCountry.airportOpen &&
            !country.airportOpen &&
            !newsTracker.airportsClosed.has(country.id)) {
            news.push(createNewsItem(day, "airport_closed", pickRandom(airportClosedHeadlines(country.name)), 6));
            newsTracker.airportsClosed.add(country.id);
        }
        // Seaport closed
        if (prevCountry.seaportOpen &&
            !country.seaportOpen &&
            !newsTracker.seaportsClosed.has(country.id)) {
            news.push(createNewsItem(day, "seaport_closed", pickRandom(seaportClosedHeadlines(country.name)), 6));
            newsTracker.seaportsClosed.add(country.id);
        }
        // High awareness alert
        if (country.awareness >= 50 &&
            prevCountry.awareness < 50 &&
            !newsTracker.awarenessAlerts.has(country.id)) {
            news.push(createNewsItem(day, "awareness", pickRandom(awarenessHeadlines(country.name, plagueName)), 5));
            newsTracker.awarenessAlerts.add(country.id);
        }
    }
    // Cure research started
    if (!newsTracker.cureStarted && cureProgress > 0) {
        news.push(createNewsItem(day, "cure_started", pickRandom(cureStartedHeadlines(plagueName)), 9));
        newsTracker.cureStarted = true;
    }
    // Cure progress milestones (25%, 50%, 75%, 90%)
    const cureMilestones = [25, 50, 75, 90];
    for (const milestone of cureMilestones) {
        if (cureProgress >= milestone &&
            !newsTracker.cureMilestones.has(milestone)) {
            news.push(createNewsItem(day, "cure_progress", pickRandom(cureProgressHeadlines(plagueName, milestone)), 8));
            newsTracker.cureMilestones.add(milestone);
        }
    }
    // Random general news (small chance each tick)
    if (Math.random() < 0.02 && visibility > 20) {
        news.push(createNewsItem(day, "general", pickRandom(generalHeadlines(plagueName)), 2));
    }
    return news;
};

# TUI Plague

A Plague Inc-style terminal game built with Ink and TypeScript.

## 🎮 Gameplay

Infect the world with your custom pathogen! Evolve symptoms, transmission methods, and abilities to spread your plague while avoiding the cure.

### Features

- **25 Countries** with unique characteristics (climate, wealth, population density)
- **14 Symptoms** to evolve (from coughing to total organ failure)
- **12 Transmission methods** (air, water, insect, blood)
- **9 Abilities** (cold/heat/drug resistance)
- **Dynamic world response** - countries close borders, airports, and seaports
- **Cure research** - race against humanity's efforts to stop you

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build and run
npm run dev

# Or build first, then run
npm run build
npm start
```

## 🎯 Controls

| Key             | Action                  |
| --------------- | ----------------------- |
| `Space`         | Pause/Resume            |
| `+` / `-`       | Change game speed       |
| `Tab`           | Switch between panels   |
| `1` / `2` / `3` | Switch disease sub-tabs |
| `↑` / `↓`       | Navigate menus          |
| `Enter`         | Select/Evolve           |
| `Q`             | Quit game               |

## 🧬 Strategy Tips

1. **Start in a poor, hot country** - easier initial spread
2. **Evolve transmission first** - infect more countries before being noticed
3. **Keep lethality low initially** - dead hosts don't spread disease
4. **Watch for Greenland and Madagascar** - they close ports quickly!
5. **Evolve drug resistance** to slow the cure
6. **Go lethal only after infecting everyone**

## 📁 Project Structure

```
src/
├── index.tsx          # Entry point
├── App.tsx            # Main app component
├── types.ts           # TypeScript interfaces
├── engine/
│   └── gameEngine.ts  # Game logic and simulation
├── data/
│   ├── countries.ts   # Country definitions
│   ├── symptoms.ts    # Symptom upgrades
│   ├── transmissions.ts
│   └── abilities.ts
└── components/
    ├── Header.tsx     # Stats display
    ├── WorldMap.tsx   # Country list view
    ├── DiseasePanel.tsx
    ├── StartScreen.tsx
    ├── GameOverScreen.tsx
    └── HelpPanel.tsx
```

## 🛠 Tech Stack

- **Ink** - React for CLI
- **TypeScript** - Type safety
- **React** - Component architecture

## License

MIT

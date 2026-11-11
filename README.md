# AetherGrid — 3D Tactical Alignment

A 3D strategy alignment game built with Three.js and a zero-dependency Web Audio API procedural sound synthesizer.

## Key Features

- **Dynamic N×N Matrices**: Play on `3×3`, `4×4`, `5×5`, or `6×6` grids where the grid dimension equals the number of consecutive strikes required to win.
- **Three Power Max Mode**: Strictly limits each contender to 3 active strikes on the board; before placing a 4th strike, you must select one of your own 3 strikes to relocate.
- **Automated & 2-Player Duels**: 15-round Automated AI Gauntlet (3 rounds across Easy, Medium, Hard, Hardcore, and Impossible) and 3-round 2-Player Duels with an analytics graph and leaderboard.
- **Centered 3-Stage Initiation Flow**:
  1. **Hardware Auto-Detection**: Desktop Workstation vs. Integrated Touch Unit.
  2. **Match & Mode Setup**: Automated AI, 2-Player, 15-Round AI Gauntlet Duel, 3-Round 2-Player Duel, Three Power Max Mode, and `3×3` to `6×6` matrices.
  3. **Biome, Board & Sky Studio**: Live 360° scenic world preview with a dedicated **Inspect 360° World** toggle.
- **High-Contrast Pastel Glass UI**: Pure `#000000` text in Light Mode and `#ffffff` text in Dark Mode, non-overlapping flex viewport layout, and DPI-scaled analytics charts.
- **High-Contrast 3D Board Perimeter**: Raised 3D architectural border frame with corner finials and full outer grid lines so the board boundary is unmistakable from every camera angle.
- **Independent Striker Selection & Curated Pastel Swatches**: Player 1 and Player 2 (or AI) can independently choose `X`, `O`, `Crystal`, `Torus Knot`, `Obelisk`, or `Sphere` along with curated high-visibility pastel swatches for both strikers and the board table.
- **8 Realistic 3D Biomes**:
  - **Gothic Balcony / Windowside**: Pointed Gothic lancet arches, stained-glass rose window, stone balustrade, and distant cathedral spires.
  - **Gothic Castle Courtyard**: 4 crenelated corner turrets, curtain walls with battlements, and glowing torch braziers.
  - **Enchanted Forest**, **Cyberpunk Terrace**, **Sandstone Desert** (with pyramid, canyon mesa, natural arch, and oasis), **Abyssal Underwater Reef**, **Alpine Meadows**, and **Sketch Paper** (using continuous unbroken `TubeGeometry` pencil strokes).
- **Named Camera Modes + 360° Free Orbit**: Choose your starting camera on the initiation screen, switch modes anytime (`C`) with an on-screen toast notification, press `P` on desktop/laptop to pause, and rotate 360° freely in any mode.

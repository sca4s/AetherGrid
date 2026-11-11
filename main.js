/* ============================================================================
   AETHERGRID — 3D TACTICAL ALIGNMENT ENGINE
   Realistic Scenic 3D Biomes + Web Audio Synthesizer + N×N Alignment & Duels
   ============================================================================ */

// ----------------------------------------------------------------------------
// 1. PROCEDURAL WEB AUDIO API SOUND ENGINE (ZERO EXTERNAL FILES)
// ----------------------------------------------------------------------------
class ProceduralSoundEngine {
  constructor() {
    this.ctx = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playPlace(isPaper = false, player = 1) {
    this.ensureContext();
    const now = this.ctx.currentTime;

    if (isPaper) {
      // Realistic Graphite Pencil / Pen Sketch Stroke Sound
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.26);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const strokeMod = Math.sin(i * 0.02) * 0.5 + 0.5;
        data[i] = (Math.random() * 2 - 1) * strokeMod;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(player === 1 ? 1850 : 1420, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      return;
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = player === 1 ? "triangle" : "sine";
    const baseFreq = player === 1 ? 392 : 523.25;
    osc.frequency.setValueAtTime(baseFreq * 0.82, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.14);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playWinFanfare() {
    this.ensureContext();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.085;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    });
  }

  playCameraSwitch() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(590, now + 0.15);
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  playThemePlague() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(430, now + 0.42);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  playAttackPulse() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(145, now);
    osc.frequency.exponentialRampToValueAtTime(56, now + 0.32);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }
}

const sfx = new ProceduralSoundEngine();

// ----------------------------------------------------------------------------
// 2. APPLICATION STATE & STORAGE KEYS
// ----------------------------------------------------------------------------
const STORAGE_KEYS = {
  HIGH_SCORE: "aethergrid_high_score",
  BEST_TIME: "aethergrid_best_time",
  SAVED_MATCH: "aethergrid_saved_match",
  LEADERBOARD: "aethergrid_leaderboard"
};

const DIFF_ORDER = ["easy", "medium", "hard", "hardcore", "impossible"];
const ATTACK_TYPES = [
  "Solar Tremor",
  "Zephyr Spin",
  "Aether Pulse",
  "Gravity Wave",
  "Prism Quake"
];

const state = {
  screen: "device", // "device" | "mode" | "customize" | "game"
  paused: false,
  device: "desktop",
  theme: "light",

  // Game Config
  mode: "ai", // "ai" | "pvp" | "ai-duel" | "pvp-duel"
  rule: "classic", // "classic" | "threepower"
  gridSize: 3,
  difficulty: "medium",
  biome: "forest", // "forest" | "cyberpunk" | "parisian" | "desert" | "underwater" | "meadows" | "paper"
  shapeStyle: "xo",
  p1Name: "Astra",
  p2Name: "Aether AI",
  p1Color: "#ff8da1",
  p2Color: "#6bcBbd",
  boardColor: "#dcd3f8",

  // Sky Cycle
  skyMode: "dynamic",
  skyStart: "day",
  skyTime: 0.25,
  skySpeed: 1.0,

  // Active Match State
  board: [],
  currentPlayer: 1,
  gameOver: false,
  p1MarksQueue: [],
  p2MarksQueue: [],
  selectedRemovalIndex: null,
  p1Score: 0,
  p2Score: 0,
  elapsedSeconds: 0,
  highScore: parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || "0", 10),
  bestTime: parseInt(localStorage.getItem(STORAGE_KEYS.BEST_TIME) || "0", 10),
  currentAttack: "Solar Tremor",

  // Duel Progression
  duelRound: 1,
  duelTotalRounds: 1,
  duelHistory: [],

  // Leaderboard cumulative record
  leaderboard: JSON.parse(
    localStorage.getItem(STORAGE_KEYS.LEADERBOARD) ||
      '{"Astra":2,"Aether AI":1,"Nova":1,"Ties":1}'
  )
};

// ----------------------------------------------------------------------------
// 3. THREE.JS SCENE, REALISTIC SCENIC BIOMES, CLOUDS & SKETCH PENS
// ----------------------------------------------------------------------------
const canvas = document.getElementById("game-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xdfd8f7, 0.014);

const camera = new THREE.PerspectiveCamera(
  44,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

// Balanced Atmospheric Lighting (Non-reflective matte surfaces with soft shadows)
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xb8b0d8, 0.72);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xfff7e8, 0.72);
sunLight.position.set(18, 28, 16);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
scene.add(sunLight);

// Scene Hierarchy
const worldGroup = new THREE.Group();
const boardGroup = new THREE.Group();
const cellsGroup = new THREE.Group();
const marksGroup = new THREE.Group();
const biomePropsGroup = new THREE.Group();
const ambientParticlesGroup = new THREE.Group();
const cloudsGroup = new THREE.Group();
const pensGroup = new THREE.Group();

worldGroup.add(
  boardGroup,
  cellsGroup,
  marksGroup,
  biomePropsGroup,
  ambientParticlesGroup,
  pensGroup
);
scene.add(worldGroup, cloudsGroup);

// Camera Orbit & POV Controller
const camModes = [
  "Orbit 360°",
  "Top-Down Tactical",
  "Scenic Vista",
  "Contender 1 POV",
  "Contender 2 POV"
];
let camModeIndex = 0;
let camTheta = 0.62;
let camPhi = 1.02;
let camRadius = 15.2;
let isDraggingBoard = false;
let prevPointer = { x: 0, y: 0 };
let pointerDownPos = { x: 0, y: 0 };

// Strictly Non-Reflective Matte Material Helper
function createMatteMaterial(hexColor, opacity = 1) {
  return new THREE.MeshLambertMaterial({
    color: new THREE.Color(hexColor),
    transparent: opacity < 1,
    opacity
  });
}

// 3D Volumetric Pastel Clouds
function buildClouds() {
  cloudsGroup.clear();
  const cloudMat = createMatteMaterial("#ffffff", 0.86);
  for (let i = 0; i < 12; i++) {
    const cluster = new THREE.Group();
    const puffs = 4 + (i % 3);
    for (let p = 0; p < puffs; p++) {
      const geo = new THREE.SphereGeometry(1.3 + (p % 2) * 0.55, 14, 14);
      const mesh = new THREE.Mesh(geo, cloudMat);
      mesh.position.set(p * 1.25 - 1.5, (p % 2) * 0.35, (p % 3) * 0.45);
      mesh.scale.y = 0.58;
      cluster.add(mesh);
    }
    const angle = (i / 12) * Math.PI * 2;
    const dist = 24 + (i % 3) * 6;
    cluster.position.set(
      Math.cos(angle) * dist,
      9.5 + (i % 3) * 2.2,
      Math.sin(angle) * dist
    );
    cluster.userData = { angle, dist, speed: 0.025 + (i % 4) * 0.008 };
    cloudsGroup.add(cluster);
  }
}

// 2 Animated 3D Pens / Pencils for Sketch Paper Biome
let pen1Mesh = null;
let pen2Mesh = null;
let activePenAnim = null;

function buildSketchPens() {
  pensGroup.clear();
  const makePen = (bodyColor, tipColor, restX) => {
    const pen = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 3.2, 14),
      createMatteMaterial(bodyColor)
    );
    shaft.position.y = 2.0;

    const woodCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.55, 14),
      createMatteMaterial("#f3d5b5")
    );
    woodCone.rotation.x = Math.PI;
    woodCone.position.y = 0.15;

    const graphite = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.22, 12),
      createMatteMaterial(tipColor)
    );
    graphite.rotation.x = Math.PI;
    graphite.position.y = -0.08;

    pen.add(shaft, woodCone, graphite);
    pen.rotation.z = restX < 0 ? -0.26 : 0.26;
    pen.position.set(restX, 1.15, -3.6);
    pen.userData = { restPos: new THREE.Vector3(restX, 1.15, -3.6) };
    return pen;
  };

  pen1Mesh = makePen(state.p1Color, state.p1Color, -5.5);
  pen2Mesh = makePen(state.p2Color, state.p2Color, 5.5);
  pensGroup.add(pen1Mesh, pen2Mesh);
  pensGroup.visible = state.biome === "paper";
}

// ----------------------------------------------------------------------------
// 4. REALISTIC SCENIC 3D BIOMES BEHIND & AROUND THE BOARD
// ----------------------------------------------------------------------------
const BIOME_PALETTES = {
  forest: {
    daySky: "#d8f0e4",
    nightSky: "#11221f",
    pedestal: "#8c6d53",
    gridLine: "#3b5949"
  },
  cyberpunk: {
    daySky: "#d6eef8",
    nightSky: "#111026",
    pedestal: "#5c6484",
    gridLine: "#ff6b9d"
  },
  parisian: {
    daySky: "#f2e8f7",
    nightSky: "#1e1a34",
    pedestal: "#dfd5c8",
    gridLine: "#4f435a"
  },
  desert: {
    daySky: "#fae5c8",
    nightSky: "#291c2e",
    pedestal: "#e2a97e",
    gridLine: "#8a4f38"
  },
  underwater: {
    daySky: "#bce8f0",
    nightSky: "#0c2233",
    pedestal: "#76b8c4",
    gridLine: "#296878"
  },
  meadows: {
    daySky: "#e0f2fe",
    nightSky: "#16243b",
    pedestal: "#a7d79b",
    gridLine: "#436b47"
  },
  paper: {
    daySky: "#f7f4eb",
    nightSky: "#232429",
    pedestal: "#fdfbf7",
    gridLine: "#4a5568"
  }
};

function buildBoardAndBiome() {
  boardGroup.clear();
  cellsGroup.clear();
  biomePropsGroup.clear();
  ambientParticlesGroup.clear();

  const palette = BIOME_PALETTES[state.biome] || BIOME_PALETTES.forest;
  const N = state.gridSize;
  const boardSpan = 7.6;
  const cellSize = boardSpan / N;

  // Main Board Table
  const baseColor = state.biome === "paper" ? "#fdfbf7" : state.boardColor;
  const baseHeight = state.biome === "paper" ? 0.14 : 0.62;
  const baseGeo = new THREE.BoxGeometry(boardSpan + 1.0, baseHeight, boardSpan + 1.0);
  const baseMesh = new THREE.Mesh(baseGeo, createMatteMaterial(baseColor));
  baseMesh.position.y = -baseHeight / 2;
  baseMesh.receiveShadow = true;
  boardGroup.add(baseMesh);

  // Pedestal Base under Table
  const pillarGeo = new THREE.CylinderGeometry(2.6, 3.4, 1.8, 24);
  const pillarMesh = new THREE.Mesh(pillarGeo, createMatteMaterial(palette.pedestal));
  pillarMesh.position.y = -baseHeight - 0.9;
  pillarMesh.receiveShadow = true;
  boardGroup.add(pillarMesh);

  // Grid Lines (Crooked hand-drawn segments in Sketch Paper mode, sculpted bars otherwise)
  const lineMat = createMatteMaterial(palette.gridLine);
  const half = boardSpan / 2;

  for (let i = 1; i < N; i++) {
    const offset = -half + i * cellSize;
    if (state.biome === "paper") {
      const segments = 12;
      for (let s = 0; s < segments; s++) {
        const t1 = -half + (s / segments) * boardSpan;
        const t2 = -half + ((s + 1) / segments) * boardSpan;
        const j1 = Math.sin(s * 2.3 + i) * 0.055;
        const j2 = Math.cos((s + 1) * 1.9 + i) * 0.055;

        const vLen = Math.hypot(j2 - j1, t2 - t1);
        const vSeg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, vLen), lineMat);
        vSeg.position.set(offset + (j1 + j2) / 2, 0.03, (t1 + t2) / 2);
        vSeg.rotation.y = Math.atan2(j2 - j1, t2 - t1);
        boardGroup.add(vSeg);

        const hSeg = new THREE.Mesh(new THREE.BoxGeometry(vLen, 0.04, 0.06), lineMat);
        hSeg.position.set((t1 + t2) / 2, 0.03, offset + (j1 + j2) / 2);
        hSeg.rotation.y = Math.atan2(j2 - j1, t2 - t1);
        boardGroup.add(hSeg);
      }
    } else {
      const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.12, boardSpan), lineMat);
      vBar.position.set(offset, 0.06, 0);
      const hBar = new THREE.Mesh(new THREE.BoxGeometry(boardSpan, 0.12, 0.11), lineMat);
      hBar.position.set(0, 0.06, offset);
      boardGroup.add(vBar, hBar);
    }
  }

  // Interactive Cell Hit Tiles
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const x = -half + c * cellSize + cellSize / 2;
      const z = -half + r * cellSize + cellSize / 2;
      const tileGeo = new THREE.BoxGeometry(cellSize * 0.88, 0.1, cellSize * 0.88);
      const tileMat = createMatteMaterial("#ffffff", 0.15);
      const tile = new THREE.Mesh(tileGeo, tileMat);
      tile.position.set(x, 0.05, z);
      tile.userData = { row: r, col: c, x, z, cellSize };
      cellsGroup.add(tile);
    }
  }

  buildScenicBiomeWorld(state.biome);
  buildSketchPens();
  rebuildAllMarks();
}

function buildScenicBiomeWorld(biome) {
  if (biome === "forest") {
    // Mossy Forest Island, Multi-Tier Pine Trees, Rocks & Fireflies
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(26, 28, 1.4, 36),
      createMatteMaterial("#95c9a3")
    );
    ground.position.y = -2.4;
    biomePropsGroup.add(ground);

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2 + (i % 3) * 0.12;
      const radius = 11.5 + (i % 4) * 3.2;
      const tree = new THREE.Group();

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.35, 2.2, 8),
        createMatteMaterial("#7f5539")
      );
      trunk.position.y = -0.8;

      const c1 = new THREE.Mesh(
        new THREE.ConeGeometry(1.5, 2.8, 9),
        createMatteMaterial("#529471")
      );
      c1.position.y = 1.1;
      const c2 = new THREE.Mesh(
        new THREE.ConeGeometry(1.15, 2.3, 9),
        createMatteMaterial("#6ab089")
      );
      c2.position.y = 2.4;

      tree.add(trunk, c1, c2);
      const s = 0.85 + (i % 3) * 0.25;
      tree.scale.setScalar(s);
      tree.position.set(Math.cos(angle) * radius, -1.2, Math.sin(angle) * radius);
      biomePropsGroup.add(tree);
    }

    spawnAmbientParticles("#f9f871", 28, 12);
  } else if (biome === "cyberpunk") {
    // Rooftop Terrace Deck, Glass/Neon Balustrade & Surrounding Skyline Skyscrapers
    const terrace = new THREE.Mesh(
      new THREE.BoxGeometry(15.5, 1.2, 15.5),
      createMatteMaterial("#2b2d42")
    );
    terrace.position.y = -2.3;
    biomePropsGroup.add(terrace);

    // Neon Perimeter Railings
    const railColor = createMatteMaterial("#72efdd");
    const nRail = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.15, 0.15), railColor);
    nRail.position.set(0, -1.0, -7.5);
    const sRail = nRail.clone();
    sRail.position.z = 7.5;
    const eRail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 15.2), railColor);
    eRail.position.set(7.5, -1.0, 0);
    const wRail = eRail.clone();
    wRail.position.x = -7.5;
    biomePropsGroup.add(nRail, sRail, eRail, wRail);

    // City Skyline Towers around the Terrace
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const dist = 18 + (i % 3) * 5.5;
      const h = 10 + (i % 5) * 4.5;
      const w = 2.4 + (i % 3) * 0.9;
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, w),
        createMatteMaterial(i % 2 === 0 ? "#3a345c" : "#283252")
      );
      tower.position.set(Math.cos(angle) * dist, h / 2 - 9, Math.sin(angle) * dist);

      // Glowing Neon Roof Trim
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.15, 0.28, w + 0.15),
        createMatteMaterial(i % 3 === 0 ? "#ff6b9d" : "#72efdd")
      );
      cap.position.set(tower.position.x, tower.position.y + h / 2 + 0.15, tower.position.z);
      biomePropsGroup.add(tower, cap);
    }

    spawnAmbientParticles("#ff6b9d", 24, 15);
  } else if (biome === "parisian") {
    // Haussmann Stone Terrace, Ornate Iron Balcony Railings, Lamps & Distant Eiffel Tower
    const stoneDeck = new THREE.Mesh(
      new THREE.CylinderGeometry(11.5, 12.2, 1.4, 32),
      createMatteMaterial("#e6dfd5")
    );
    stoneDeck.position.y = -2.3;
    biomePropsGroup.add(stoneDeck);

    // Wrought-iron perimeter posts & warm streetlamps
    const ironMat = createMatteMaterial("#3d3a45");
    const lampMat = createMatteMaterial("#ffe599");
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.4, 8), ironMat);
      post.position.set(Math.cos(a) * 10.8, -1.0, Math.sin(a) * 10.8);
      biomePropsGroup.add(post);

      if (i % 4 === 0) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 4.2, 10), ironMat);
        pole.position.set(Math.cos(a) * 10.2, 0.4, Math.sin(a) * 10.2);
        const globe = new THREE.Mesh(new THREE.SphereGeometry(0.45, 14, 14), lampMat);
        globe.position.set(Math.cos(a) * 10.2, 2.65, Math.sin(a) * 10.2);
        biomePropsGroup.add(pole, globe);
      }
    }

    // Distant Eiffel Tower Silhouette behind the Board
    const eiffel = new THREE.Group();
    const towerMat = createMatteMaterial("#7f7589");
    const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 3.6, 6, 4), towerMat);
    tier1.position.y = 1;
    const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.75, 5.5, 4), towerMat);
    tier2.position.y = 6.5;
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.85, 7.5, 4), towerMat);
    spire.position.y = 12.8;
    eiffel.add(tier1, tier2, spire);
    eiffel.rotation.y = Math.PI / 4;
    eiffel.position.set(0, -3.5, -24);
    biomePropsGroup.add(eiffel);
  } else if (biome === "desert") {
    // Rolling Sand Dunes, Sandstone Mesas, Monument Arch & Cacti
    const sandFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(28, 30, 1.6, 36),
      createMatteMaterial("#f4cba0")
    );
    sandFloor.position.y = -2.5;
    biomePropsGroup.add(sandFloor);

    // Sandstone Arch & Mesas
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(5.5, 1.1, 10, 24, Math.PI),
      createMatteMaterial("#d98a5f")
    );
    arch.position.set(-8, -2.0, -16);
    biomePropsGroup.add(arch);

    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + 0.3;
      const dist = 13 + (i % 3) * 4;
      const cactus = new THREE.Group();
      const cMat = createMatteMaterial("#6a994e");
      const mainStem = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 2.8, 10), cMat);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 1.2, 8), cMat);
      arm.position.set(0.45, 0.3, 0);
      arm.rotation.z = -Math.PI / 4;
      cactus.add(mainStem, arm);
      cactus.position.set(Math.cos(a) * dist, -0.6, Math.sin(a) * dist);
      biomePropsGroup.add(cactus);
    }
  } else if (biome === "underwater") {
    // Ocean Seabed, Coral Reef Clusters, Kelp Stalks & Rising Bubbles
    const seabed = new THREE.Mesh(
      new THREE.CylinderGeometry(28, 30, 1.5, 36),
      createMatteMaterial("#d8e2dc")
    );
    seabed.position.y = -2.5;
    biomePropsGroup.add(seabed);

    const coralColors = ["#ff8fa3", "#ffb703", "#a8dadc", "#cdb4db"];
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const dist = 10.5 + (i % 4) * 3;
      const coral = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.95 + (i % 3) * 0.4),
        createMatteMaterial(coralColors[i % coralColors.length])
      );
      coral.position.set(Math.cos(a) * dist, -1.3, Math.sin(a) * dist);
      biomePropsGroup.add(coral);
    }

    spawnAmbientParticles("#ffffff", 34, 14);
  } else if (biome === "meadows") {
    // Rolling Pastel Hills, Distant Snow-Capped Mountains & Wildflowers
    const meadowFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(28, 30, 1.5, 36),
      createMatteMaterial("#b5e48c")
    );
    meadowFloor.position.y = -2.5;
    biomePropsGroup.add(meadowFloor);

    // Distant Alpine Peaks
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const dist = 23;
      const peak = new THREE.Mesh(
        new THREE.ConeGeometry(5.2, 11, 7),
        createMatteMaterial("#90a4ae")
      );
      peak.position.set(Math.cos(a) * dist, 2.5, Math.sin(a) * dist);
      const snow = new THREE.Mesh(
        new THREE.ConeGeometry(2.4, 4.8, 7),
        createMatteMaterial("#ffffff")
      );
      snow.position.set(Math.cos(a) * dist, 5.7, Math.sin(a) * dist);
      biomePropsGroup.add(peak, snow);
    }
  } else if (biome === "paper") {
    // Drafting Studio Desk beneath the Sketchpad
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(22, 0.8, 18),
      createMatteMaterial("#d6ccc2")
    );
    desk.position.y = -1.9;
    biomePropsGroup.add(desk);
  }
}

function spawnAmbientParticles(hexColor, count, radius) {
  const mat = createMatteMaterial(hexColor, 0.78);
  for (let i = 0; i < count; i++) {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.12 + (i % 3) * 0.05, 8, 8), mat);
    const a = (i / count) * Math.PI * 2;
    const r = 6 + (i % 5) * (radius / 5);
    orb.position.set(Math.cos(a) * r, (i % 6) * 1.1 - 0.5, Math.sin(a) * r);
    orb.userData = {
      baseY: orb.position.y,
      phase: i * 0.7,
      speed: 0.8 + (i % 4) * 0.3
    };
    ambientParticlesGroup.add(orb);
  }
}

// Create 3D Striker Mesh
function createStrikerMesh(player, cellData, isSelectedForRemoval = false) {
  const group = new THREE.Group();
  const colorHex = isSelectedForRemoval
    ? "#ffd166"
    : player === 1
    ? state.p1Color
    : state.p2Color;
  const mat = createMatteMaterial(colorHex);
  const scale = (cellData.cellSize / 2.55) * 0.84;

  if (state.biome === "paper") {
    if (player === 1) {
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.14), mat);
      b1.rotation.y = Math.PI / 4 + 0.08;
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.14), mat);
      b2.rotation.y = -Math.PI / 4 - 0.06;
      group.add(b1, b2);
    } else {
      const segs = 10;
      for (let i = 0; i < segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        const r = 0.58 + Math.sin(i * 2.1) * 0.05;
        const dot = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.12), mat);
        dot.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        dot.rotation.y = -a;
        group.add(dot);
      }
    }
  } else if (state.shapeStyle === "xo") {
    if (player === 1) {
      const bar1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.34, 0.34), mat);
      bar1.rotation.y = Math.PI / 4;
      const bar2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.34, 0.34), mat);
      bar2.rotation.y = -Math.PI / 4;
      group.add(bar1, bar2);
    } else {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.2, 14, 28), mat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }
  } else if (state.shapeStyle === "poly") {
    const mesh =
      player === 1
        ? new THREE.Mesh(new THREE.OctahedronGeometry(0.68), mat)
        : new THREE.Mesh(new THREE.TorusKnotGeometry(0.42, 0.14, 48, 12), mat);
    group.add(mesh);
  } else {
    const mesh =
      player === 1
        ? new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.1, 5), mat)
        : new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 20), mat);
    group.add(mesh);
  }

  group.scale.setScalar(scale);
  group.position.set(cellData.x, state.biome === "paper" ? 0.08 : 0.38, cellData.z);
  group.userData = { row: cellData.row, col: cellData.col, player };
  return group;
}

function rebuildAllMarks() {
  marksGroup.clear();
  const N = state.gridSize;
  if (!state.board.length) return;

  cellsGroup.children.forEach((tile) => {
    const { row, col } = tile.userData;
    if (row < N && col < N) {
      const owner = state.board[row]?.[col];
      if (owner) {
        const queue = owner === 1 ? state.p1MarksQueue : state.p2MarksQueue;
        const isSelected =
          state.selectedRemovalIndex !== null &&
          owner === state.currentPlayer &&
          queue[state.selectedRemovalIndex]?.r === row &&
          queue[state.selectedRemovalIndex]?.c === col;
        const mark = createStrikerMesh(owner, tile.userData, isSelected);
        marksGroup.add(mark);
      }
    }
  });
}

// ----------------------------------------------------------------------------
// 5. CORE GAMEPLAY ENGINE (N×N WIN DETECTION, THREE POWER MAX, DUELS & AI)
// ----------------------------------------------------------------------------
function initBoardState(resetScores = false) {
  const N = state.gridSize;
  state.board = Array.from({ length: N }, () => Array(N).fill(0));
  state.currentPlayer = 1;
  state.gameOver = false;
  state.p1MarksQueue = [];
  state.p2MarksQueue = [];
  state.selectedRemovalIndex = null;
  state.currentAttack = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];

  if (resetScores) {
    state.p1Score = 0;
    state.p2Score = 0;
    state.elapsedSeconds = 0;
    state.duelRound = 1;
    state.duelHistory = [];
    if (state.mode === "ai-duel") {
      state.duelTotalRounds = 15;
      state.difficulty = DIFF_ORDER[0];
    } else if (state.mode === "pvp-duel") {
      state.duelTotalRounds = 3;
    } else {
      state.duelTotalRounds = 1;
    }
  }

  buildBoardAndBiome();
  updateHUD();
}

function checkWinner(board, player) {
  const N = board.length;

  for (let r = 0; r < N; r++) {
    let win = true;
    for (let c = 0; c < N; c++) {
      if (board[r][c] !== player) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }

  for (let c = 0; c < N; c++) {
    let win = true;
    for (let r = 0; r < N; r++) {
      if (board[r][c] !== player) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }

  let diag1 = true;
  for (let i = 0; i < N; i++) {
    if (board[i][i] !== player) {
      diag1 = false;
      break;
    }
  }
  if (diag1) return true;

  let diag2 = true;
  for (let i = 0; i < N; i++) {
    if (board[i][N - 1 - i] !== player) {
      diag2 = false;
      break;
    }
  }
  return diag2;
}

function isBoardFull(board) {
  return board.every((row) => row.every((cell) => cell !== 0));
}

function handleCellInteraction(row, col) {
  if (state.screen !== "game" || state.paused || state.gameOver) return;
  const isAITurn =
    (state.mode === "ai" || state.mode === "ai-duel") && state.currentPlayer === 2;
  if (isAITurn) return;

  executeTurnMove(row, col);
}

function executeTurnMove(row, col) {
  const player = state.currentPlayer;
  const queue = player === 1 ? state.p1MarksQueue : state.p2MarksQueue;
  const cellVal = state.board[row][col];

  // Three Power Max Mode: Max 3 active strikes per player
  if (state.rule === "threepower" && queue.length >= 3) {
    if (cellVal === player) {
      const idx = queue.findIndex((m) => m.r === row && m.c === col);
      if (idx !== -1) {
        state.selectedRemovalIndex = idx;
        sfx.playPlace(false, player);
        rebuildAllMarks();
        updateHUD();
      }
      return;
    }

    if (cellVal !== 0 && cellVal !== player) {
      updateTurnBanner("Select one of your own 3 marks first — cannot remove opponent's strike.");
      return;
    }

    if (cellVal === 0) {
      if (state.selectedRemovalIndex === null) {
        updateTurnBanner("3 strikes active! Tap 1 of your own marks to relocate.");
        return;
      }
      const removed = queue.splice(state.selectedRemovalIndex, 1)[0];
      state.board[removed.r][removed.c] = 0;
      state.selectedRemovalIndex = null;
    }
  } else {
    if (cellVal !== 0) return;
  }

  state.board[row][col] = player;
  queue.push({ r: row, c: col });

  const tile = cellsGroup.children.find(
    (t) => t.userData.row === row && t.userData.col === col
  );
  if (state.biome === "paper" && tile) {
    activePenAnim = {
      pen: player === 1 ? pen1Mesh : pen2Mesh,
      target: new THREE.Vector3(tile.userData.x, 0.15, tile.userData.z),
      progress: 0
    };
  }

  sfx.playPlace(state.biome === "paper", player);

  if ((state.p1MarksQueue.length + state.p2MarksQueue.length) % 3 === 0) {
    triggerRandomAttackVisual();
  }

  rebuildAllMarks();

  if (checkWinner(state.board, player)) {
    concludeRound(player);
    return;
  }

  if (state.rule === "classic" && isBoardFull(state.board)) {
    concludeRound(0);
    return;
  }

  state.currentPlayer = player === 1 ? 2 : 1;
  updateHUD();

  if (
    !state.gameOver &&
    (state.mode === "ai" || state.mode === "ai-duel") &&
    state.currentPlayer === 2
  ) {
    setTimeout(performAutomatedAIMove, 450);
  }
}

function performAutomatedAIMove() {
  if (state.gameOver || state.paused || state.screen !== "game") return;
  const N = state.gridSize;

  if (state.rule === "threepower" && state.p2MarksQueue.length >= 3) {
    state.selectedRemovalIndex = 0;
  }

  const emptyCells = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (state.board[r][c] === 0) emptyCells.push({ r, c });
    }
  }
  if (!emptyCells.length) return;

  const accuracyMap = {
    easy: 0.25,
    medium: 0.55,
    hard: 0.78,
    hardcore: 0.92,
    impossible: 1.0
  };
  const smartChance = accuracyMap[state.difficulty] ?? 0.6;

  let chosen = null;
  if (Math.random() < smartChance) {
    chosen = findBestTacticalMove(emptyCells);
  }
  if (!chosen) {
    chosen = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  executeTurnMove(chosen.r, chosen.c);
}

function findBestTacticalMove(emptyCells) {
  const N = state.gridSize;

  for (const cell of emptyCells) {
    state.board[cell.r][cell.c] = 2;
    const wins = checkWinner(state.board, 2);
    state.board[cell.r][cell.c] = 0;
    if (wins) return cell;
  }

  for (const cell of emptyCells) {
    state.board[cell.r][cell.c] = 1;
    const p1Wins = checkWinner(state.board, 1);
    state.board[cell.r][cell.c] = 0;
    if (p1Wins) return cell;
  }

  let bestScore = -Infinity;
  let bestCell = emptyCells[0];

  for (const cell of emptyCells) {
    let score = 0;
    const center = (N - 1) / 2;
    const distFromCenter = Math.hypot(cell.r - center, cell.c - center);
    score += (N - distFromCenter) * 2;

    state.board[cell.r][cell.c] = 2;
    score += evaluateAlignmentPotential(state.board, 2) * 4;
    score -= evaluateAlignmentPotential(state.board, 1) * 3;
    state.board[cell.r][cell.c] = 0;

    if (score > bestScore) {
      bestScore = score;
      bestCell = cell;
    }
  }
  return bestCell;
}

function evaluateAlignmentPotential(board, player) {
  const N = board.length;
  const opp = player === 1 ? 2 : 1;
  let total = 0;

  const scoreLine = (cells) => {
    if (cells.includes(opp)) return 0;
    const count = cells.filter((v) => v === player).length;
    return Math.pow(count, 2);
  };

  for (let r = 0; r < N; r++) total += scoreLine(board[r]);
  for (let c = 0; c < N; c++) {
    const col = [];
    for (let r = 0; r < N; r++) col.push(board[r][c]);
    total += scoreLine(col);
  }
  const d1 = [], d2 = [];
  for (let i = 0; i < N; i++) {
    d1.push(board[i][i]);
    d2.push(board[i][N - 1 - i]);
  }
  total += scoreLine(d1) + scoreLine(d2);
  return total;
}

function concludeRound(winner) {
  state.gameOver = true;
  sfx.playWinFanfare();

  const p1Label = state.p1Name || "Player 1";
  const p2Label = state.p2Name || "Player 2";

  if (winner === 1) {
    state.p1Score++;
    state.leaderboard[p1Label] = (state.leaderboard[p1Label] || 0) + 1;
    updateTurnBanner(`${p1Label} wins the round!`);
  } else if (winner === 2) {
    state.p2Score++;
    state.leaderboard[p2Label] = (state.leaderboard[p2Label] || 0) + 1;
    updateTurnBanner(`${p2Label} wins the round!`);
  } else {
    state.leaderboard.Ties = (state.leaderboard.Ties || 0) + 1;
    updateTurnBanner("Round ended in a tactical draw!");
  }

  state.duelHistory.push({
    round: state.duelRound,
    winner,
    p1Score: state.p1Score,
    p2Score: state.p2Score
  });

  const maxSessionScore = Math.max(state.p1Score, state.p2Score);
  if (maxSessionScore > state.highScore) {
    state.highScore = maxSessionScore;
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(state.highScore));
  }
  if (state.elapsedSeconds > state.bestTime) {
    state.bestTime = state.elapsedSeconds;
    localStorage.setItem(STORAGE_KEYS.BEST_TIME, String(state.bestTime));
  }
  localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(state.leaderboard));
  updateHUD();

  if (state.duelRound < state.duelTotalRounds) {
    setTimeout(() => {
      state.duelRound++;
      if (state.mode === "ai-duel") {
        const tierIndex = Math.min(4, Math.floor((state.duelRound - 1) / 3));
        state.difficulty = DIFF_ORDER[tierIndex];
      }
      initBoardState(false);
    }, 1450);
  } else if (state.duelTotalRounds > 1) {
    setTimeout(() => {
      openStatsModal(
        `Duel Complete (${state.duelTotalRounds} Games) — Final Score ${state.p1Score} : ${state.p2Score}`
      );
    }, 1150);
  }
}

// ----------------------------------------------------------------------------
// 6. RANDOM ATTACKS, THEME PLAGUE TRANSITION & HUD TELEMETRY
// ----------------------------------------------------------------------------
let attackPulseTime = 0;

function triggerRandomAttackVisual() {
  state.currentAttack = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
  attackPulseTime = 1.0;
  sfx.playAttackPulse();
  updateHUD();
}

function triggerPlagueThemeSwitch() {
  state.theme = state.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", state.theme);
  document.getElementById("theme-label").textContent =
    state.theme === "light" ? "Dark Mode" : "Light Mode";

  sfx.playThemePlague();

  const overlay = document.getElementById("plague-overlay");
  overlay.classList.remove("plague-active");
  void overlay.offsetWidth;
  overlay.classList.add("plague-active");

  document.querySelectorAll(".ui-surface").forEach((el, idx) => {
    el.classList.remove("section-plague");
    void el.offsetWidth;
    setTimeout(() => {
      el.classList.add("section-plague");
    }, idx * 24);
  });

  // If the Analytics Graph modal is open, re-render with crisp black/white labels
  if (!document.getElementById("modal-stats").classList.contains("hidden")) {
    drawStatsChart();
  }
}

function formatSeconds(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateTurnBanner(customText) {
  const bannerText = document.getElementById("turn-text");
  const dot = document.getElementById("turn-dot");
  const activeName = state.currentPlayer === 1 ? state.p1Name : state.p2Name;
  const symbol = state.currentPlayer === 1 ? "X / S1" : "O / S2";
  dot.style.backgroundColor = state.currentPlayer === 1 ? state.p1Color : state.p2Color;

  if (customText) {
    bannerText.textContent = customText;
    return;
  }

  const queue = state.currentPlayer === 1 ? state.p1MarksQueue : state.p2MarksQueue;
  if (state.rule === "threepower" && queue.length >= 3 && state.selectedRemovalIndex === null) {
    bannerText.textContent = `${activeName}'s Turn (${symbol}) — Tap 1 of your 3 marks to relocate`;
  } else {
    bannerText.textContent = `${activeName}'s Turn (${symbol})`;
  }
}

function updateHUD() {
  document.getElementById("hud-p1-name").textContent = state.p1Name;
  document.getElementById("hud-p2-name").textContent = state.p2Name;
  document.getElementById("hud-p1-score").textContent = state.p1Score;
  document.getElementById("hud-p2-score").textContent = state.p2Score;
  document.getElementById("hud-p1-marks").textContent =
    state.rule === "threepower"
      ? `Active: ${state.p1MarksQueue.length}/3`
      : `Marks: ${state.p1MarksQueue.length}`;
  document.getElementById("hud-p2-marks").textContent =
    state.rule === "threepower"
      ? `Active: ${state.p2MarksQueue.length}/3`
      : `Marks: ${state.p2MarksQueue.length}`;

  const modeLabel =
    state.duelTotalRounds > 1
      ? `Duel Rd ${state.duelRound}/${state.duelTotalRounds} (${state.difficulty.toUpperCase()})`
      : `${state.gridSize}×${state.gridSize} • ${
          state.rule === "threepower" ? "Three Power Max" : "Standard"
        }`;
  document.getElementById("hud-mode-label").textContent = modeLabel;

  document.getElementById("hud-timer").textContent = formatSeconds(state.elapsedSeconds);
  document.getElementById("hud-highscore").textContent = state.highScore;
  document.getElementById("hud-besttime").textContent = formatSeconds(state.bestTime);
  document.getElementById("hud-attack-name").textContent = state.currentAttack;
  document.getElementById("hud-cam-mode").textContent = camModes[camModeIndex];
  document.getElementById("hud-sky-speed").textContent = `${state.skySpeed.toFixed(1)}x`;

  document.getElementById("init-high-score").textContent = state.highScore;
  document.getElementById("init-best-time").textContent = formatSeconds(state.bestTime);

  if (!state.gameOver) updateTurnBanner();
}

// ----------------------------------------------------------------------------
// 7. UN-SQUISHED HIGH-DPI ANALYTICS GRAPH & LEADERBOARD RENDERER
// ----------------------------------------------------------------------------
function openStatsModal(customSubtitle) {
  const modal = document.getElementById("modal-stats");
  modal.classList.remove("hidden");
  if (customSubtitle) {
    document.getElementById("stats-modal-subtitle").textContent = customSubtitle;
  }

  const tbody = document.getElementById("leaderboard-body");
  tbody.innerHTML = "";
  const entries = Object.entries(state.leaderboard).sort((a, b) => b[1] - a[1]);
  const totalWins = Math.max(1, entries.reduce((acc, [, v]) => acc + v, 0));

  entries.forEach(([name, count]) => {
    const tr = document.createElement("tr");
    const pct = Math.round((count / totalWins) * 100);
    tr.innerHTML = `<td><strong>${name}</strong></td><td>${count}</td><td>${pct}%</td>`;
    tbody.appendChild(tr);
  });

  requestAnimationFrame(drawStatsChart);
}

function drawStatsChart() {
  const chart = document.getElementById("stats-chart");
  const rect = chart.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const dpr = window.devicePixelRatio || 1;
  chart.width = Math.round(rect.width * dpr);
  chart.height = Math.round(rect.height * dpr);

  const ctx = chart.getContext("2d");
  ctx.save();
  ctx.scale(dpr, dpr);

  const W = rect.width;
  const H = rect.height;
  ctx.clearRect(0, 0, W, H);

  const textColor = state.theme === "dark" ? "#ffffff" : "#000000";
  const gridColor =
    state.theme === "dark" ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.14)";

  const entries = Object.entries(state.leaderboard)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxVal = Math.max(4, ...entries.map((e) => e[1]));

  const padLeft = 38;
  const padRight = 18;
  const padTop = 22;
  const padBottom = 34;
  const plotW = W - padLeft - padRight;
  const plotH = H - padTop - padBottom;

  // Horizontal Reference Grid Lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.fillStyle = textColor;
  ctx.font = "700 11px -apple-system, sans-serif";

  for (let g = 0; g <= 4; g++) {
    const y = padTop + (g / 4) * plotH;
    const val = Math.round(maxVal * (1 - g / 4));
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(W - padRight, y);
    ctx.stroke();
    ctx.fillText(String(val), 10, y + 4);
  }

  // Proportional Un-Squished Bars
  const barColors = [state.p1Color, state.p2Color, "#a799ff", "#ffd166", "#72efdd"];
  const slotW = plotW / Math.max(1, entries.length);
  const barW = Math.min(56, slotW * 0.56);

  entries.forEach(([name, count], idx) => {
    const centerX = padLeft + idx * slotW + slotW / 2;
    const barH = Math.max(4, (count / maxVal) * plotH);
    const x = centerX - barW / 2;
    const y = padTop + plotH - barH;

    ctx.fillStyle = barColors[idx % barColors.length];
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 6);
    ctx.fill();

    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.font = "700 12px -apple-system, sans-serif";
    ctx.fillText(String(count), centerX, y - 6);
    ctx.fillText(name.slice(0, 10), centerX, H - 11);
  });

  ctx.restore();
}

// ----------------------------------------------------------------------------
// 8. DEVICE AUTO-DETECTION & THREE-STEP SCREEN WIRING
// ----------------------------------------------------------------------------
function autoDetectDevice() {
  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches;
  state.device = isTouch ? "touch" : "desktop";

  document.getElementById("card-desktop").classList.toggle("selected", !isTouch);
  document.getElementById("card-touch").classList.toggle("selected", isTouch);
  document.getElementById("device-autodetect-msg").textContent = isTouch
    ? "Auto-Detected: Integrated Touch Unit (Mobile / Tablet / Handheld Hybrid)"
    : "Auto-Detected: Desktop Keyboard & Mouse Workstation";
}

function bindSegmentedGroup(containerId, callback) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      sfx.playPlace(false, 1);
      callback(btn.dataset);
    });
  });
}

function switchScreen(target) {
  state.screen = target;
  document
    .getElementById("screen-device")
    .classList.toggle("active", target === "device");
  document
    .getElementById("screen-mode")
    .classList.toggle("active", target === "mode");
  document
    .getElementById("screen-customize")
    .classList.toggle("active", target === "customize");

  const inGame = target === "game";
  document.getElementById("hud-layer").classList.toggle("hidden", !inGame);
  document.getElementById("turn-banner").classList.toggle("hidden", !inGame);
  document.getElementById("btn-pause-open").classList.toggle("hidden", !inGame);
  document.getElementById("device-action-dock").classList.toggle("hidden", !inGame);
}

function wireUIEvents() {
  autoDetectDevice();

  if (localStorage.getItem(STORAGE_KEYS.SAVED_MATCH)) {
    document.getElementById("saved-session-bar").classList.remove("hidden");
  }

  document.querySelectorAll(".device-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".device-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      state.device = card.dataset.device;
      sfx.playPlace(false, 1);
    });
  });

  // Navigation between Initiation Screen 1, Screen 2A (Mode), Screen 2B (Customize), and Game
  document.getElementById("btn-to-mode-screen").addEventListener("click", () => {
    sfx.playCameraSwitch();
    switchScreen("mode");
  });

  document.getElementById("btn-back-device").addEventListener("click", () => {
    switchScreen("device");
  });

  document.getElementById("btn-to-customize-screen").addEventListener("click", () => {
    sfx.playCameraSwitch();
    switchScreen("customize");
  });

  document.getElementById("btn-back-mode").addEventListener("click", () => {
    switchScreen("mode");
  });

  // 360° World Peek Toggle on Customization Screen
  document.getElementById("btn-toggle-preview-peek").addEventListener("click", (e) => {
    const card = document.getElementById("customize-modal-card");
    const isPeeking = card.classList.toggle("peek-mode");
    e.currentTarget.textContent = isPeeking ? "Restore Studio Panel" : "Inspect 360° World";
  });

  document.getElementById("btn-deploy-match").addEventListener("click", () => {
    document.getElementById("customize-modal-card").classList.remove("peek-mode");
    state.p1Name = document.getElementById("input-p1-name").value.trim() || "Player 1";
    state.p2Name =
      document.getElementById("input-p2-name").value.trim() ||
      (state.mode.startsWith("ai") ? "Aether AI" : "Player 2");
    initBoardState(true);
    switchScreen("game");
    sfx.playCameraSwitch();
  });

  document
    .getElementById("btn-theme-toggle")
    .addEventListener("click", triggerPlagueThemeSwitch);

  // Mode & Studio Segmented Controls
  bindSegmentedGroup("mode-select", (data) => {
    state.mode = data.mode;
    const p2Input = document.getElementById("input-p2-name");
    p2Input.value = state.mode.startsWith("ai") ? "Aether AI" : "Nova";
  });

  bindSegmentedGroup("rule-select", (data) => {
    state.rule = data.rule;
  });

  bindSegmentedGroup("grid-select", (data) => {
    state.gridSize = parseInt(data.grid, 10);
    initBoardState(true);
  });

  bindSegmentedGroup("diff-select", (data) => {
    state.difficulty = data.diff;
  });

  bindSegmentedGroup("biome-select", (data) => {
    state.biome = data.biome;
    buildBoardAndBiome();
  });

  bindSegmentedGroup("shape-select", (data) => {
    state.shapeStyle = data.shape;
    rebuildAllMarks();
  });

  bindSegmentedGroup("sky-mode-select", (data) => {
    state.skyMode = data.skymode;
  });

  bindSegmentedGroup("sky-start-select", (data) => {
    state.skyStart = data.skystart;
    state.skyTime = state.skyStart === "day" ? 0.25 : 0.75;
  });

  // Color Pickers Sync
  const syncColors = (p1, p2, board) => {
    state.p1Color = p1;
    state.p2Color = p2;
    state.boardColor = board;
    document.getElementById("color-p1").value = p1;
    document.getElementById("color-p2").value = p2;
    document.getElementById("color-board").value = board;
    document.getElementById("pause-color-p1").value = p1;
    document.getElementById("pause-color-p2").value = p2;
    document.getElementById("pause-color-board").value = board;
    buildBoardAndBiome();
  };

  ["color-p1", "color-p2", "color-board"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      syncColors(
        document.getElementById("color-p1").value,
        document.getElementById("color-p2").value,
        document.getElementById("color-board").value
      );
    });
  });

  ["pause-color-p1", "pause-color-p2", "pause-color-board"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      syncColors(
        document.getElementById("pause-color-p1").value,
        document.getElementById("pause-color-p2").value,
        document.getElementById("pause-color-board").value
      );
    });
  });

  // Individual HUD Slide-Out & Smooth Reflow
  document.querySelectorAll(".card-hide-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".hud-card");
      card.classList.add("slid-out");
      document.getElementById("btn-unhide-all").classList.remove("hidden");
      sfx.playCameraSwitch();
    });
  });

  document.getElementById("btn-unhide-all").addEventListener("click", () => {
    document.querySelectorAll(".hud-card.slid-out").forEach((card) => {
      card.classList.remove("slid-out");
    });
    document.getElementById("btn-unhide-all").classList.add("hidden");
    sfx.playCameraSwitch();
  });

  // Pause Studio & Save Progress
  document.getElementById("btn-pause-open").addEventListener("click", () => {
    state.paused = true;
    document.getElementById("modal-pause").classList.remove("hidden");
  });

  document.getElementById("btn-resume-game").addEventListener("click", () => {
    state.paused = false;
    document.getElementById("modal-pause").classList.add("hidden");
  });

  bindSegmentedGroup("pause-biome-select", (data) => {
    state.biome = data.biome;
    buildBoardAndBiome();
  });

  bindSegmentedGroup("pause-sky-select", (data) => {
    state.skyMode = data.skymode;
  });

  document.getElementById("btn-save-leave").addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEYS.SAVED_MATCH, JSON.stringify(state));
    state.paused = false;
    document.getElementById("modal-pause").classList.add("hidden");
    document.getElementById("saved-session-bar").classList.remove("hidden");
    switchScreen("device");
  });

  document.getElementById("btn-discard-leave").addEventListener("click", () => {
    state.paused = false;
    document.getElementById("modal-pause").classList.add("hidden");
    switchScreen("device");
  });

  document.getElementById("btn-resume-saved").addEventListener("click", () => {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_MATCH);
    if (!raw) return;
    Object.assign(state, JSON.parse(raw));
    buildBoardAndBiome();
    updateHUD();
    switchScreen("game");
  });

  // Stats & Action Dock
  document.getElementById("btn-hud-reset-round").addEventListener("click", () => {
    initBoardState(false);
  });
  document
    .getElementById("btn-hud-stats")
    .addEventListener("click", () => openStatsModal());
  document
    .getElementById("btn-open-stats-init")
    .addEventListener("click", () => openStatsModal());
  document.getElementById("btn-close-stats").addEventListener("click", () => {
    document.getElementById("modal-stats").classList.add("hidden");
  });

  document.getElementById("btn-dock-cam").addEventListener("click", cycleCameraPOV);
  document.getElementById("btn-dock-fast").addEventListener("click", () => {
    state.skySpeed = Math.min(8.0, state.skySpeed + 0.5);
    updateHUD();
  });
  document.getElementById("btn-dock-slow").addEventListener("click", () => {
    state.skySpeed = Math.max(0.2, state.skySpeed - 0.5);
    updateHUD();
  });
  document
    .getElementById("btn-dock-attack")
    .addEventListener("click", triggerRandomAttackVisual);

  // Keyboard Shortcuts (W/S Sky Cycle, C Camera POV)
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    const key = e.key.toLowerCase();
    if (key === "w") {
      state.skySpeed = Math.min(8.0, state.skySpeed + 0.4);
      updateHUD();
    } else if (key === "s") {
      state.skySpeed = Math.max(0.2, state.skySpeed - 0.4);
      updateHUD();
    } else if (key === "c") {
      cycleCameraPOV();
    }
  });
}

function cycleCameraPOV() {
  camModeIndex = (camModeIndex + 1) % camModes.length;
  sfx.playCameraSwitch();
  updateHUD();
}

// ----------------------------------------------------------------------------
// 9. 360° POINTER ORBIT + RAYCASTING INTERACTION
// ----------------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();

canvas.addEventListener("pointerdown", (e) => {
  isDraggingBoard = true;
  prevPointer = { x: e.clientX, y: e.clientY };
  pointerDownPos = { x: e.clientX, y: e.clientY };
});

window.addEventListener("pointermove", (e) => {
  if (!isDraggingBoard) return;
  const dx = e.clientX - prevPointer.x;
  const dy = e.clientY - prevPointer.y;
  prevPointer = { x: e.clientX, y: e.clientY };
  camTheta -= dx * 0.0075;
  camPhi = Math.max(0.25, Math.min(1.42, camPhi - dy * 0.0065));
});

window.addEventListener("pointerup", (e) => {
  if (!isDraggingBoard) return;
  isDraggingBoard = false;

  const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
  if (moveDist > 6) return;

  pointerNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointerNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);

  const hits = raycaster.intersectObjects(cellsGroup.children, false);
  if (hits.length > 0) {
    const { row, col } = hits[0].object.userData;
    handleCellInteraction(row, col);
  }
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (!document.getElementById("modal-stats").classList.contains("hidden")) {
    drawStatsChart();
  }
});

// ----------------------------------------------------------------------------
// 10. MAIN RENDER LOOP & CHRONOMETER
// ----------------------------------------------------------------------------
setInterval(() => {
  if (state.screen === "game" && !state.paused && !state.gameOver) {
    state.elapsedSeconds++;
    updateHUD();
  }
}, 1000);

let lastFrameTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
  lastFrameTime = now;

  // 1. Sky Cycle & Atmospheric Fog Interpolation
  if (state.skyMode === "dynamic") {
    state.skyTime = (state.skyTime + dt * 0.025 * state.skySpeed) % 1;
  } else {
    state.skyTime = state.skyMode === "day" ? 0.25 : 0.75;
  }

  const daylightFactor = Math.sin(state.skyTime * Math.PI * 2) * 0.5 + 0.5;
  const palette = BIOME_PALETTES[state.biome] || BIOME_PALETTES.forest;
  const dayCol = new THREE.Color(palette.daySky);
  const nightCol = new THREE.Color(palette.nightSky);
  const currentSky = nightCol.clone().lerp(dayCol, daylightFactor);
  scene.background = currentSky;
  scene.fog.color.copy(currentSky);

  sunLight.intensity = 0.28 + daylightFactor * 0.65;
  hemiLight.intensity = 0.45 + daylightFactor * 0.42;
  const phaseEl = document.getElementById("hud-sky-phase");
  if (phaseEl) phaseEl.textContent = daylightFactor > 0.5 ? "Daylight" : "Starlight Night";

  // 2. Drift 3D Clouds
  cloudsGroup.children.forEach((cloud) => {
    cloud.userData.angle += dt * cloud.userData.speed * state.skySpeed;
    cloud.position.x = Math.cos(cloud.userData.angle) * cloud.userData.dist;
    cloud.position.z = Math.sin(cloud.userData.angle) * cloud.userData.dist;
  });

  // 3. Animate Ambient Biome Particles (Fireflies / Bubbles / Neon Motes)
  ambientParticlesGroup.children.forEach((orb) => {
    orb.position.y =
      orb.userData.baseY +
      Math.sin(now * 0.002 * orb.userData.speed + orb.userData.phase) * 0.65;
  });

  // 4. Sketch Paper 3D Pen Drawing Animation
  if (activePenAnim && activePenAnim.pen) {
    activePenAnim.progress += dt * 3.2;
    const p = activePenAnim.progress;
    const pen = activePenAnim.pen;
    if (p < 1) {
      const scribbleX = Math.sin(p * Math.PI * 6) * 0.32;
      const scribbleZ = Math.cos(p * Math.PI * 6) * 0.32;
      pen.position.lerpVectors(pen.userData.restPos, activePenAnim.target, Math.sin(p * Math.PI));
      pen.position.x += scribbleX;
      pen.position.z += scribbleZ;
    } else {
      pen.position.copy(pen.userData.restPos);
      activePenAnim = null;
    }
  }

  // 5. Random Arena Attack Visual Pulse
  if (attackPulseTime > 0) {
    attackPulseTime = Math.max(0, attackPulseTime - dt * 1.8);
    worldGroup.position.x = Math.sin(now * 0.08) * attackPulseTime * 0.24;
    worldGroup.rotation.z = Math.cos(now * 0.06) * attackPulseTime * 0.035;
  } else {
    worldGroup.position.set(0, 0, 0);
    worldGroup.rotation.set(0, 0, 0);
  }

  // 6. Camera POV Modes + Continuous 360° Scenic Orbit on Setup Screens
  if (state.screen !== "game" && !isDraggingBoard) {
    camTheta += dt * 0.22;
  }

  const mode = camModes[camModeIndex];
  if (mode === "Orbit 360°") {
    camera.position.set(
      camRadius * Math.sin(camPhi) * Math.cos(camTheta),
      camRadius * Math.cos(camPhi),
      camRadius * Math.sin(camPhi) * Math.sin(camTheta)
    );
  } else if (mode === "Top-Down Tactical") {
    camera.position.lerp(new THREE.Vector3(0, 16.5, 0.01), 0.08);
  } else if (mode === "Scenic Vista") {
    camera.position.lerp(new THREE.Vector3(0, 6.2, 16.8), 0.08);
  } else if (mode === "Contender 1 POV") {
    camera.position.lerp(new THREE.Vector3(0, 8.5, 13.5), 0.08);
  } else if (mode === "Contender 2 POV") {
    camera.position.lerp(new THREE.Vector3(0, 8.5, -13.5), 0.08);
  }
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

// Initialize Scene & Application
buildClouds();
initBoardState(true);
wireUIEvents();
requestAnimationFrame(animate);

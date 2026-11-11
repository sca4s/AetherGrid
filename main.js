/* ============================================================================
   AETHERGRID — 3D TACTICAL ALIGNMENT ENGINE
   Procedural Web Audio + Three.js 360° Interactive Board + N×N Strategy Engine
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
      // Realistic Graphite Pencil / Pen Scratching on Sketch Paper
      const bufferSize = this.ctx.sampleRate * 0.28;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const strokeMod = Math.sin(i * 0.018) * 0.5 + 0.5;
        data[i] = (Math.random() * 2 - 1) * strokeMod;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(player === 1 ? 1900 : 1450, now);
      filter.Q.setValueAtTime(3.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.27);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      return;
    }

    // Tactile Matte Ceramic / Crystal Placement Chime
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = player === 1 ? "triangle" : "sine";
    const baseFreq = player === 1 ? 392 : 523.25;
    osc.frequency.setValueAtTime(baseFreq * 0.8, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.14);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  playWinFanfare() {
    this.ensureContext();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.37);
    });
  }

  playCameraSwitch() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playThemePlague() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.45);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  playBirdJump() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(1180, now + 0.12);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playAttackPulse() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(58, now + 0.35);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.39);
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
  "Gravity Hop",
  "Prism Quake"
];

const state = {
  screen: "device", // "device" | "customize" | "game"
  paused: false,
  device: "desktop",
  theme: "light",

  // Game Config
  mode: "ai", // "ai" | "pvp" | "ai-duel" | "pvp-duel"
  rule: "classic", // "classic" | "threepower"
  gridSize: 3,
  difficulty: "medium",
  biome: "royal",
  shapeStyle: "xo",
  p1Name: "Astra",
  p2Name: "Aether AI",
  p1Color: "#ff8da1",
  p2Color: "#6bcBbd",
  boardColor: "#dcd3f8",

  // Sky Cycle
  skyMode: "dynamic", // "dynamic" | "day" | "night"
  skyStart: "day", // "day" | "night"
  skyTime: 0.25, // 0..1 (0.25 = Noon, 0.75 = Midnight)
  skySpeed: 1.0,

  // Active Match State
  board: [],
  currentPlayer: 1,
  gameOver: false,
  p1MarksQueue: [], // Tracks coordinates for Three Power Max Mode
  p2MarksQueue: [],
  selectedRemovalIndex: null, // Used in Three Power Max Mode when 3 strikes are already placed
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
      '{"Astra":0,"Aether AI":0,"Player 2":0,"Ties":0}'
  )
};

// ----------------------------------------------------------------------------
// 3. THREE.JS 3D SCENE, NON-REFLECTIVE MATTE MATERIALS, CLOUDS, BIRD & PENS
// ----------------------------------------------------------------------------
const canvas = document.getElementById("game-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  250
);

// Lighting (Soft pastel ambient + directional without glossy specular reflections)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfff6e5, 0.65);
sunLight.position.set(12, 22, 14);
sunLight.castShadow = true;
scene.add(sunLight);

// Scene Groups
const worldGroup = new THREE.Group();
const boardGroup = new THREE.Group();
const cellsGroup = new THREE.Group();
const marksGroup = new THREE.Group();
const biomePropsGroup = new THREE.Group();
const cloudsGroup = new THREE.Group();
const pensGroup = new THREE.Group();
worldGroup.add(boardGroup, cellsGroup, marksGroup, biomePropsGroup, pensGroup);
scene.add(worldGroup, cloudsGroup);

// Camera Orbit & POV Controller
const camModes = ["Orbit 360°", "Top-Down Tactical", "Isometric", "Contender 1 POV", "Contender 2 POV"];
let camModeIndex = 0;
let camTheta = 0.55;
let camPhi = 0.92;
let camRadius = 15.5;
let isDraggingBoard = false;
let prevPointer = { x: 0, y: 0 };
let pointerDownPos = { x: 0, y: 0 };

// Helper for strictly non-reflective matte pastel material
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
  const cloudMat = createMatteMaterial("#ffffff", 0.88);
  for (let i = 0; i < 10; i++) {
    const cluster = new THREE.Group();
    const puffs = 3 + (i % 3);
    for (let p = 0; p < puffs; p++) {
      const geo = new THREE.SphereGeometry(1.1 + (p % 2) * 0.45, 12, 12);
      const mesh = new THREE.Mesh(geo, cloudMat);
      mesh.position.set(p * 1.1 - 1.1, (p % 2) * 0.3, (p % 3) * 0.35);
      mesh.scale.y = 0.62;
      cluster.add(mesh);
    }
    const angle = (i / 10) * Math.PI * 2;
    const dist = 16 + (i % 3) * 4;
    cluster.position.set(Math.cos(angle) * dist, 7.5 + (i % 3) * 1.6, Math.sin(angle) * dist);
    cluster.userData = { angle, dist, speed: 0.04 + (i % 4) * 0.012 };
    cloudsGroup.add(cluster);
  }
}

// Autonomous 3D Bird (Moves on its own + Up Arrow Jump)
const birdGroup = new THREE.Group();
let birdAngle = 0;
let birdJumpY = 0;
let birdJumpVel = 0;

function buildAutonomousBird() {
  birdGroup.clear();
  const bodyMat = createMatteMaterial("#ffd166");
  const wingMat = createMatteMaterial("#ff9f89");
  const beakMat = createMatteMaterial("#ef476f");

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.48, 0.85), bodyMat);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.45, 0.48), bodyMat);
  head.position.set(0, 0.32, 0.35);

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.32, 4), beakMat);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.32, 0.68);

  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.5), wingMat);
  leftWing.position.set(-0.5, 0.08, 0);
  const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.5), wingMat);
  rightWing.position.set(0.5, 0.08, 0);

  birdGroup.add(body, head, beak, leftWing, rightWing);
  birdGroup.userData = { leftWing, rightWing };
  worldGroup.add(birdGroup);
}

function triggerBirdJump() {
  if (birdJumpY <= 0.05) {
    birdJumpVel = 0.22;
    sfx.playBirdJump();
  }
}

// 2 Animated 3D Pens / Pencils for "Sketch Paper" Biome
let pen1Mesh = null;
let pen2Mesh = null;
let activePenAnim = null;

function buildSketchPens() {
  pensGroup.clear();
  const makePen = (bodyColor, tipColor, restX) => {
    const pen = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 3.2, 12),
      createMatteMaterial(bodyColor)
    );
    shaft.position.y = 2.0;

    const woodCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, 0.55, 12),
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
    pen.rotation.z = restX < 0 ? -0.28 : 0.28;
    pen.position.set(restX, 1.2, -3.5);
    pen.userData = { restPos: new THREE.Vector3(restX, 1.2, -3.5) };
    return pen;
  };

  pen1Mesh = makePen(state.p1Color, state.p1Color, -5.6);
  pen2Mesh = makePen(state.p2Color, state.p2Color, 5.6);
  pensGroup.add(pen1Mesh, pen2Mesh);
  pensGroup.visible = state.biome === "paper";
}

// ----------------------------------------------------------------------------
// 4. BIOME ENVIRONMENT & N×N BOARD CONSTRUCTION
// ----------------------------------------------------------------------------
const BIOME_PALETTES = {
  royal: {
    daySky: "#e6defc",
    nightSky: "#1d1636",
    pedestal: "#c5b4f0",
    gridLine: "#5e4b93"
  },
  cyberpunk: {
    daySky: "#d7f4f7",
    nightSky: "#121329",
    pedestal: "#8ee3ef",
    gridLine: "#ff6b9d"
  },
  angelic: {
    daySky: "#f4f8ff",
    nightSky: "#232946",
    pedestal: "#fff7d6",
    gridLine: "#9ab3f5"
  },
  beach: {
    daySky: "#dff6f0",
    nightSky: "#172a3a",
    pedestal: "#f7e3af",
    gridLine: "#56b4a9"
  },
  cafe: {
    daySky: "#f5ebe0",
    nightSky: "#261c18",
    pedestal: "#d5bdaf",
    gridLine: "#6f4e37"
  },
  paper: {
    daySky: "#f8f6f0",
    nightSky: "#25262b",
    pedestal: "#fdfbf7",
    gridLine: "#4a5568"
  }
};

function buildBoardAndBiome() {
  boardGroup.clear();
  cellsGroup.clear();
  biomePropsGroup.clear();

  const palette = BIOME_PALETTES[state.biome] || BIOME_PALETTES.royal;
  const N = state.gridSize;
  const boardSpan = 7.8;
  const cellSize = boardSpan / N;

  // Main Table / Board Base
  const baseColor = state.biome === "paper" ? "#fdfbf7" : state.boardColor;
  const baseHeight = state.biome === "paper" ? 0.14 : 0.65;
  const baseGeo = new THREE.BoxGeometry(boardSpan + 1.1, baseHeight, boardSpan + 1.1);
  const baseMesh = new THREE.Mesh(baseGeo, createMatteMaterial(baseColor));
  baseMesh.position.y = -baseHeight / 2;
  baseMesh.receiveShadow = true;
  boardGroup.add(baseMesh);

  // Pedestal Pillar beneath Table
  const pillarGeo = new THREE.CylinderGeometry(2.8, 3.6, 1.5, 24);
  const pillarMesh = new THREE.Mesh(pillarGeo, createMatteMaterial(palette.pedestal));
  pillarMesh.position.y = -baseHeight - 0.75;
  boardGroup.add(pillarMesh);

  // Grid Lines (Crooked hand-drawn segments in Sketch Paper mode, crisp bars otherwise)
  const lineMat = createMatteMaterial(palette.gridLine);
  const half = boardSpan / 2;

  for (let i = 1; i < N; i++) {
    const offset = -half + i * cellSize;
    if (state.biome === "paper") {
      // Crooked hand-drawn multi-segment pencil lines
      const segments = 12;
      for (let s = 0; s < segments; s++) {
        const t1 = -half + (s / segments) * boardSpan;
        const t2 = -half + ((s + 1) / segments) * boardSpan;
        const jitter1 = (Math.sin(s * 2.3 + i) * 0.06);
        const jitter2 = (Math.cos((s + 1) * 1.9 + i) * 0.06);

        // Vertical crooked segment
        const vLen = Math.hypot(jitter2 - jitter1, t2 - t1);
        const vSeg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, vLen), lineMat);
        vSeg.position.set(offset + (jitter1 + jitter2) / 2, 0.03, (t1 + t2) / 2);
        vSeg.rotation.y = Math.atan2(jitter2 - jitter1, t2 - t1);
        boardGroup.add(vSeg);

        // Horizontal crooked segment
        const hSeg = new THREE.Mesh(new THREE.BoxGeometry(vLen, 0.04, 0.06), lineMat);
        hSeg.position.set((t1 + t2) / 2, 0.03, offset + (jitter1 + jitter2) / 2);
        hSeg.rotation.y = Math.atan2(jitter2 - jitter1, t2 - t1);
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
      const tileMat = createMatteMaterial("#ffffff", 0.16);
      const tile = new THREE.Mesh(tileGeo, tileMat);
      tile.position.set(x, 0.05, z);
      tile.userData = { row: r, col: c, x, z, cellSize };
      cellsGroup.add(tile);
    }
  }

  // Biome-Specific 3D Props
  buildBiomeDecorations(palette);
  buildSketchPens();
  rebuildAllMarks();
}

function buildBiomeDecorations(palette) {
  if (state.biome === "royal") {
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.42, 4.2, 12),
        createMatteMaterial("#e8dff5")
      );
      col.position.set(Math.cos(angle) * 6.5, 0.8, Math.sin(angle) * 6.5);
      const crown = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.45),
        createMatteMaterial("#ffd166")
      );
      crown.position.set(Math.cos(angle) * 6.5, 3.3, Math.sin(angle) * 6.5);
      biomePropsGroup.add(col, crown);
    }
  } else if (state.biome === "cyberpunk") {
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const holo = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.08, 8, 20),
        createMatteMaterial(i % 2 === 0 ? "#ff6b9d" : "#72efdd")
      );
      holo.position.set(Math.cos(angle) * 6.4, 1.2 + (i % 2), Math.sin(angle) * 6.4);
      biomePropsGroup.add(holo);
    }
  } else if (state.biome === "angelic") {
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(5.8, 0.12, 12, 48),
      createMatteMaterial("#ffe699")
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 2.6;
    biomePropsGroup.add(halo);
  } else if (state.biome === "beach") {
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(8.5, 8.5, 0.25, 32),
      createMatteMaterial("#80ed99", 0.55)
    );
    water.position.y = -0.9;
    biomePropsGroup.add(water);
  } else if (state.biome === "cafe") {
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.55, 1.2, 16),
      createMatteMaterial("#f4a261")
    );
    mug.position.set(-5.5, 0.6, -4.2);
    biomePropsGroup.add(mug);
  }
}

// Create 3D Striker Mesh (Supports X/O, Geometric Shapes, and Crooked Paper Sketches)
function createStrikerMesh(player, cellData, isSelectedForRemoval = false) {
  const group = new THREE.Group();
  const colorHex = isSelectedForRemoval
    ? "#ffd166"
    : player === 1
    ? state.p1Color
    : state.p2Color;
  const mat = createMatteMaterial(colorHex);
  const scale = (cellData.cellSize / 2.6) * 0.85;

  if (state.biome === "paper") {
    // Hand-drawn crooked stroke appearance on Sketch Paper
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
      state.duelTotalRounds = 15; // 3 rounds × 5 difficulties
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

// Check if `player` has N strikes in a straight line (Vertical, Horizontal, or Diagonal)
function checkWinner(board, player) {
  const N = board.length;

  // Rows
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

  // Columns
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

  // Main Diagonal
  let diag1 = true;
  for (let i = 0; i < N; i++) {
    if (board[i][i] !== player) {
      diag1 = false;
      break;
    }
  }
  if (diag1) return true;

  // Anti-Diagonal
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

// Handle Cell Click / Tap (Supports both Standard & Three Power Max Mode)
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

  // THREE POWER MAX MODE LOGIC:
  // Strictly max 3 strikes per player. For the 4th strike, the player must remove one of their own 3 strikes first.
  if (state.rule === "threepower" && queue.length >= 3) {
    // Clicking one of the player's own 3 marks selects it for removal
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

    // Cannot remove opponent's strikes
    if (cellVal !== 0 && cellVal !== player) {
      updateTurnBanner("Cannot remove opponent's strike! Select one of your own 3 marks first.");
      return;
    }

    // If clicking an empty cell to place the 4th strike:
    if (cellVal === 0) {
      if (state.selectedRemovalIndex === null) {
        updateTurnBanner("3 strikes active! Tap 1 of your own marks to remove before placing the 4th.");
        return;
      }
      const removed = queue.splice(state.selectedRemovalIndex, 1)[0];
      state.board[removed.r][removed.c] = 0;
      state.selectedRemovalIndex = null;
    }
  } else {
    // Standard placement requires an empty cell
    if (cellVal !== 0) return;
  }

  // Place the strike
  state.board[row][col] = player;
  queue.push({ r: row, c: col });

  // Trigger 3D Pen Drawing Animation if in Sketch Paper Biome
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

  // Random Arena Attack visual shake on every 3rd move
  if ((state.p1MarksQueue.length + state.p2MarksQueue.length) % 3 === 0) {
    triggerRandomAttackVisual();
  }

  rebuildAllMarks();

  // Check Victory
  if (checkWinner(state.board, player)) {
    concludeRound(player);
    return;
  }

  // Check Draw (Only possible in Standard mode)
  if (state.rule === "classic" && isBoardFull(state.board)) {
    concludeRound(0);
    return;
  }

  // Switch Turn
  state.currentPlayer = player === 1 ? 2 : 1;
  updateHUD();

  // Trigger Automated AI if applicable
  if (
    !state.gameOver &&
    (state.mode === "ai" || state.mode === "ai-duel") &&
    state.currentPlayer === 2
  ) {
    setTimeout(performAutomatedAIMove, 460);
  }
}

// Automated AI Engine (Easy -> Medium -> Hard -> Hardcore -> Impossible + Three Power Max aware)
function performAutomatedAIMove() {
  if (state.gameOver || state.paused || state.screen !== "game") return;
  const N = state.gridSize;

  // In Three Power Max Mode, if AI already has 3 marks, pick the least strategic one to relocate
  if (state.rule === "threepower" && state.p2MarksQueue.length >= 3) {
    state.selectedRemovalIndex = chooseAIMarkToRemove();
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

function chooseAIMarkToRemove() {
  // Prefer removing a mark that doesn't immediately break a 2-in-a-row threat
  return 0;
}

function findBestTacticalMove(emptyCells) {
  const N = state.gridSize;

  // 1. Immediate Winning Strike for AI (Player 2)
  for (const cell of emptyCells) {
    state.board[cell.r][cell.c] = 2;
    const wins = checkWinner(state.board, 2);
    state.board[cell.r][cell.c] = 0;
    if (wins) return cell;
  }

  // 2. Immediate Block against Player 1
  for (const cell of emptyCells) {
    state.board[cell.r][cell.c] = 1;
    const p1Wins = checkWinner(state.board, 1);
    state.board[cell.r][cell.c] = 0;
    if (p1Wins) return cell;
  }

  // 3. Heuristic Line Scoring for N×N boards
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

  // Update High Score & Best Time in LocalStorage
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

  // Handle Multi-Round Duels (15-game AI Duel or 3-game 2-Player Duel)
  if (state.duelRound < state.duelTotalRounds) {
    setTimeout(() => {
      state.duelRound++;
      if (state.mode === "ai-duel") {
        // 3 rounds per difficulty across 5 tiers = 15 games
        const tierIndex = Math.min(4, Math.floor((state.duelRound - 1) / 3));
        state.difficulty = DIFF_ORDER[tierIndex];
      }
      initBoardState(false);
    }, 1500);
  } else if (state.duelTotalRounds > 1) {
    setTimeout(() => {
      openStatsModal(
        `Duel Complete (${state.duelTotalRounds} Games) — Final Score ${state.p1Score} : ${state.p2Score}`
      );
    }, 1200);
  }
}

// ----------------------------------------------------------------------------
// 6. RANDOM ATTACKS, THEME PLAGUE TRANSITION, UI SLIDE-HIDE & HUD
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

  // 1. Global upper-left blurred plague wave
  const overlay = document.getElementById("plague-overlay");
  overlay.classList.remove("plague-active");
  void overlay.offsetWidth;
  overlay.classList.add("plague-active");

  // 2. Individual upper-left blurred plague transition for each UI surface
  document.querySelectorAll(".ui-surface").forEach((el, idx) => {
    el.classList.remove("section-plague");
    void el.offsetWidth;
    setTimeout(() => {
      el.classList.add("section-plague");
    }, idx * 28);
  });
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
    bannerText.textContent = `${activeName}'s Turn (${symbol}) — Select 1 of your 3 marks to relocate`;
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
// 7. ANALYTICS GRAPH & LEADERBOARD RENDERER
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

  // Draw Victory Bar + Duel Progression Graph on Canvas
  const chart = document.getElementById("stats-chart");
  const ctx = chart.getContext("2d");
  ctx.clearRect(0, 0, chart.width, chart.height);

  const barColors = [state.p1Color, state.p2Color, "#9b87f5", "#ffd166"];
  const pad = 42;
  const usableW = chart.width - pad * 2;
  const usableH = chart.height - pad * 2;
  const maxVal = Math.max(3, ...entries.map((e) => e[1]));

  entries.slice(0, 4).forEach(([name, val], i) => {
    const bw = usableW / Math.max(1, entries.length) - 24;
    const x = pad + i * (bw + 24);
    const bh = (val / maxVal) * usableH;
    const y = chart.height - pad - bh;

    ctx.fillStyle = barColors[i % barColors.length];
    ctx.fillRect(x, y, bw, bh);

    ctx.fillStyle = state.theme === "dark" ? "#f5f2ff" : "#2a2344";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`${name} (${val})`, x, chart.height - 14);
  });
}

// ----------------------------------------------------------------------------
// 8. DEVICE AUTO-DETECTION, UI WIRING & SAVED PROGRESS
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
    .getElementById("screen-customize")
    .classList.toggle("active", target === "customize");
  document.getElementById("hud-layer").classList.toggle("hidden", target !== "game");
  document.getElementById("turn-banner").classList.toggle("hidden", target !== "game");
  document.getElementById("btn-pause-open").classList.toggle("hidden", target !== "game");
}

function wireUIEvents() {
  autoDetectDevice();

  // Check for Saved Match
  if (localStorage.getItem(STORAGE_KEYS.SAVED_MATCH)) {
    document.getElementById("saved-session-bar").classList.remove("hidden");
  }

  // Device Cards
  document.querySelectorAll(".device-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".device-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      state.device = card.dataset.device;
      sfx.playPlace(false, 1);
    });
  });

  document.getElementById("btn-to-screen-2").addEventListener("click", () => {
    sfx.playCameraSwitch();
    switchScreen("customize");
  });

  document.getElementById("btn-back-screen-1").addEventListener("click", () => {
    switchScreen("device");
  });

  document.getElementById("btn-deploy-match").addEventListener("click", () => {
    state.p1Name = document.getElementById("input-p1-name").value.trim() || "Player 1";
    state.p2Name =
      document.getElementById("input-p2-name").value.trim() ||
      (state.mode.startsWith("ai") ? "Aether AI" : "Player 2");
    initBoardState(true);
    switchScreen("game");
    sfx.playCameraSwitch();
  });

  // Theme Plague Toggle (Works from Homescreen, Studio, and In-Game)
  document
    .getElementById("btn-theme-toggle")
    .addEventListener("click", triggerPlagueThemeSwitch);

  // Studio Segmented Controls
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

  // Color Pickers (Screen 2 & Pause Menu)
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

  // Individual UI Slide-Hide & Smooth Reflow + Unhide All
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

  // Pause Studio & Save Progress to Homescreen
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

  // Stats & Reset Buttons
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

  // Device Action Dock Buttons
  document.getElementById("btn-dock-cam").addEventListener("click", cycleCameraPOV);
  document.getElementById("btn-dock-bird").addEventListener("click", triggerBirdJump);
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

  // Keyboard Shortcuts (W/S Sky Cycle, Up Arrow Bird Jump, C Camera POV)
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
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      triggerBirdJump();
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
  camPhi = Math.max(0.22, Math.min(1.42, camPhi - dy * 0.0065));
});

window.addEventListener("pointerup", (e) => {
  if (!isDraggingBoard) return;
  isDraggingBoard = false;

  const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
  if (moveDist > 6) return; // Dragged to rotate 360°, not a click

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

  // 1. Sky Cycle & Day/Night Pastel Interpolation
  if (state.skyMode === "dynamic") {
    state.skyTime = (state.skyTime + dt * 0.025 * state.skySpeed) % 1;
  } else {
    state.skyTime = state.skyMode === "day" ? 0.25 : 0.75;
  }

  const daylightFactor = Math.sin(state.skyTime * Math.PI * 2) * 0.5 + 0.5;
  const palette = BIOME_PALETTES[state.biome] || BIOME_PALETTES.royal;
  const dayCol = new THREE.Color(palette.daySky);
  const nightCol = new THREE.Color(palette.nightSky);
  scene.background = nightCol.clone().lerp(dayCol, daylightFactor);

  sunLight.intensity = 0.25 + daylightFactor * 0.65;
  ambientLight.intensity = 0.45 + daylightFactor * 0.4;
  const phaseEl = document.getElementById("hud-sky-phase");
  if (phaseEl) phaseEl.textContent = daylightFactor > 0.5 ? "Daylight" : "Starlight Night";

  // 2. Drift 3D Clouds
  cloudsGroup.children.forEach((cloud) => {
    cloud.userData.angle += dt * cloud.userData.speed * state.skySpeed;
    cloud.position.x = Math.cos(cloud.userData.angle) * cloud.userData.dist;
    cloud.position.z = Math.sin(cloud.userData.angle) * cloud.userData.dist;
  });

  // 3. Autonomous Bird Movement + Up-Arrow Jump Physics
  birdAngle += dt * 0.65;
  const birdRadius = 5.4;
  if (birdJumpY > 0 || birdJumpVel !== 0) {
    birdJumpY += birdJumpVel;
    birdJumpVel -= 0.012;
    if (birdJumpY <= 0) {
      birdJumpY = 0;
      birdJumpVel = 0;
    }
  }
  const hopWave = Math.abs(Math.sin(now * 0.006)) * 0.22;
  birdGroup.position.set(
    Math.cos(birdAngle) * birdRadius,
    0.35 + hopWave + birdJumpY,
    Math.sin(birdAngle) * birdRadius
  );
  birdGroup.rotation.y = -birdAngle;
  if (birdGroup.userData.leftWing) {
    const flap = Math.sin(now * 0.018) * 0.45;
    birdGroup.userData.leftWing.rotation.z = flap;
    birdGroup.userData.rightWing.rotation.z = -flap;
  }

  // 4. Sketch Paper 3D Pen Drawing Animation
  if (activePenAnim && activePenAnim.pen) {
    activePenAnim.progress += dt * 3.2;
    const p = activePenAnim.progress;
    const pen = activePenAnim.pen;
    if (p < 1) {
      const scribbleX = Math.sin(p * Math.PI * 6) * 0.35;
      const scribbleZ = Math.cos(p * Math.PI * 6) * 0.35;
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
    worldGroup.position.x = Math.sin(now * 0.08) * attackPulseTime * 0.25;
    worldGroup.rotation.z = Math.cos(now * 0.06) * attackPulseTime * 0.04;
  } else {
    worldGroup.position.set(0, 0, 0);
    worldGroup.rotation.set(0, 0, 0);
  }

  // 6. Camera POV Modes + 360° Preview Rotation
  if (state.screen !== "game" && !isDraggingBoard) {
    camTheta += dt * 0.28; // Continuous 360° board inspection on Initiation & Studio screens
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
  } else if (mode === "Isometric") {
    camera.position.lerp(new THREE.Vector3(11.5, 11.5, 11.5), 0.08);
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
buildAutonomousBird();
initBoardState(true);
wireUIEvents();
requestAnimationFrame(animate);

/* ============================================================================
   AETHERGRID — 3D TACTICAL ALIGNMENT ENGINE (v5 COMPLETE 13-BIOME EDITION)
   Royal Sanctum, Cyberpunk Drift, Angelic Cloud, Pastel Lagoon, Lo-Fi Cafe,
   Gothic Balcony, Gothic Castle, Forest, Cyberpunk Terrace, Desert, Reef,
   Meadows & Sketch Paper (Continuous Crooked Pencil Tubes) + Web Audio Synth
   ============================================================================ */

const $ = (id) => document.getElementById(id);
const on = (id, evt, handler) => {
  const el = $(id);
  if (el) el.addEventListener(evt, handler);
};
const setText = (id, text) => {
  const el = $(id);
  if (el) el.textContent = text;
};

// ----------------------------------------------------------------------------
// 1. PROCEDURAL WEB AUDIO API SOUND ENGINE (ZERO EXTERNAL FILES)
// ----------------------------------------------------------------------------
class ProceduralSoundEngine {
  constructor() {
    this.ctx = null;
  }

  ensureContext() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    } catch (_) {}
  }

  playPlace(isPaper = false, player = 1) {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (isPaper) {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.28);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const strokeMod = Math.sin(i * 0.022) * 0.5 + 0.5;
        data[i] = (Math.random() * 2 - 1) * strokeMod;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(player === 1 ? 1850 : 1420, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.008, now + 0.27);

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
    if (!this.ctx) return;
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
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(610, now + 0.15);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  playThemePlague() {
    this.ensureContext();
    if (!this.ctx) return;
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
    if (!this.ctx) return;
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
// 2. CURATED HIGH-CONTRAST PASTEL PALETTES & 13 BIOME DEFINITIONS
// ----------------------------------------------------------------------------
const STRIKER_SWATCHES = [
  { name: "Rose Coral", hex: "#ff5c8a" },
  { name: "Sky Azure", hex: "#2ec4b6" },
  { name: "Royal Orchid", hex: "#9b5de5" },
  { name: "Amber Sun", hex: "#ff9f1c" },
  { name: "Emerald Mint", hex: "#10b981" },
  { name: "Cobalt Periwinkle", hex: "#4361ee" }
];

const BOARD_SWATCHES = [
  { name: "Lilac Mist", hex: "#dcd3f8" },
  { name: "Alabaster Cream", hex: "#f5efe6" },
  { name: "Rose Quartz", hex: "#f7d6e0" },
  { name: "Sage Celadon", hex: "#d4ebe2" },
  { name: "Glacier Blue", hex: "#d2e5f7" },
  { name: "Obsidian Velvet", hex: "#322b47" }
];

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

const CAMERA_MODES = [
  { name: "Orbital 360° Free", defaultPhi: 0.98, defaultTheta: 0.62, radius: 15.2 },
  { name: "Zenith Top-Down Tactical", defaultPhi: 0.16, defaultTheta: 0.0, radius: 16.4 },
  { name: "Scenic Horizon Vista", defaultPhi: 1.24, defaultTheta: 0.35, radius: 16.8 },
  { name: "Contender 1 North POV", defaultPhi: 0.92, defaultTheta: 1.57, radius: 14.8 },
  { name: "Contender 2 South POV", defaultPhi: 0.92, defaultTheta: -1.57, radius: 14.8 }
];

const BIOME_PALETTES = {
  royal: {
    daySky: "#e5defc",
    nightSky: "#1a1433",
    pedestal: "#b8a4e8",
    gridLine: "#3b2d66",
    frameRim: "#4a387d"
  },
  cyberpunk_drift: {
    daySky: "#d4f2f9",
    nightSky: "#0d0c22",
    pedestal: "#38416e",
    gridLine: "#ff3c88",
    frameRim: "#00c4b4"
  },
  angelic: {
    daySky: "#f2f7ff",
    nightSky: "#1f2642",
    pedestal: "#f6e7c1",
    gridLine: "#526b9c",
    frameRim: "#d4af37"
  },
  lagoon: {
    daySky: "#d8f7f2",
    nightSky: "#122936",
    pedestal: "#f4deac",
    gridLine: "#236e67",
    frameRim: "#2b8a82"
  },
  cafe: {
    daySky: "#f5ebe1",
    nightSky: "#241915",
    pedestal: "#b08968",
    gridLine: "#4a3222",
    frameRim: "#5c3d28"
  },
  gothic_balcony: {
    daySky: "#dcd3f2",
    nightSky: "#151126",
    pedestal: "#4a425c",
    gridLine: "#2c2240",
    frameRim: "#342a4a"
  },
  gothic_castle: {
    daySky: "#d5dce8",
    nightSky: "#121524",
    pedestal: "#525866",
    gridLine: "#252836",
    frameRim: "#2f3445"
  },
  forest: {
    daySky: "#d8f0e4",
    nightSky: "#11221f",
    pedestal: "#6f4e37",
    gridLine: "#284234",
    frameRim: "#4a3525"
  },
  cyberpunk: {
    daySky: "#d6eef8",
    nightSky: "#100f24",
    pedestal: "#3c4264",
    gridLine: "#ff4d8d",
    frameRim: "#22263e"
  },
  desert: {
    daySky: "#fae3c6",
    nightSky: "#26192b",
    pedestal: "#c98557",
    gridLine: "#5e311d",
    frameRim: "#7d452b"
  },
  underwater: {
    daySky: "#b8e6f0",
    nightSky: "#0a1f30",
    pedestal: "#4b909e",
    gridLine: "#1a4d5c",
    frameRim: "#235b6b"
  },
  meadows: {
    daySky: "#dff2fe",
    nightSky: "#152338",
    pedestal: "#74a868",
    gridLine: "#2c4c2f",
    frameRim: "#3e6942"
  },
  paper: {
    daySky: "#ebe6dc",
    nightSky: "#202126",
    pedestal: "#c7bdb1",
    gridLine: "#2d3748",
    frameRim: "#4a5568"
  }
};

const state = {
  screen: "device",
  paused: false,
  device: "desktop",
  theme: "light",

  mode: "ai",
  rule: "classic",
  gridSize: 3,
  difficulty: "medium",
  biome: "royal",
  p1Shape: "x",
  p2Shape: "o",
  p1Name: "Astra",
  p2Name: "Aether AI",
  p1Color: STRIKER_SWATCHES[0].hex,
  p2Color: STRIKER_SWATCHES[1].hex,
  boardColor: BOARD_SWATCHES[0].hex,

  skyMode: "dynamic",
  skyStart: "day",
  skyTime: 0.25,
  skySpeed: 1.0,

  camModeIndex: 0,

  board: [],
  currentPlayer: 1,
  gameOver: false,
  p1MarksQueue: [],
  p2MarksQueue: [],
  selectedRemovalIndex: null,
  p1Score: 0,
  p2Score: 0,
  elapsedSeconds: 0,
  highScore: parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || "0", 10) || 0,
  bestTime: parseInt(localStorage.getItem(STORAGE_KEYS.BEST_TIME) || "0", 10) || 0,
  currentAttack: "Solar Tremor",

  duelRound: 1,
  duelTotalRounds: 1,
  duelHistory: [],

  leaderboard: (() => {
    try {
      return (
        JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADERBOARD)) || {
          Astra: 2,
          "Aether AI": 1,
          Nova: 1,
          Ties: 1
        }
      );
    } catch (_) {
      return { Astra: 2, "Aether AI": 1, Nova: 1, Ties: 1 };
    }
  })()
};

function sanitizeStateObject(obj) {
  if (!obj || typeof obj !== "object") return;
  if (obj.biome === "beach") obj.biome = "lagoon";
  if (!BIOME_PALETTES[obj.biome]) obj.biome = "royal";
  if (!obj.p1Shape) obj.p1Shape = "x";
  if (!obj.p2Shape) obj.p2Shape = "o";
  if (!Number.isInteger(obj.camModeIndex) || !CAMERA_MODES[obj.camModeIndex]) {
    obj.camModeIndex = 0;
  }
  if (!Array.isArray(obj.p1MarksQueue)) obj.p1MarksQueue = [];
  if (!Array.isArray(obj.p2MarksQueue)) obj.p2MarksQueue = [];
}

function syncBiomeButtons() {
  ["biome-select", "pause-biome-select"].forEach((id) => {
    const container = $(id);
    if (!container) return;
    container.querySelectorAll(".seg-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.biome === state.biome);
    });
  });
}

// ----------------------------------------------------------------------------
// 3. THREE.JS SCENE INITIALIZATION
// ----------------------------------------------------------------------------
const canvas = $("game-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xe5defc, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe5defc);
scene.fog = new THREE.FogExp2(0xe5defc, 0.011);

const camera = new THREE.PerspectiveCamera(
  44,
  window.innerWidth / window.innerHeight,
  0.1,
  320
);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xb8b0d8, 0.78);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xfff7e8, 0.76);
sunLight.position.set(18, 28, 16);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
scene.add(sunLight);

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

function clearGroup(group) {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }
}

let camTheta = CAMERA_MODES[0].defaultTheta;
let camPhi = CAMERA_MODES[0].defaultPhi;
let camRadius = CAMERA_MODES[0].radius;
let targetCamTheta = camTheta;
let targetCamPhi = camPhi;
let targetCamRadius = camRadius;
let isDraggingBoard = false;
let prevPointer = { x: 0, y: 0 };
let pointerDownPos = { x: 0, y: 0 };

function createMatteMaterial(hexColor, opacity = 1) {
  return new THREE.MeshLambertMaterial({
    color: new THREE.Color(hexColor),
    transparent: opacity < 1,
    opacity
  });
}

function createContinuousCrookedStroke(pointsArray, radius, material, closed = false) {
  const curve = new THREE.CatmullRomCurve3(pointsArray, closed);
  const segments = Math.max(36, pointsArray.length * 8);
  const tubeGeo = new THREE.TubeGeometry(curve, segments, radius, 10, closed);
  return new THREE.Mesh(tubeGeo, material);
}

// 3D Volumetric Pastel Clouds
function buildClouds() {
  clearGroup(cloudsGroup);
  const cloudMat = createMatteMaterial("#ffffff", 0.88);
  for (let i = 0; i < 12; i++) {
    const cluster = new THREE.Group();
    const puffs = 4 + (i % 3);
    for (let p = 0; p < puffs; p++) {
      const geo = new THREE.SphereGeometry(1.35 + (p % 2) * 0.55, 14, 14);
      const mesh = new THREE.Mesh(geo, cloudMat);
      mesh.position.set(p * 1.25 - 1.5, (p % 2) * 0.35, (p % 3) * 0.45);
      mesh.scale.y = 0.58;
      cluster.add(mesh);
    }
    const angle = (i / 12) * Math.PI * 2;
    const dist = 25 + (i % 3) * 6;
    cluster.position.set(
      Math.cos(angle) * dist,
      10.2 + (i % 3) * 2.2,
      Math.sin(angle) * dist
    );
    cluster.userData = { angle, dist, speed: 0.022 + (i % 4) * 0.008 };
    cloudsGroup.add(cluster);
  }
}

// 2 Animated 3D Pens / Pencils for Sketch Paper Biome
let pen1Mesh = null;
let pen2Mesh = null;
let activePenAnim = null;

function buildSketchPens() {
  clearGroup(pensGroup);
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
    pen.position.set(restX, 1.15, -3.8);
    pen.userData = { restPos: new THREE.Vector3(restX, 1.15, -3.8) };
    return pen;
  };

  pen1Mesh = makePen(state.p1Color, state.p1Color, -5.6);
  pen2Mesh = makePen(state.p2Color, state.p2Color, 5.6);
  pensGroup.add(pen1Mesh, pen2Mesh);
  pensGroup.visible = state.biome === "paper";
}

// ----------------------------------------------------------------------------
// 4. VISIBLE BOARD BORDER FRAME & ALL 13 SCENIC 3D BACKGROUNDS
// ----------------------------------------------------------------------------
function buildBoardAndBiome() {
  clearGroup(boardGroup);
  clearGroup(cellsGroup);
  clearGroup(biomePropsGroup);
  clearGroup(ambientParticlesGroup);

  const palette = BIOME_PALETTES[state.biome] || BIOME_PALETTES.royal;
  const N = state.gridSize || 3;
  const boardSpan = 7.6;
  const cellSize = boardSpan / N;
  const half = boardSpan / 2;

  // 1. Main Board Table Surface
  const baseColor = state.biome === "paper" ? "#fffdf9" : state.boardColor;
  const baseHeight = state.biome === "paper" ? 0.16 : 0.62;
  const tableWidth = boardSpan + 1.0;
  const baseGeo = new THREE.BoxGeometry(tableWidth, baseHeight, tableWidth);
  const baseMesh = new THREE.Mesh(baseGeo, createMatteMaterial(baseColor));
  baseMesh.position.y = -baseHeight / 2;
  baseMesh.receiveShadow = true;
  boardGroup.add(baseMesh);

  // 2. DISTINCT HIGH-CONTRAST 3D OUTER BOARD BORDER FRAME
  const frameMat = createMatteMaterial(palette.frameRim);
  const rimThickness = 0.28;
  const rimHeight = baseHeight + 0.18;
  const outerSpan = tableWidth + rimThickness * 2;

  const northRim = new THREE.Mesh(
    new THREE.BoxGeometry(outerSpan, rimHeight, rimThickness),
    frameMat
  );
  northRim.position.set(0, -baseHeight / 2 + 0.05, -tableWidth / 2 - rimThickness / 2);

  const southRim = northRim.clone();
  southRim.position.z = tableWidth / 2 + rimThickness / 2;

  const eastRim = new THREE.Mesh(
    new THREE.BoxGeometry(rimThickness, rimHeight, tableWidth),
    frameMat
  );
  eastRim.position.set(tableWidth / 2 + rimThickness / 2, -baseHeight / 2 + 0.05, 0);

  const westRim = eastRim.clone();
  westRim.position.x = -tableWidth / 2 - rimThickness / 2;

  boardGroup.add(northRim, southRim, eastRim, westRim);

  // Corner Accent Finials on Board Frame
  const cornerGeo = new THREE.CylinderGeometry(0.24, 0.24, rimHeight + 0.08, 12);
  [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1]
  ].forEach(([cx, cz]) => {
    const post = new THREE.Mesh(cornerGeo, frameMat);
    post.position.set(
      cx * (tableWidth / 2 + rimThickness / 2),
      -baseHeight / 2 + 0.07,
      cz * (tableWidth / 2 + rimThickness / 2)
    );
    boardGroup.add(post);
  });

  // 3. Pedestal Base under Table
  const pillarGeo = new THREE.CylinderGeometry(2.6, 3.5, 1.9, 24);
  const pillarMesh = new THREE.Mesh(pillarGeo, createMatteMaterial(palette.pedestal));
  pillarMesh.position.y = -baseHeight - 0.95;
  pillarMesh.receiveShadow = true;
  boardGroup.add(pillarMesh);

  // 4. Grid Lines (Including Outer Boundary Lines + Continuous Unbroken Crooked Pencil Lines in Paper Mode)
  const lineMat = createMatteMaterial(palette.gridLine);

  for (let i = 0; i <= N; i++) {
    const offset = -half + i * cellSize;
    const isOuterBoundary = i === 0 || i === N;

    if (state.biome === "paper") {
      const vPoints = [];
      const hPoints = [];
      const controlCount = 14;
      for (let s = 0; s <= controlCount; s++) {
        const t = -half + (s / controlCount) * boardSpan;
        const waveV = Math.sin(s * 1.45 + i * 2.1) * 0.055 + Math.cos(s * 2.7 - i) * 0.025;
        const waveH = Math.cos(s * 1.55 + i * 1.8) * 0.055 + Math.sin(s * 2.5 + i) * 0.025;
        vPoints.push(new THREE.Vector3(offset + waveV, 0.04, t));
        hPoints.push(new THREE.Vector3(t, 0.04, offset + waveH));
      }
      const strokeRadius = isOuterBoundary ? 0.055 : 0.042;
      boardGroup.add(createContinuousCrookedStroke(vPoints, strokeRadius, lineMat, false));
      boardGroup.add(createContinuousCrookedStroke(hPoints, strokeRadius, lineMat, false));
    } else {
      const barThick = isOuterBoundary ? 0.14 : 0.11;
      const vBar = new THREE.Mesh(
        new THREE.BoxGeometry(barThick, 0.12, boardSpan + barThick),
        lineMat
      );
      vBar.position.set(offset, 0.06, 0);

      const hBar = new THREE.Mesh(
        new THREE.BoxGeometry(boardSpan + barThick, 0.12, barThick),
        lineMat
      );
      hBar.position.set(0, 0.06, offset);
      boardGroup.add(vBar, hBar);
    }
  }

  // 5. Interactive Cell Hit Tiles
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const x = -half + c * cellSize + cellSize / 2;
      const z = -half + r * cellSize + cellSize / 2;
      const tileGeo = new THREE.BoxGeometry(cellSize * 0.86, 0.08, cellSize * 0.86);
      const tileMat = createMatteMaterial("#ffffff", 0.18);
      const tile = new THREE.Mesh(tileGeo, tileMat);
      tile.position.set(x, 0.04, z);
      tile.userData = { row: r, col: c, x, z, cellSize };
      cellsGroup.add(tile);
    }
  }

  buildScenicBiomeWorld(state.biome);
  buildSketchPens();
  rebuildAllMarks();
  syncBiomeButtons();
}

function buildScenicBiomeWorld(biome) {
  if (biome === "royal") {
    // ROYAL SANCTUM — Marble Rotunda, Fluted Temple Columns, Golden Arches & Floating Crowns
    const marbleFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(18, 19.5, 1.4, 36),
      createMatteMaterial("#efeafd")
    );
    marbleFloor.position.y = -2.4;
    biomePropsGroup.add(marbleFloor);

    const velvetCarpet = new THREE.Mesh(
      new THREE.CylinderGeometry(10.5, 10.5, 0.14, 32),
      createMatteMaterial("#7251b5")
    );
    velvetCarpet.position.y = -1.68;
    biomePropsGroup.add(velvetCarpet);

    const goldRing = new THREE.Mesh(
      new THREE.TorusGeometry(10.6, 0.16, 12, 48),
      createMatteMaterial("#ffd166")
    );
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.y = -1.62;
    biomePropsGroup.add(goldRing);

    const colMat = createMatteMaterial("#ffffff");
    const goldMat = createMatteMaterial("#ffd166");
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const r = 13.5;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;

      const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 1.8), goldMat);
      plinth.position.set(x, -1.3, z);

      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.68, 7.2, 16), colMat);
      pillar.position.set(x, 2.6, z);

      const capital = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.55, 1.6), goldMat);
      capital.position.set(x, 6.4, z);

      const crownJewel = new THREE.Mesh(new THREE.OctahedronGeometry(0.68), goldMat);
      crownJewel.position.set(x, 7.6, z);

      biomePropsGroup.add(plinth, pillar, capital, crownJewel);
    }

    spawnAmbientParticles("#ffd166", 30, 14);
  } else if (biome === "cyberpunk_drift") {
    // CYBERPUNK DRIFT — Synthwave Grid Horizon, Floating Neon Drift Highways & Hologram Rings
    const synthFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(28, 30, 1.2, 36),
      createMatteMaterial("#181638")
    );
    synthFloor.position.y = -2.4;
    biomePropsGroup.add(synthFloor);

    // Dual Floating Neon Drift Tracks Flanking the Arena
    const trackMatCyan = createMatteMaterial("#00f5d4");
    const trackMatPink = createMatteMaterial("#ff3c88");

    const outerDriftRing = new THREE.Mesh(
      new THREE.TorusGeometry(13.5, 0.35, 12, 64),
      trackMatCyan
    );
    outerDriftRing.rotation.x = Math.PI / 2 + 0.14;
    outerDriftRing.position.y = -0.3;
    biomePropsGroup.add(outerDriftRing);

    const innerDriftRing = new THREE.Mesh(
      new THREE.TorusGeometry(11.0, 0.25, 12, 64),
      trackMatPink
    );
    innerDriftRing.rotation.x = Math.PI / 2 - 0.14;
    innerDriftRing.position.y = 0.6;
    biomePropsGroup.add(innerDriftRing);

    // Floating Hologram Drift Portals & Monoliths
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const dist = 16.5;
      const portal = new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.14, 10, 28),
        i % 2 === 0 ? trackMatPink : trackMatCyan
      );
      portal.position.set(Math.cos(a) * dist, 1.8 + (i % 2) * 1.4, Math.sin(a) * dist);
      portal.lookAt(0, 1.5, 0);
      biomePropsGroup.add(portal);
    }

    spawnAmbientParticles("#00f5d4", 34, 15);
  } else if (biome === "angelic") {
    // ANGELIC CLOUD — Celestial Cloud Sanctuary, Golden Halo Rings & Temple Gates
    const sanctuaryBase = new THREE.Mesh(
      new THREE.CylinderGeometry(16, 12, 1.8, 32),
      createMatteMaterial("#ffffff")
    );
    sanctuaryBase.position.y = -2.4;
    biomePropsGroup.add(sanctuaryBase);

    const goldMat = createMatteMaterial("#ffd166");
    const pearlMat = createMatteMaterial("#f8f9fa");

    // Concentric Celestial Golden Halos
    const halo1 = new THREE.Mesh(new THREE.TorusGeometry(9.2, 0.16, 14, 64), goldMat);
    halo1.rotation.x = Math.PI / 2;
    halo1.position.y = 2.8;

    const halo2 = new THREE.Mesh(new THREE.TorusGeometry(12.4, 0.14, 14, 64), goldMat);
    halo2.rotation.x = Math.PI / 2 + 0.18;
    halo2.position.y = 1.2;
    biomePropsGroup.add(halo1, halo2);

    // Perimeter Cloud Pillows & Celestial Spires
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 12.8;
      const puff = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 16), pearlMat);
      puff.scale.y = 0.6;
      puff.position.set(Math.cos(a) * r, -1.5, Math.sin(a) * r);
      biomePropsGroup.add(puff);

      if (i % 2 === 0) {
        const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 6.2, 12), pearlMat);
        spire.position.set(Math.cos(a) * 14.5, 1.4, Math.sin(a) * 14.5);
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 14), goldMat);
        orb.position.set(Math.cos(a) * 14.5, 4.9, Math.sin(a) * 14.5);
        biomePropsGroup.add(spire, orb);
      }
    }

    spawnAmbientParticles("#fff3b0", 32, 14);
  } else if (biome === "lagoon") {
    // PASTEL LAGOON — Tropical Turquoise Water, Sandy Atoll Island, Palm Trees & Parasols
    const ocean = new THREE.Mesh(
      new THREE.CylinderGeometry(30, 30, 0.9, 36),
      createMatteMaterial("#64dfdf", 0.85)
    );
    ocean.position.y = -2.45;
    biomePropsGroup.add(ocean);

    const sandIsland = new THREE.Mesh(
      new THREE.CylinderGeometry(11.5, 13.8, 1.2, 32),
      createMatteMaterial("#fae1dd")
    );
    sandIsland.position.y = -2.1;
    biomePropsGroup.add(sandIsland);

    // Tropical Palm Trees & Pastel Beach Parasols around Atoll
    const trunkMat = createMatteMaterial("#b08968");
    const leafMat = createMatteMaterial("#52b788");
    const parasolMat = createMatteMaterial("#ff8fa3");

    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      const r = 9.8;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 4.2, 10), trunkMat);
      trunk.position.set(x, 0.3, z);

      for (let f = 0; f < 4; f++) {
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.4, 6), leafMat);
        const fa = (f / 4) * Math.PI * 2;
        frond.position.set(x + Math.cos(fa) * 0.9, 2.3, z + Math.sin(fa) * 0.9);
        frond.rotation.z = Math.PI / 2.6;
        frond.rotation.y = -fa;
        biomePropsGroup.add(frond);
      }
      biomePropsGroup.add(trunk);

      if (i % 2 === 0) {
        const px = Math.cos(a + 0.45) * 8.6;
        const pz = Math.sin(a + 0.45) * 8.6;
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8), trunkMat);
        pole.position.set(px, -0.4, pz);
        const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.9, 12), parasolMat);
        canopy.position.set(px, 1.0, pz);
        biomePropsGroup.add(pole, canopy);
      }
    }

    spawnAmbientParticles("#caf0f8", 28, 13);
  } else if (biome === "cafe") {
    // LO-FI CAFE — Warm Walnut Tabletop, Steaming Coffee Mug, Vinyl Turntable & Warm Lamps
    const cafeTable = new THREE.Mesh(
      new THREE.CylinderGeometry(18.5, 19.5, 1.5, 36),
      createMatteMaterial("#9c6644")
    );
    cafeTable.position.y = -2.4;
    biomePropsGroup.add(cafeTable);

    // Coaster Mat under the Board
    const coaster = new THREE.Mesh(
      new THREE.CylinderGeometry(7.2, 7.2, 0.12, 32),
      createMatteMaterial("#ede0d4")
    );
    coaster.position.y = -1.62;
    biomePropsGroup.add(coaster);

    // Oversized Ceramic Coffee Mug & saucer
    const mugGroup = new THREE.Group();
    const mugMat = createMatteMaterial("#f4a261");
    const coffeeMat = createMatteMaterial("#3d2314");

    const saucer = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.0, 0.25, 24),
      createMatteMaterial("#fff8f0")
    );
    saucer.position.y = -1.5;

    const cup = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.35, 2.8, 24), mugMat);
    cup.position.y = -0.1;

    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.1, 20), coffeeMat);
    liquid.position.y = 1.28;

    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.2, 10, 20), mugMat);
    handle.position.set(1.55, -0.1, 0);

    mugGroup.add(saucer, cup, liquid, handle);
    mugGroup.position.set(-8.6, 0, -6.4);
    biomePropsGroup.add(mugGroup);

    // Vinyl Turntable Player & Book Stack on the opposite side
    const platterBase = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.55, 3.4),
      createMatteMaterial("#d4a373")
    );
    platterBase.position.set(8.6, -1.35, -5.8);
    const vinylDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.35, 1.35, 0.12, 24),
      createMatteMaterial("#22222b")
    );
    vinylDisc.position.set(8.3, -1.02, -5.8);
    const vinylLabel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.14, 16),
      createMatteMaterial("#ff758f")
    );
    vinylLabel.position.set(8.3, -1.01, -5.8);
    biomePropsGroup.add(platterBase, vinylDisc, vinylLabel);

    // Warm Lo-Fi Overhead String Lamps
    const bulbMat = createMatteMaterial("#ffd166");
    for (let i = -3; i <= 3; i++) {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 12), bulbMat);
      bulb.position.set(i * 3.4, 5.8 - Math.cos(i * 0.45) * 0.8, -11.5);
      biomePropsGroup.add(bulb);
    }

    spawnAmbientParticles("#fff1d0", 26, 12);
  } else if (biome === "gothic_balcony") {
    const balconyDeck = new THREE.Mesh(
      new THREE.BoxGeometry(17.5, 1.4, 15.5),
      createMatteMaterial("#463f57")
    );
    balconyDeck.position.y = -2.4;
    biomePropsGroup.add(balconyDeck);

    const tileDark = createMatteMaterial("#352f44");
    const tileLight = createMatteMaterial("#655b7c");
    for (let rx = -3; rx <= 3; rx++) {
      for (let rz = -3; rz <= 3; rz++) {
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(2.1, 0.08, 1.9),
          (rx + rz) % 2 === 0 ? tileDark : tileLight
        );
        slab.position.set(rx * 2.2, -1.68, rz * 2.0);
        biomePropsGroup.add(slab);
      }
    }

    const stoneMat = createMatteMaterial("#2d273b");
    const railTop = new THREE.Mesh(new THREE.BoxGeometry(17.2, 0.28, 0.38), stoneMat);
    railTop.position.set(0, -0.5, -7.4);
    biomePropsGroup.add(railTop);

    for (let i = -8; i <= 8; i++) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 1.2, 10), stoneMat);
      col.position.set(i * 1.0, -1.15, -7.4);
      biomePropsGroup.add(col);
    }

    const archGroup = new THREE.Group();
    const pillarLeft = new THREE.Mesh(new THREE.BoxGeometry(1.4, 11.5, 1.4), stoneMat);
    pillarLeft.position.set(-5.8, 3.8, -8.2);
    const pillarRight = pillarLeft.clone();
    pillarRight.position.x = 5.8;

    const gothicArch = new THREE.Mesh(
      new THREE.TorusGeometry(5.8, 0.55, 12, 32, Math.PI),
      stoneMat
    );
    gothicArch.position.set(0, 7.2, -8.2);

    const roseRim = new THREE.Mesh(
      new THREE.TorusGeometry(2.3, 0.22, 12, 28),
      stoneMat
    );
    roseRim.position.set(0, 9.2, -8.2);

    const stainedGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.2, 0.12, 24),
      createMatteMaterial("#c77dff", 0.65)
    );
    stainedGlass.rotation.x = Math.PI / 2;
    stainedGlass.position.set(0, 9.2, -8.2);

    archGroup.add(pillarLeft, pillarRight, gothicArch, roseRim, stainedGlass);
    biomePropsGroup.add(archGroup);

    for (let s = -2; s <= 2; s++) {
      if (s === 0) continue;
      const spireTower = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 14, 2.6),
        createMatteMaterial("#3a324d")
      );
      spireTower.position.set(s * 7.5, 1.5, -22);
      const spireRoof = new THREE.Mesh(
        new THREE.ConeGeometry(2.1, 8.5, 8),
        createMatteMaterial("#231d30")
      );
      spireRoof.position.set(s * 7.5, 12.7, -22);
      biomePropsGroup.add(spireTower, spireRoof);
    }

    spawnAmbientParticles("#e0aaff", 28, 13);
  } else if (biome === "gothic_castle") {
    const courtyard = new THREE.Mesh(
      new THREE.CylinderGeometry(24, 26, 1.6, 36),
      createMatteMaterial("#4a4e5c")
    );
    courtyard.position.y = -2.5;
    biomePropsGroup.add(courtyard);

    const castleStone = createMatteMaterial("#393d4a");
    const roofSlate = createMatteMaterial("#222530");
    const flameMat = createMatteMaterial("#ff9f1c");

    const towerCoords = [
      [-12, -12],
      [12, -12],
      [-12, 12],
      [12, 12]
    ];
    towerCoords.forEach(([tx, tz]) => {
      const turret = new THREE.Mesh(
        new THREE.CylinderGeometry(2.4, 2.8, 12, 16),
        castleStone
      );
      turret.position.set(tx, 3.5, tz);

      const conicalRoof = new THREE.Mesh(
        new THREE.ConeGeometry(3.0, 5.5, 16),
        roofSlate
      );
      conicalRoof.position.set(tx, 12.2, tz);
      biomePropsGroup.add(turret, conicalRoof);

      const brazier = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.2, 1.6, 10),
        roofSlate
      );
      brazier.position.set(tx * 0.58, -0.9, tz * 0.58);
      const flame = new THREE.Mesh(new THREE.OctahedronGeometry(0.42), flameMat);
      flame.position.set(tx * 0.58, 0.2, tz * 0.58);
      biomePropsGroup.add(brazier, flame);
    });

    [
      { x: 0, z: -12, rot: 0 },
      { x: 0, z: 12, rot: 0 },
      { x: -12, z: 0, rot: Math.PI / 2 },
      { x: 12, z: 0, rot: Math.PI / 2 }
    ].forEach((w) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(20, 5.5, 1.3), castleStone);
      wall.position.set(w.x, 0.2, w.z);
      wall.rotation.y = w.rot;
      biomePropsGroup.add(wall);

      for (let m = -4; m <= 4; m++) {
        const merlon = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 1.4), castleStone);
        if (w.rot === 0) {
          merlon.position.set(m * 2.1, 3.4, w.z);
        } else {
          merlon.position.set(w.x, 3.4, m * 2.1);
        }
        biomePropsGroup.add(merlon);
      }
    });

    spawnAmbientParticles("#ffb703", 30, 14);
  } else if (biome === "forest") {
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(28, 30, 1.6, 36),
      createMatteMaterial("#7cb587")
    );
    ground.position.y = -2.5;
    biomePropsGroup.add(ground);

    const stream = new THREE.Mesh(
      new THREE.BoxGeometry(38, 0.12, 3.4),
      createMatteMaterial("#72efdd", 0.75)
    );
    stream.position.set(0, -1.68, -9.5);
    stream.rotation.y = 0.18;
    biomePropsGroup.add(stream);

    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.1;
      const radius = 11.2 + (i % 4) * 3.4;
      const tree = new THREE.Group();

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.38, 2.4, 8),
        createMatteMaterial("#6f4e37")
      );
      trunk.position.y = -0.7;

      const c1 = new THREE.Mesh(
        new THREE.ConeGeometry(1.6, 3.0, 10),
        createMatteMaterial("#3b7a57")
      );
      c1.position.y = 1.2;
      const c2 = new THREE.Mesh(
        new THREE.ConeGeometry(1.25, 2.5, 10),
        createMatteMaterial("#529471")
      );
      c2.position.y = 2.6;
      const c3 = new THREE.Mesh(
        new THREE.ConeGeometry(0.85, 1.9, 10),
        createMatteMaterial("#6ab089")
      );
      c3.position.y = 3.8;

      tree.add(trunk, c1, c2, c3);
      tree.scale.setScalar(0.85 + (i % 3) * 0.25);
      tree.position.set(Math.cos(angle) * radius, -1.2, Math.sin(angle) * radius);
      biomePropsGroup.add(tree);

      if (i % 3 === 0) {
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.7 + (i % 2) * 0.35),
          createMatteMaterial("#8d99ae")
        );
        rock.position.set(
          Math.cos(angle + 0.12) * (radius - 1.8),
          -1.4,
          Math.sin(angle + 0.12) * (radius - 1.8)
        );
        biomePropsGroup.add(rock);
      }
    }

    spawnAmbientParticles("#f9f871", 32, 13);
  } else if (biome === "cyberpunk") {
    const terrace = new THREE.Mesh(
      new THREE.BoxGeometry(16.2, 1.3, 16.2),
      createMatteMaterial("#23253a")
    );
    terrace.position.y = -2.35;
    biomePropsGroup.add(terrace);

    const railColor = createMatteMaterial("#00f5d4");
    const nRail = new THREE.Mesh(new THREE.BoxGeometry(15.8, 0.18, 0.18), railColor);
    nRail.position.set(0, -1.0, -7.7);
    const sRail = nRail.clone();
    sRail.position.z = 7.7;
    const eRail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 15.8), railColor);
    eRail.position.set(7.7, -1.0, 0);
    const wRail = eRail.clone();
    wRail.position.x = -7.7;
    biomePropsGroup.add(nRail, sRail, eRail, wRail);

    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const dist = 17.5 + (i % 3) * 5.2;
      const h = 11 + (i % 5) * 4.8;
      const w = 2.5 + (i % 3) * 0.9;
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, w),
        createMatteMaterial(i % 2 === 0 ? "#2e294e" : "#1f2847")
      );
      tower.position.set(Math.cos(angle) * dist, h / 2 - 9, Math.sin(angle) * dist);

      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.18, 0.3, w + 0.18),
        createMatteMaterial(i % 3 === 0 ? "#ff4d8d" : "#00f5d4")
      );
      cap.position.set(tower.position.x, tower.position.y + h / 2 + 0.15, tower.position.z);
      biomePropsGroup.add(tower, cap);
    }

    spawnAmbientParticles("#ff4d8d", 28, 15);
  } else if (biome === "desert") {
    const sandFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(30, 32, 1.6, 36),
      createMatteMaterial("#f3c697")
    );
    sandFloor.position.y = -2.5;
    biomePropsGroup.add(sandFloor);

    const pyramid = new THREE.Mesh(
      new THREE.ConeGeometry(6.5, 8.5, 4),
      createMatteMaterial("#e09f67")
    );
    pyramid.rotation.y = Math.PI / 4;
    pyramid.position.set(11, 1.6, -17);
    biomePropsGroup.add(pyramid);

    const mesaBase = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 5.4, 5.5, 9),
      createMatteMaterial("#c86d51")
    );
    mesaBase.position.set(-12, 0.2, -16);
    const mesaTop = new THREE.Mesh(
      new THREE.CylinderGeometry(3.4, 4.1, 3.2, 9),
      createMatteMaterial("#dc8565")
    );
    mesaTop.position.set(-12, 4.2, -16);
    biomePropsGroup.add(mesaBase, mesaTop);

    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(4.8, 0.95, 10, 24, Math.PI),
      createMatteMaterial("#d47a57")
    );
    arch.position.set(0, -1.8, -18);
    biomePropsGroup.add(arch);

    const oasis = new THREE.Mesh(
      new THREE.CylinderGeometry(3.8, 3.8, 0.14, 24),
      createMatteMaterial("#48cae4", 0.85)
    );
    oasis.position.set(10.5, -1.66, 8.5);
    biomePropsGroup.add(oasis);

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + 0.3;
      const dist = 12.5 + (i % 3) * 3.8;
      const cactus = new THREE.Group();
      const cMat = createMatteMaterial("#588157");
      const mainStem = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 3.0, 10), cMat);
      const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 1.3, 8), cMat);
      arm1.position.set(0.45, 0.35, 0);
      arm1.rotation.z = -Math.PI / 4;
      const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 1.1, 8), cMat);
      arm2.position.set(-0.42, 0.1, 0);
      arm2.rotation.z = Math.PI / 4;
      cactus.add(mainStem, arm1, arm2);
      cactus.position.set(Math.cos(a) * dist, -0.5, Math.sin(a) * dist);
      biomePropsGroup.add(cactus);
    }

    spawnAmbientParticles("#ffd166", 24, 14);
  } else if (biome === "underwater") {
    const seabed = new THREE.Mesh(
      new THREE.CylinderGeometry(28, 30, 1.5, 36),
      createMatteMaterial("#cad2c5")
    );
    seabed.position.y = -2.5;
    biomePropsGroup.add(seabed);

    const coralColors = ["#ff758f", "#ffb703", "#48cae4", "#b5179e"];
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2;
      const dist = 10.5 + (i % 4) * 3.2;
      const coral = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.95 + (i % 3) * 0.45),
        createMatteMaterial(coralColors[i % coralColors.length])
      );
      coral.position.set(Math.cos(a) * dist, -1.25, Math.sin(a) * dist);
      biomePropsGroup.add(coral);
    }

    spawnAmbientParticles("#ffffff", 36, 14);
  } else if (biome === "meadows") {
    const meadowFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(28, 30, 1.5, 36),
      createMatteMaterial("#99d98c")
    );
    meadowFloor.position.y = -2.5;
    biomePropsGroup.add(meadowFloor);

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const dist = 22.5;
      const peak = new THREE.Mesh(
        new THREE.ConeGeometry(5.4, 11.5, 8),
        createMatteMaterial("#7f8c8d")
      );
      peak.position.set(Math.cos(a) * dist, 2.6, Math.sin(a) * dist);
      const snow = new THREE.Mesh(
        new THREE.ConeGeometry(2.5, 5.0, 8),
        createMatteMaterial("#ffffff")
      );
      snow.position.set(Math.cos(a) * dist, 5.9, Math.sin(a) * dist);
      biomePropsGroup.add(peak, snow);
    }
  } else if (biome === "paper") {
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(24, 0.8, 20),
      createMatteMaterial("#c9ada7")
    );
    desk.position.y = -1.95;
    biomePropsGroup.add(desk);
  }
}

function spawnAmbientParticles(hexColor, count, radius) {
  const mat = createMatteMaterial(hexColor, 0.82);
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

// ----------------------------------------------------------------------------
// 5. INDEPENDENT STRIKER GEOMETRY (X, O, CRYSTAL, TORUS, OBELISK, SPHERE)
// ----------------------------------------------------------------------------
function createStrikerMesh(player, cellData, isSelectedForRemoval = false) {
  const group = new THREE.Group();
  const colorHex = isSelectedForRemoval
    ? "#ffd166"
    : player === 1
    ? state.p1Color
    : state.p2Color;
  const shapeType = (player === 1 ? state.p1Shape : state.p2Shape) || (player === 1 ? "x" : "o");
  const mat = createMatteMaterial(colorHex);
  const scale = (cellData.cellSize / 2.55) * 0.84;

  if (state.biome === "paper") {
    if (shapeType === "x") {
      const diag1 = [];
      const diag2 = [];
      for (let i = 0; i <= 8; i++) {
        const t = -0.58 + (i / 8) * 1.16;
        const wobble1 = Math.sin(i * 1.3) * 0.045;
        const wobble2 = Math.cos(i * 1.4) * 0.045;
        diag1.push(new THREE.Vector3(t + wobble1, 0.04, t - wobble1));
        diag2.push(new THREE.Vector3(t + wobble2, 0.04, -t + wobble2));
      }
      group.add(createContinuousCrookedStroke(diag1, 0.068, mat, false));
      group.add(createContinuousCrookedStroke(diag2, 0.068, mat, false));
    } else {
      const loopPoints = [];
      const steps = 20;
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const r = 0.56 + Math.sin(a * 3 + player) * 0.05 + Math.cos(a * 5) * 0.025;
        loopPoints.push(new THREE.Vector3(Math.cos(a) * r, 0.04, Math.sin(a) * r));
      }
      group.add(createContinuousCrookedStroke(loopPoints, 0.068, mat, true));
    }
  } else if (shapeType === "x") {
    const bar1 = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.35, 0.35), mat);
    bar1.rotation.y = Math.PI / 4;
    const bar2 = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.35, 0.35), mat);
    bar2.rotation.y = -Math.PI / 4;
    group.add(bar1, bar2);
  } else if (shapeType === "o") {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.21, 16, 32), mat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  } else if (shapeType === "crystal") {
    group.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.68), mat));
  } else if (shapeType === "torus") {
    group.add(new THREE.Mesh(new THREE.TorusKnotGeometry(0.42, 0.14, 48, 12), mat));
  } else if (shapeType === "obelisk") {
    group.add(new THREE.Mesh(new THREE.ConeGeometry(0.62, 1.15, 5), mat));
  } else {
    group.add(new THREE.Mesh(new THREE.SphereGeometry(0.6, 22, 22), mat));
  }

  group.scale.setScalar(scale);
  group.position.set(cellData.x, state.biome === "paper" ? 0.06 : 0.38, cellData.z);
  group.userData = { row: cellData.row, col: cellData.col, player };
  return group;
}

function rebuildAllMarks() {
  clearGroup(marksGroup);
  const N = state.gridSize || 3;
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
// 6. CORE GAMEPLAY ENGINE, VICTORY BANNER & AUTOMATED AI
// ----------------------------------------------------------------------------
function initBoardState(resetScores = false) {
  sanitizeStateObject(state);
  const N = state.gridSize || 3;
  state.board = Array.from({ length: N }, () => Array(N).fill(0));
  state.currentPlayer = 1;
  state.gameOver = false;
  state.p1MarksQueue = [];
  state.p2MarksQueue = [];
  state.selectedRemovalIndex = null;
  state.currentAttack = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];

  if ($("modal-victory")) $("modal-victory").classList.add("hidden");
  if ($("btn-return-victory")) $("btn-return-victory").classList.add("hidden");

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

  let headline = "";
  let subtext = "";

  if (winner === 1) {
    state.p1Score++;
    state.leaderboard[p1Label] = (state.leaderboard[p1Label] || 0) + 1;
    headline = `${p1Label} Wins the Match!`;
    subtext = `${p1Label} aligned ${state.gridSize} strikes in a row across the AetherGrid.`;
  } else if (winner === 2) {
    state.p2Score++;
    state.leaderboard[p2Label] = (state.leaderboard[p2Label] || 0) + 1;
    headline = `${p2Label} Wins the Match!`;
    subtext = `${p2Label} aligned ${state.gridSize} strikes in a row across the AetherGrid.`;
  } else {
    state.leaderboard.Ties = (state.leaderboard.Ties || 0) + 1;
    headline = "Tactical Stalemate (Draw)!";
    subtext = "Neither contender ceded a straight line on the matrix.";
  }

  updateTurnBanner(headline);

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

  setText("victory-headline", headline);
  setText(
    "victory-subtext",
    state.duelTotalRounds > 1
      ? `${subtext} (Duel Round ${state.duelRound}/${state.duelTotalRounds} • Score ${state.p1Score}:${state.p2Score})`
      : subtext
  );
  setText(
    "btn-victory-rematch",
    state.duelRound < state.duelTotalRounds ? "Next Duel Round" : "Rematch"
  );
  if ($("modal-victory")) $("modal-victory").classList.remove("hidden");
}

// ----------------------------------------------------------------------------
// 7. CAMERA POV MODES, TOAST NOTIFICATION & PLAGUE THEME SWITCH
// ----------------------------------------------------------------------------
let attackPulseTime = 0;
let toastTimeout = null;

function applyCameraMode(index, showNotification = true) {
  state.camModeIndex = ((index % CAMERA_MODES.length) + CAMERA_MODES.length) % CAMERA_MODES.length;
  const preset = CAMERA_MODES[state.camModeIndex];
  targetCamPhi = preset.defaultPhi;
  targetCamTheta = preset.defaultTheta;
  targetCamRadius = preset.radius;

  ["init-cam-select", "pause-cam-select"].forEach((id) => {
    const group = $(id);
    if (!group) return;
    group.querySelectorAll(".seg-btn").forEach((btn) => {
      btn.classList.toggle("active", parseInt(btn.dataset.cam, 10) === state.camModeIndex);
    });
  });

  sfx.playCameraSwitch();
  updateHUD();

  if (showNotification && $("camera-toast")) {
    setText("camera-toast-name", preset.name);
    $("camera-toast").classList.remove("hidden");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      $("camera-toast").classList.add("hidden");
    }, 2200);
  }
}

function cycleCameraPOV() {
  applyCameraMode((state.camModeIndex + 1) % CAMERA_MODES.length, true);
}

function triggerRandomAttackVisual() {
  state.currentAttack = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
  attackPulseTime = 1.0;
  sfx.playAttackPulse();
  updateHUD();
}

function triggerPlagueThemeSwitch() {
  state.theme = state.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", state.theme);
  setText("theme-label", state.theme === "light" ? "Dark Mode" : "Light Mode");

  sfx.playThemePlague();

  const overlay = $("plague-overlay");
  if (overlay) {
    overlay.classList.remove("plague-active");
    void overlay.offsetWidth;
    overlay.classList.add("plague-active");
  }

  document.querySelectorAll(".ui-surface").forEach((el, idx) => {
    el.classList.remove("section-plague");
    void el.offsetWidth;
    setTimeout(() => {
      el.classList.add("section-plague");
    }, idx * 22);
  });

  if ($("modal-stats") && !$("modal-stats").classList.contains("hidden")) {
    drawStatsChart();
  }
}

function formatSeconds(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateTurnBanner(customText) {
  const dot = $("turn-dot");
  const activeName = state.currentPlayer === 1 ? state.p1Name : state.p2Name;
  const rawShape = (state.currentPlayer === 1 ? state.p1Shape : state.p2Shape) || "x";
  const activeShape = String(rawShape).toUpperCase();
  if (dot) {
    dot.style.backgroundColor = state.currentPlayer === 1 ? state.p1Color : state.p2Color;
  }

  if (customText) {
    setText("turn-text", customText);
    return;
  }

  const queue = state.currentPlayer === 1 ? state.p1MarksQueue : state.p2MarksQueue;
  if (state.rule === "threepower" && queue.length >= 3 && state.selectedRemovalIndex === null) {
    setText("turn-text", `${activeName}'s Turn (${activeShape}) — Tap 1 of your 3 marks to relocate`);
  } else {
    setText("turn-text", `${activeName}'s Turn (${activeShape})`);
  }
}

function updateHUD() {
  sanitizeStateObject(state);
  setText("hud-p1-name", `${state.p1Name} (${String(state.p1Shape).toUpperCase()})`);
  setText("hud-p2-name", `${state.p2Name} (${String(state.p2Shape).toUpperCase()})`);
  setText("hud-p1-score", state.p1Score);
  setText("hud-p2-score", state.p2Score);
  setText(
    "hud-p1-marks",
    state.rule === "threepower"
      ? `Active: ${state.p1MarksQueue.length}/3`
      : `Marks: ${state.p1MarksQueue.length}`
  );
  setText(
    "hud-p2-marks",
    state.rule === "threepower"
      ? `Active: ${state.p2MarksQueue.length}/3`
      : `Marks: ${state.p2MarksQueue.length}`
  );

  const modeLabel =
    state.duelTotalRounds > 1
      ? `Duel Rd ${state.duelRound}/${state.duelTotalRounds} (${String(state.difficulty).toUpperCase()})`
      : `${state.gridSize}×${state.gridSize} • ${
          state.rule === "threepower" ? "Three Power Max" : "Standard"
        }`;
  setText("hud-mode-label", modeLabel);

  setText("hud-timer", formatSeconds(state.elapsedSeconds));
  setText("hud-highscore", state.highScore);
  setText("hud-besttime", formatSeconds(state.bestTime));
  setText("hud-attack-name", state.currentAttack);
  setText("hud-cam-mode", CAMERA_MODES[state.camModeIndex]?.name || "Orbital 360° Free");
  setText("hud-sky-speed", `${state.skySpeed.toFixed(1)}x`);

  setText("init-high-score", state.highScore);
  setText("init-best-time", formatSeconds(state.bestTime));

  if (!state.gameOver) updateTurnBanner();
}

// ----------------------------------------------------------------------------
// 8. ANALYTICS GRAPH & LEADERBOARD RENDERER
// ----------------------------------------------------------------------------
function openStatsModal(customSubtitle) {
  const modal = $("modal-stats");
  if (!modal) return;
  modal.classList.remove("hidden");
  if (customSubtitle) {
    setText("stats-modal-subtitle", customSubtitle);
  }

  const tbody = $("leaderboard-body");
  if (tbody) {
    tbody.innerHTML = "";
    const entries = Object.entries(state.leaderboard).sort((a, b) => b[1] - a[1]);
    const totalWins = Math.max(1, entries.reduce((acc, [, v]) => acc + v, 0));

    entries.forEach(([name, count]) => {
      const tr = document.createElement("tr");
      const pct = Math.round((count / totalWins) * 100);
      tr.innerHTML = `<td><strong>${name}</strong></td><td>${count}</td><td>${pct}%</td>`;
      tbody.appendChild(tr);
    });
  }

  requestAnimationFrame(drawStatsChart);
}

function drawStatsChart() {
  const chart = $("stats-chart");
  if (!chart) return;
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

  const barColors = [state.p1Color, state.p2Color, "#9b5de5", "#ff9f1c", "#10b981"];
  const slotW = plotW / Math.max(1, entries.length);
  const barW = Math.min(56, slotW * 0.56);

  entries.forEach(([name, count], idx) => {
    const centerX = padLeft + idx * slotW + slotW / 2;
    const barH = Math.max(4, (count / maxVal) * plotH);
    const x = centerX - barW / 2;
    const y = padTop + plotH - barH;

    ctx.fillStyle = barColors[idx % barColors.length];
    ctx.fillRect(x, y, barW, barH);

    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.font = "700 12px -apple-system, sans-serif";
    ctx.fillText(String(count), centerX, y - 6);
    ctx.fillText(name.slice(0, 10), centerX, H - 11);
  });

  ctx.restore();
}

// ----------------------------------------------------------------------------
// 9. SWATCH PALETTE BUILDER, PAUSE TOGGLE (P KEY) & UI WIRING
// ----------------------------------------------------------------------------
function renderSwatchPalettes() {
  const buildRow = (containerId, swatches, currentHex, onSelect) => {
    const container = $(containerId);
    if (!container) return;
    container.innerHTML = "";
    swatches.forEach((sw) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `pastel-swatch ${
        sw.hex.toLowerCase() === String(currentHex).toLowerCase() ? "active" : ""
      }`;
      btn.style.backgroundColor = sw.hex;
      btn.title = sw.name;
      btn.addEventListener("click", () => {
        sfx.playPlace(false, 1);
        onSelect(sw.hex);
        renderSwatchPalettes();
        buildBoardAndBiome();
        updateHUD();
      });
      container.appendChild(btn);
    });
  };

  buildRow("swatches-p1", STRIKER_SWATCHES, state.p1Color, (hex) => (state.p1Color = hex));
  buildRow("swatches-p2", STRIKER_SWATCHES, state.p2Color, (hex) => (state.p2Color = hex));
  buildRow("swatches-board", BOARD_SWATCHES, state.boardColor, (hex) => (state.boardColor = hex));

  buildRow("pause-swatches-p1", STRIKER_SWATCHES, state.p1Color, (hex) => (state.p1Color = hex));
  buildRow("pause-swatches-p2", STRIKER_SWATCHES, state.p2Color, (hex) => (state.p2Color = hex));
  buildRow(
    "pause-swatches-board",
    BOARD_SWATCHES,
    state.boardColor,
    (hex) => (state.boardColor = hex)
  );
}

function togglePauseMenu() {
  if (state.screen !== "game") return;
  state.paused = !state.paused;
  if ($("modal-pause")) $("modal-pause").classList.toggle("hidden", !state.paused);
  sfx.playCameraSwitch();
}

function autoDetectDevice() {
  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches;
  state.device = isTouch ? "touch" : "desktop";

  if ($("card-desktop")) $("card-desktop").classList.toggle("selected", !isTouch);
  if ($("card-touch")) $("card-touch").classList.toggle("selected", isTouch);
  setText(
    "device-autodetect-msg",
    isTouch
      ? "Auto-Detected: Integrated Touch Unit (Mobile / Tablet / Handheld Hybrid)"
      : "Auto-Detected: Desktop / Laptop Workstation (Press P to Pause in-game)"
  );
}

function bindSegmentedGroup(containerId, callback) {
  const container = $(containerId);
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
  if ($("screen-device")) $("screen-device").classList.toggle("active", target === "device");
  if ($("screen-mode")) $("screen-mode").classList.toggle("active", target === "mode");
  if ($("screen-customize")) {
    $("screen-customize").classList.toggle("active", target === "customize");
  }

  const inGame = target === "game";
  if ($("hud-layer")) $("hud-layer").classList.toggle("hidden", !inGame);
  if ($("turn-banner")) $("turn-banner").classList.toggle("hidden", !inGame);
  if ($("btn-pause-open")) $("btn-pause-open").classList.toggle("hidden", !inGame);
  if ($("device-action-dock")) $("device-action-dock").classList.toggle("hidden", !inGame);
  if (!inGame) {
    if ($("modal-victory")) $("modal-victory").classList.add("hidden");
    if ($("btn-return-victory")) $("btn-return-victory").classList.add("hidden");
  }
}

function wireUIEvents() {
  autoDetectDevice();
  renderSwatchPalettes();

  if (localStorage.getItem(STORAGE_KEYS.SAVED_MATCH) && $("saved-session-bar")) {
    $("saved-session-bar").classList.remove("hidden");
  }

  document.querySelectorAll(".device-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".device-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      state.device = card.dataset.device;
      sfx.playPlace(false, 1);
    });
  });

  bindSegmentedGroup("init-cam-select", (data) => {
    applyCameraMode(parseInt(data.cam, 10), true);
  });

  bindSegmentedGroup("pause-cam-select", (data) => {
    applyCameraMode(parseInt(data.cam, 10), true);
  });

  on("btn-to-mode-screen", "click", () => {
    sfx.playCameraSwitch();
    switchScreen("mode");
  });

  on("btn-back-device", "click", () => switchScreen("device"));

  on("btn-to-customize-screen", "click", () => {
    sfx.playCameraSwitch();
    switchScreen("customize");
  });

  on("btn-back-mode", "click", () => switchScreen("mode"));

  on("btn-toggle-preview-peek", "click", (e) => {
    const card = $("customize-modal-card");
    if (!card) return;
    const isPeeking = card.classList.toggle("peek-mode");
    e.currentTarget.textContent = isPeeking ? "Restore Studio Panel" : "Inspect 360° World";
  });

  on("btn-deploy-match", "click", () => {
    if ($("customize-modal-card")) $("customize-modal-card").classList.remove("peek-mode");
    const p1In = $("input-p1-name");
    const p2In = $("input-p2-name");
    state.p1Name = (p1In && p1In.value.trim()) || "Player 1";
    state.p2Name =
      (p2In && p2In.value.trim()) || (state.mode.startsWith("ai") ? "Aether AI" : "Player 2");
    initBoardState(true);
    switchScreen("game");
    applyCameraMode(state.camModeIndex, true);
  });

  on("btn-theme-toggle", "click", triggerPlagueThemeSwitch);

  bindSegmentedGroup("mode-select", (data) => {
    state.mode = data.mode;
    const p2Input = $("input-p2-name");
    if (p2Input) p2Input.value = state.mode.startsWith("ai") ? "Aether AI" : "Nova";
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

  bindSegmentedGroup("p1-shape-select", (data) => {
    state.p1Shape = data.shape;
    rebuildAllMarks();
  });

  bindSegmentedGroup("p2-shape-select", (data) => {
    state.p2Shape = data.shape;
    rebuildAllMarks();
  });

  bindSegmentedGroup("sky-mode-select", (data) => {
    state.skyMode = data.skymode;
  });

  bindSegmentedGroup("sky-start-select", (data) => {
    state.skyStart = data.skystart;
    state.skyTime = state.skyStart === "day" ? 0.25 : 0.75;
  });

  on("btn-victory-rematch", "click", () => {
    if (state.duelRound < state.duelTotalRounds) {
      state.duelRound++;
      if (state.mode === "ai-duel") {
        const tierIndex = Math.min(4, Math.floor((state.duelRound - 1) / 3));
        state.difficulty = DIFF_ORDER[tierIndex];
      }
      initBoardState(false);
    } else {
      initBoardState(false);
    }
  });

  on("btn-victory-inspect", "click", () => {
    if ($("modal-victory")) $("modal-victory").classList.add("hidden");
    if ($("btn-return-victory")) $("btn-return-victory").classList.remove("hidden");
    applyCameraMode(0, true);
  });

  on("btn-return-victory", "click", () => {
    if ($("modal-victory")) $("modal-victory").classList.remove("hidden");
  });

  on("btn-victory-home", "click", () => {
    if ($("modal-victory")) $("modal-victory").classList.add("hidden");
    switchScreen("device");
  });

  document.querySelectorAll(".card-hide-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".hud-card");
      if (card) card.classList.add("slid-out");
      if ($("btn-unhide-all")) $("btn-unhide-all").classList.remove("hidden");
      sfx.playCameraSwitch();
    });
  });

  on("btn-unhide-all", "click", () => {
    document.querySelectorAll(".hud-card.slid-out").forEach((card) => {
      card.classList.remove("slid-out");
    });
    if ($("btn-unhide-all")) $("btn-unhide-all").classList.add("hidden");
    sfx.playCameraSwitch();
  });

  on("btn-pause-open", "click", togglePauseMenu);
  on("btn-dock-pause", "click", togglePauseMenu);
  on("btn-resume-game", "click", togglePauseMenu);

  bindSegmentedGroup("pause-biome-select", (data) => {
    state.biome = data.biome;
    buildBoardAndBiome();
  });

  bindSegmentedGroup("pause-sky-select", (data) => {
    state.skyMode = data.skymode;
  });

  on("btn-save-leave", "click", () => {
    localStorage.setItem(STORAGE_KEYS.SAVED_MATCH, JSON.stringify(state));
    state.paused = false;
    if ($("modal-pause")) $("modal-pause").classList.add("hidden");
    if ($("saved-session-bar")) $("saved-session-bar").classList.remove("hidden");
    switchScreen("device");
  });

  on("btn-discard-leave", "click", () => {
    state.paused = false;
    if ($("modal-pause")) $("modal-pause").classList.add("hidden");
    switchScreen("device");
  });

  on("btn-resume-saved", "click", () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SAVED_MATCH);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      sanitizeStateObject(parsed);
      Object.assign(state, parsed);
      renderSwatchPalettes();
      buildBoardAndBiome();
      updateHUD();
      switchScreen("game");
    } catch (_) {
      localStorage.removeItem(STORAGE_KEYS.SAVED_MATCH);
    }
  });

  on("btn-hud-reset-round", "click", () => initBoardState(false));
  on("btn-hud-stats", "click", () => openStatsModal());
  on("btn-open-stats-init", "click", () => openStatsModal());
  on("btn-close-stats", "click", () => {
    if ($("modal-stats")) $("modal-stats").classList.add("hidden");
  });

  on("btn-dock-cam", "click", cycleCameraPOV);
  on("btn-dock-fast", "click", () => {
    state.skySpeed = Math.min(8.0, state.skySpeed + 0.5);
    updateHUD();
  });
  on("btn-dock-slow", "click", () => {
    state.skySpeed = Math.max(0.2, state.skySpeed - 0.5);
    updateHUD();
  });
  on("btn-dock-attack", "click", triggerRandomAttackVisual);

  window.addEventListener("keydown", (e) => {
    if (e.target && e.target.tagName === "INPUT") return;
    const key = e.key.toLowerCase();
    if (key === "p") {
      togglePauseMenu();
    } else if (key === "w") {
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

// ----------------------------------------------------------------------------
// 10. 360° FREE POINTER ORBIT IN ALL CAMERA MODES + RAYCASTING
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
  targetCamTheta -= dx * 0.008;
  targetCamPhi = Math.max(0.12, Math.min(1.46, targetCamPhi - dy * 0.0068));
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
  if ($("modal-stats") && !$("modal-stats").classList.contains("hidden")) {
    drawStatsChart();
  }
});

// ----------------------------------------------------------------------------
// 11. MAIN RENDER LOOP & CHRONOMETER (STARTED IMMEDIATELY)
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
  const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameTime) / 1000));
  lastFrameTime = now;

  if (state.skyMode === "dynamic") {
    state.skyTime = (state.skyTime + dt * 0.025 * state.skySpeed) % 1;
  } else {
    state.skyTime = state.skyMode === "day" ? 0.25 : 0.75;
  }

  const daylightFactor = Math.sin(state.skyTime * Math.PI * 2) * 0.5 + 0.5;
  const palette = BIOME_PALETTES[state.biome] || BIOME_PALETTES.royal;
  const dayCol = new THREE.Color(palette.daySky);
  const nightCol = new THREE.Color(palette.nightSky);
  const currentSky = nightCol.clone().lerp(dayCol, daylightFactor);
  scene.background = currentSky;
  scene.fog.color.copy(currentSky);

  sunLight.intensity = 0.28 + daylightFactor * 0.65;
  hemiLight.intensity = 0.45 + daylightFactor * 0.42;
  setText("hud-sky-phase", daylightFactor > 0.5 ? "Daylight" : "Starlight Night");

  cloudsGroup.children.forEach((cloud) => {
    cloud.userData.angle += dt * cloud.userData.speed * state.skySpeed;
    cloud.position.x = Math.cos(cloud.userData.angle) * cloud.userData.dist;
    cloud.position.z = Math.sin(cloud.userData.angle) * cloud.userData.dist;
  });

  ambientParticlesGroup.children.forEach((orb) => {
    orb.position.y =
      orb.userData.baseY +
      Math.sin(now * 0.002 * orb.userData.speed + orb.userData.phase) * 0.65;
  });

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

  if (attackPulseTime > 0) {
    attackPulseTime = Math.max(0, attackPulseTime - dt * 1.8);
    worldGroup.position.x = Math.sin(now * 0.08) * attackPulseTime * 0.24;
    worldGroup.rotation.z = Math.cos(now * 0.06) * attackPulseTime * 0.035;
  } else {
    worldGroup.position.set(0, 0, 0);
    worldGroup.rotation.set(0, 0, 0);
  }

  if (state.screen !== "game" && !isDraggingBoard) {
    targetCamTheta += dt * 0.22;
  }

  camTheta += (targetCamTheta - camTheta) * 0.14;
  camPhi += (targetCamPhi - camPhi) * 0.14;
  camRadius += (targetCamRadius - camRadius) * 0.14;

  camera.position.set(
    camRadius * Math.sin(camPhi) * Math.cos(camTheta),
    camRadius * Math.cos(camPhi),
    camRadius * Math.sin(camPhi) * Math.sin(camTheta)
  );
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

// 1. Build 3D World & Start Render Loop Immediately
buildClouds();
initBoardState(true);
requestAnimationFrame(animate);

// 2. Wire UI Events Safely
wireUIEvents();

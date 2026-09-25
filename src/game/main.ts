import { render } from "./render";
import { renderHud } from "./hud";
import { buildGeneralMap } from "./baseMap";
import { buildClassicMap } from "./classicMap";
import { buildGoogleMap } from "./googleMap";
import { listenKeyboard } from "./keyboard";
import { startGameLoop } from "./loop";
import { Celda } from "./mapa";
import type { Posicion } from "./mapa";
import type { Game } from "./game";
import { createGhosts, consumeInitialPoint } from "./rules";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

type Diseno = "base" | "classic" | "google";
type DisenoConfig = {
  anchoCeldas: number;
  altoCeldas: number;
  tamanoCelda: number;
  construirMapa: (
    celdas: Celda[][],
    ancho: number,
    alto: number,
    colores: Record<string, string>,
    teletransportes: Record<string, Posicion>,
  ) => void;
};

const disenos: Record<Diseno, DisenoConfig> = {
  base: {
    anchoCeldas: 28,
    altoCeldas: 31,
    tamanoCelda: 20,
    construirMapa: buildClassicMap,
  },
  classic: {
    anchoCeldas: 40,
    altoCeldas: 30,
    tamanoCelda: 40,
    construirMapa: buildGeneralMap,
  },
  google: {
    anchoCeldas: 58,
    altoCeldas: 17,
    tamanoCelda: 20,
    construirMapa: buildGoogleMap,
  },
};

const requestedMap = new URLSearchParams(location.search).get("map");
const diseno: Diseno = requestedMap === "base" || requestedMap === "classic" ? requestedMap : "google";
const { anchoCeldas, altoCeldas, tamanoCelda, construirMapa } = disenos[diseno];

canvas.width = anchoCeldas * tamanoCelda;
canvas.height = altoCeldas * tamanoCelda;

const ancho = anchoCeldas;
const alto = altoCeldas;

const celdas: Celda[][] = Array.from({ length: alto }, () =>
  Array.from({ length: ancho }, () => Celda.Punto),
);

const colores: Record<string, string> = {};
const teletransportes: Record<string, Posicion> = {};
construirMapa(celdas, ancho, alto, colores, teletransportes);

function isOpen(position: Posicion): boolean {
  const cell = celdas[position.y]?.[position.x];
  return cell !== undefined && cell !== Celda.Pared && cell !== Celda.Border && cell !== Celda.Tunel;
}

function nearestOpen(origin: Posicion, used: Posicion[] = []): Posicion {
  for (let radius = 0; radius < Math.max(ancho, alto); radius++) {
    for (let y = Math.max(1, origin.y - radius); y < Math.min(alto - 1, origin.y + radius + 1); y++) {
      for (let x = Math.max(1, origin.x - radius); x < Math.min(ancho - 1, origin.x + radius + 1); x++) {
        if (Math.abs(x - origin.x) + Math.abs(y - origin.y) !== radius) continue;
        if (isOpen({ x, y }) && !used.some((item) => item.x === x && item.y === y)) return { x, y };
      }
    }
  }
  return { x: 1, y: 1 };
}

const pacmanStart = nearestOpen({ x: 1, y: 1 });
const ghostStarts: Posicion[] = [];
for (let index = 0; index < 4; index++) {
  ghostStarts.push(nearestOpen({ x: Math.floor(ancho / 2), y: Math.floor(alto / 2) }, ghostStarts));
}

const pointPositions: Posicion[] = [];
for (let y = 0; y < alto; y++) for (let x = 0; x < ancho; x++) {
  if (celdas[y][x] === Celda.Punto || celdas[y][x] === Celda.PuntoGrande) pointPositions.push({ x, y });
}
const powerAnchors: Posicion[] = [
  { x: 1, y: 1 },
  { x: Math.floor(ancho / 2), y: 1 },
  { x: ancho - 2, y: 1 },
  { x: ancho - 2, y: Math.floor(alto / 2) },
  { x: ancho - 2, y: alto - 2 },
  { x: Math.floor(ancho / 2), y: alto - 2 },
  { x: 1, y: alto - 2 },
  { x: 1, y: Math.floor(alto / 2) },
];
const powerPositions: Posicion[] = [];

for (const anchor of powerAnchors) {
  const powerPosition = nearestOpen(anchor, powerPositions);
  if (powerPosition.x === pacmanStart.x && powerPosition.y === pacmanStart.y) continue;
  powerPositions.push(powerPosition);
}

for (const powerPosition of powerPositions.slice(0, 7)) {
  celdas[powerPosition.y][powerPosition.x] = Celda.PuntoGrande;
}

const state: Game = {
  mapa: { ancho, alto, celdas, tamanoCelda, colores, teletransportes },
  pacman: {
    posicion: { ...pacmanStart },
    posicionAnterior: { ...pacmanStart },
    direccion: "derecha",
    direccionSiguiente: "derecha",
    velocidad: 0,
  },
  fantasmas: createGhosts(ghostStarts),
  puntos: { total: 0, posicionesRestantes: pointPositions },
  vidas: { actuales: 3, maximas: 3 },
  nivel: { actual: 1, velocidadFantasmas: 0 },
  estado: "menu",
  pacmanStart,
  invulnerableTicks: 10,
  powerTicks: 0,
  deathTicks: 0,
  tick: 0,
};

consumeInitialPoint(state);

if (ctx) {
  render(ctx, state);
  renderHud(state);

  listenKeyboard(state);

  startGameLoop(state, (progreso) => {
    render(ctx, state, progreso);
    renderHud(state);
  });

  document.getElementById("btn-play")?.addEventListener("click", () => {
    if (state.estado === "menu" || state.estado === "pausa") state.estado = "jugando";
  });
  document.getElementById("btn-pausa")?.addEventListener("click", () => {
    if (state.estado === "jugando") state.estado = "pausa";
    else if (state.estado === "pausa") state.estado = "jugando";
  });
  document.getElementById("btn-menu")?.addEventListener("click", () => location.reload());

  const mapSelect = document.getElementById("map-select") as HTMLSelectElement | null;
  if (mapSelect) {
    mapSelect.value = diseno;
    mapSelect.addEventListener("change", () => {
      const url = new URL(location.href);
      url.searchParams.set("map", mapSelect.value);
      location.href = url.toString();
    });
  }

}

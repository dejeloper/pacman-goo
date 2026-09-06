import {render} from "./render";
import {renderDebug, toggleDebugPanel} from "./debug";
import {buildGeneralMap} from "./baseMap";
import {buildClassicMap} from "./classicMap";
import {buildGoogleMap} from "./googleMap";
import {listenKeyboard} from "./keyboard";
import {startGameLoop} from "./loop";
import {Celda} from "./mapa";
import type {Game} from "./game";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

type Diseno = "base" | "classic" | "google";
type DisenoConfig = {
  anchoCeldas: number;
  altoCeldas: number;
  tamanoCelda: number;
  construirMapa: (celdas: Celda[][], ancho: number, alto: number, colores: Record<string, string>) => void;
};

const disenos: Record<Diseno, DisenoConfig> = {
  base: {
    anchoCeldas: 28,
    altoCeldas: 31,
    tamanoCelda: 20,
    construirMapa: buildClassicMap
  },
  classic: {
    anchoCeldas: 40,
    altoCeldas: 30,
    tamanoCelda: 40,
    construirMapa: buildGeneralMap
  },
  google: {
    anchoCeldas: 58,
    altoCeldas: 17,
    tamanoCelda: 20,
    construirMapa: buildGoogleMap
  },
};

const diseno: Diseno = "google";
const {anchoCeldas, altoCeldas, tamanoCelda, construirMapa} = disenos[diseno];

canvas.width = anchoCeldas * tamanoCelda;
canvas.height = altoCeldas * tamanoCelda;

const ancho = anchoCeldas;
const alto = altoCeldas;

const celdas: Celda[][] = Array.from({length: alto}, () =>
  Array.from({length: ancho}, () => Celda.Punto),
);

const colores: Record<string, string> = {};
construirMapa(celdas, ancho, alto, colores);

const state: Game = {
  mapa: {ancho, alto, celdas, tamanoCelda, colores},
  pacman: {
    posicion: {x: 1, y: 1},
    posicionAnterior: {x: 1, y: 1},
    direccion: "derecha",
    direccionSiguiente: "derecha",
    velocidad: 0,
  },
  fantasmas: [],
  puntos: {total: 0, posicionesRestantes: []},
  vidas: {actuales: 3, maximas: 3},
  nivel: {actual: 1, velocidadFantasmas: 0},
  estado: "jugando",
};

if (ctx) {
  render(ctx, state);
  renderDebug(state);

  listenKeyboard(state);

  startGameLoop(state, (progreso) => {
    render(ctx, state, progreso);
    renderDebug(state);
  });

  document.getElementById("btn-verlog")?.addEventListener("click", () => {
    toggleDebugPanel();
    render(ctx, state);
    renderDebug(state);
  });
}

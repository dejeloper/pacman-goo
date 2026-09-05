import {render} from "./render";
import {renderDebug, toggleDebugPanel} from "./debug";
import {movePacman} from "./movement";
import {Celda, TAMANO_CELDA} from "./mapa";
import type {Game} from "./game";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

document.getElementById("btn-verlog")?.addEventListener("click", toggleDebugPanel);

const ancho = canvas.width / TAMANO_CELDA;
const alto = canvas.height / TAMANO_CELDA;

const celdas: Celda[][] = Array.from({length: alto}, () =>
  Array.from({length: ancho}, () => Celda.Punto),
);


const state: Game = {
  mapa: {ancho, alto, celdas},
  pacman: {
    posicion: {x: 1, y: 1},
    direccion: "derecha",
    direccionSiguiente: "derecha",
    velocidad: 0,
  },
  fantasmas: [],
  puntos: {total: 0, posicionesRestantes: []},
  vidas: {actuales: 3, maximas: 3},
  nivel: {actual: 1, velocidadFantasmas: 0},
  estado: "menu",
};

const PASOS_POR_CICLO = 20;
const MS_POR_PASO = 500;
let pasos = 0;

if (ctx) {
  render(ctx, state);
  renderDebug(state);

  setInterval(() => {
    movePacman(state);
    pasos++;

    if (pasos >= PASOS_POR_CICLO) {
      state.pacman.posicion = {x: 1, y: 1};
      pasos = 0;
    }

    render(ctx, state);
    renderDebug(state);
  }, MS_POR_PASO);
}

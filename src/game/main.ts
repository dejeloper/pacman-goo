import { render } from "./render";
import { Celda, TAMANO_CELDA } from "./mapa";
import type { Game } from "./game";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const ancho = canvas.width / TAMANO_CELDA;
const alto = canvas.height / TAMANO_CELDA;

const celdas: Celda[][] = Array.from({ length: alto }, (_, fila) =>
  Array.from({ length: ancho }, (_, columna) => {
    const esBorde =
      fila === 0 || fila === alto - 1 || columna === 0 || columna === ancho - 1;
    return esBorde ? Celda.Pared : Celda.Punto;
  }),
);

const state: Game = {
  mapa: { ancho, alto, celdas },
  pacman: {
    posicion: { x: 0, y: 0 },
    direccion: "derecha",
    direccionSiguiente: "derecha",
    velocidad: 0,
  },
  fantasmas: [],
  puntos: { total: 0, posicionesRestantes: [] },
  vidas: { actuales: 3, maximas: 3 },
  nivel: { actual: 1, velocidadFantasmas: 0 },
  estado: "menu",
};

if (ctx) {
  render(ctx, state);
}

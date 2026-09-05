import type { Game } from "./game";
import { Celda, type Posicion } from "./mapa";
import type { Direccion } from "./pacman";

const DELTAS: Record<Direccion, Posicion> = {
  arriba: { x: 0, y: -1 },
  abajo: { x: 0, y: 1 },
  izquierda: { x: -1, y: 0 },
  derecha: { x: 1, y: 0 },
};

function canMoveTo(state: Game, posicion: Posicion): boolean {
  const { mapa } = state;

  if (
    posicion.y < 0 ||
    posicion.y >= mapa.celdas.length ||
    posicion.x < 0 ||
    posicion.x >= mapa.celdas[posicion.y].length
  ) {
    return false;
  }

  return mapa.celdas[posicion.y][posicion.x] !== Celda.Pared;
}

export function movePacman(state: Game): void {
  const { pacman } = state;
  const delta = DELTAS[pacman.direccion];
  const destino: Posicion = {
    x: pacman.posicion.x + delta.x,
    y: pacman.posicion.y + delta.y,
  };

  if (canMoveTo(state, destino)) {
    pacman.posicion = destino;
  }
}

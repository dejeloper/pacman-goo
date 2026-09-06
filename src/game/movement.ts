import type { Game } from "./game";
import { Celda, type Posicion } from "./mapa";
import type { Direccion } from "./pacman";
import { INTERVALO_MS } from "./speed";

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

  const celda = mapa.celdas[posicion.y][posicion.x];
  return (
    celda !== Celda.Pared && celda !== Celda.Border && celda !== Celda.Tunel
  );
}

function destinationAt(posicion: Posicion, direccion: Direccion): Posicion {
  const delta = DELTAS[direccion];
  return { x: posicion.x + delta.x, y: posicion.y + delta.y };
}

function getTurnLookahead(): number {
  if (INTERVALO_MS >= 300) return 0;
  if (INTERVALO_MS >= 200) return 1;
  return 2;
}

export function canMoveTowards(state: Game, direccion: Direccion): boolean {
  const { pacman } = state;
  let posicion = pacman.posicion;
  const turnLookahead = getTurnLookahead();

  for (let pasos = 0; pasos <= turnLookahead; pasos++) {
    if (canMoveTo(state, destinationAt(posicion, direccion))) return true;

    const siguiente = destinationAt(posicion, pacman.direccion);
    if (!canMoveTo(state, siguiente)) break;

    posicion = siguiente;
  }

  return false;
}

export function movePacman(state: Game): void {
  if (state.estado !== "jugando") return;

  const { pacman } = state;

  earnPoint(state, pacman.posicion);

  pacman.posicionAnterior = pacman.posicion;

  const destinoGiro = destinationAt(pacman.posicion, pacman.direccionSiguiente);
  if (canMoveTo(state, destinoGiro)) {
    pacman.direccion = pacman.direccionSiguiente;
    pacman.posicion = destinoGiro;
    applyTeleport(state);
    return;
  }

  const destinoRecto = destinationAt(pacman.posicion, pacman.direccion);
  if (canMoveTo(state, destinoRecto)) {
    pacman.posicion = destinoRecto;
    applyTeleport(state);
  }
}

function applyTeleport(state: Game): void {
  const { pacman, mapa } = state;
  const celda = mapa.celdas[pacman.posicion.y][pacman.posicion.x];
  if (celda !== Celda.Transportador) return;

  const destino =
    mapa.teletransportes[`${pacman.posicion.x}-${pacman.posicion.y}`];
  if (!destino) return;

  pacman.posicion = destino;
  pacman.posicionAnterior = destino;
}

const VALOR_PUNTO = 1;
const VALOR_PUNTO_GRANDE = 10;
export const VALOR_FRUTA = 50;
export const VALOR_FANTASMA = 100;

function earnPoint(state: Game, posicion: Posicion): void {
  const { mapa, puntos } = state;
  const celda = mapa.celdas[posicion.y][posicion.x];

  if (celda !== Celda.Punto && celda !== Celda.PuntoGrande) return;

  puntos.total +=
    celda === Celda.PuntoGrande ? VALOR_PUNTO_GRANDE : VALOR_PUNTO;
  mapa.celdas[posicion.y][posicion.x] = Celda.Vacia;
}

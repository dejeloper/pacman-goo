import type {Fantasma, NombreFantasma} from "./fantasmas";
import type {Game} from "./game";
import type {Posicion} from "./mapa";
import type {Direccion} from "./pacman";
import {canMoveTo, earnPoint, VALOR_FANTASMA} from "./movement";
import {DEATH_TOTAL_TICKS} from "./speed";

const DIRECTIONS: Direccion[] = ["arriba", "abajo", "izquierda", "derecha"];
const DELTAS: Record<Direccion, Posicion> = {
  arriba: {x: 0, y: -1}, abajo: {x: 0, y: 1},
  izquierda: {x: -1, y: 0}, derecha: {x: 1, y: 0},
};
const OPPOSITE: Record<Direccion, Direccion> = {
  arriba: "abajo", abajo: "arriba", izquierda: "derecha", derecha: "izquierda",
};

function nextPosition(posicion: Posicion, direccion: Direccion): Posicion {
  const d = DELTAS[direccion];
  return {x: posicion.x + d.x, y: posicion.y + d.y};
}

function getOptions(state: Game, ghost: Fantasma): Direccion[] {
  const available = DIRECTIONS.filter((direction) =>
    canMoveTo(state, nextPosition(ghost.posicion, direction), true));
  const withoutReverse = available.filter((direction) => direction !== OPPOSITE[ghost.direccion]);
  return withoutReverse.length ? withoutReverse : available;
}

function distance(a: Posicion, b: Posicion): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function shortestDirection(
  state: Game,
  start: Posicion,
  target: Posicion,
): Direccion | undefined {
  const queue: Array<{position: Posicion; firstDirection: Direccion}> = [];
  const visited = new Set([`${start.x}-${start.y}`]);

  for (const direction of DIRECTIONS) {
    const position = nextPosition(start, direction);
    if (!canMoveTo(state, position, true)) continue;
    queue.push({position, firstDirection: direction});
    visited.add(`${position.x}-${position.y}`);
  }

  for (let index = 0; index < queue.length; index++) {
    const current = queue[index];
    if (current.position.x === target.x && current.position.y === target.y) {
      return current.firstDirection;
    }

    for (const direction of DIRECTIONS) {
      const position = nextPosition(current.position, direction);
      const key = `${position.x}-${position.y}`;
      if (visited.has(key) || !canMoveTo(state, position, true)) continue;
      visited.add(key);
      queue.push({position, firstDirection: current.firstDirection});
    }
  }
}

export function moveGhosts(state: Game): void {
  for (const ghost of state.fantasmas) {
    ghost.previousPosition = {...ghost.posicion};
    const options = getOptions(state, ghost);
    if (!options.length) continue;

    let direction: Direccion;
    if (ghost.modo === "comido") {
      direction = shortestDirection(state, ghost.posicion, ghost.startPosition) ?? options[0];
    } else if (ghost.modo === "asustado") {
      direction = [...options].sort((a, b) =>
        distance(nextPosition(ghost.posicion, b), state.pacman.posicion) -
        distance(nextPosition(ghost.posicion, a), state.pacman.posicion))[0];
    } else {
      // Un poco de azar conserva el carácter arcade sin volverlos predecibles.
      direction = options[Math.floor(Math.random() * options.length)];
    }

    ghost.direccion = direction;
    ghost.posicion = nextPosition(ghost.posicion, direction);
    if (ghost.modo === "comido" && distance(ghost.posicion, ghost.startPosition) === 0) {
      ghost.modo = "persecucion";
    }
  }
}

function overlap(a: Posicion, b: Posicion): boolean {
  return a.x === b.x && a.y === b.y;
}

export function resolveCollisions(state: Game): void {
  for (const ghost of state.fantasmas) {
    const collision = overlap(state.pacman.posicion, ghost.posicion) ||
      (overlap(state.pacman.posicion, ghost.previousPosition) &&
        overlap(state.pacman.posicionAnterior, ghost.posicion));
    if (!collision || ghost.modo === "comido") continue;

    if (state.powerTicks > 0) {
      ghost.modo = "comido";
      state.puntos.total += VALOR_FANTASMA;
      continue;
    }
    if (state.invulnerableTicks > 0) continue;

    state.vidas.actuales--;
    state.pacman.posicionAnterior = {...state.pacman.posicion};
    for (const frozenGhost of state.fantasmas) {
      frozenGhost.previousPosition = {...frozenGhost.posicion};
    }
    state.estado = "muerte";
    state.deathTicks = DEATH_TOTAL_TICKS;
    return;
  }
}

export function updateDeath(state: Game): void {
  if (state.estado !== "muerte") return;
  state.deathTicks--;
  if (state.deathTicks > 0) return;

  if (state.vidas.actuales <= 0) {
    state.estado = "derrota";
    return;
  }

  state.pacman.posicion = {...state.pacmanStart};
  state.pacman.posicionAnterior = {...state.pacmanStart};
  state.pacman.direccion = "derecha";
  state.pacman.direccionSiguiente = "derecha";
  state.invulnerableTicks = 10;
  state.estado = "jugando";
}

export function updateRules(state: Game): void {
  state.tick++;
  if (state.invulnerableTicks > 0) state.invulnerableTicks--;
  if (state.powerTicks > 0) {
    state.powerTicks--;
    for (const ghost of state.fantasmas) {
      if (ghost.modo !== "comido") ghost.modo = "asustado";
    }
  } else {
    for (const ghost of state.fantasmas) {
      if (ghost.modo === "asustado") ghost.modo = "persecucion";
    }
  }
  moveGhosts(state);
  resolveCollisions(state);
  if (state.puntos.posicionesRestantes.length === 0 && state.estado === "jugando") {
    state.estado = "victoria";
  }
}

export function createGhosts(startPositions: Posicion[]): Fantasma[] {
  const definitions: Array<[NombreFantasma, string]> = [
    ["blinky", "#ff3030"], ["pinky", "#ff9de2"],
    ["inky", "#35e7ff"], ["clyde", "#ffae42"],
  ];
  return definitions.map(([nombre, color], index) => {
    const startPosition = startPositions[index % startPositions.length];
    return {
      nombre, color, startPosition: {...startPosition}, posicion: {...startPosition},
      previousPosition: {...startPosition}, direccion: index % 2 ? "izquierda" : "derecha",
      modo: "persecucion"
    };
  });
}

export function consumeInitialPoint(state: Game): void {
  earnPoint(state, state.pacman.posicion);
}

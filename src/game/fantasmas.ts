import type { Direccion } from "./pacman";
import type { Posicion } from "./mapa";

export type NombreFantasma = "blinky" | "pinky" | "inky" | "clyde";

export type ModoFantasma = "persecucion" | "dispersion" | "asustado" | "comido";

export interface Fantasma {
  nombre: NombreFantasma;
  posicion: Posicion;
  previousPosition: Posicion;
  startPosition: Posicion;
  direccion: Direccion;
  modo: ModoFantasma;
  color: string;
}

export type Fantasmas = Fantasma[];

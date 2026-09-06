import type { Posicion } from "./mapa";

export type Direccion = "arriba" | "abajo" | "izquierda" | "derecha";

export interface Pacman {
  posicion: Posicion;
  posicionAnterior: Posicion;
  direccion: Direccion;
  direccionSiguiente: Direccion;
  velocidad: number;
}

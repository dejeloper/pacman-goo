import type { Mapa } from "./mapa";
import type { Pacman } from "./pacman";
import type { Fantasmas } from "./fantasmas";
import type { Puntos } from "./puntos";
import type { Vidas } from "./vidas";
import type { Nivel } from "./nivel";
import type { Estado } from "./estado";

export interface Game {
  mapa: Mapa;
  pacman: Pacman;
  fantasmas: Fantasmas;
  puntos: Puntos;
  vidas: Vidas;
  nivel: Nivel;
  estado: Estado;
}

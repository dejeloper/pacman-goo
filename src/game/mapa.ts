export const TAMANO_CELDA = 20;

export enum Celda {
  Vacia = 0,
  Pared = 1,
  Punto = 2,
  PuntoGrande = 3,
  Tunel = 4,
}

export interface Posicion {
  x: number;
  y: number;
}

export interface Mapa {
  ancho: number;
  alto: number;
  celdas: Celda[][];
}

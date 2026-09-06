export enum Celda {
  Vacia = 0,
  Pared = 1,
  Punto = 2,
  PuntoGrande = 3,
  Tunel = 4,
  Border = 99
}

export interface Posicion {
  x: number;
  y: number;
}

export interface Mapa {
  ancho: number;
  alto: number;
  celdas: Celda[][];
  tamanoCelda: number;
  colores: Record<string, string>;
}

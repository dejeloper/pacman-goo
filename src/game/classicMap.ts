import { Celda } from "./mapa";
import type { Posicion } from "./mapa";
import { buildBorderWalls } from "./walls";
import {
  agregarSegmento,
  buildFromTramos,
  mirrorTramosPorFila,
  type Tramo,
} from "./tramos";

export function buildClassicMap(
  celdas: Celda[][],
  ancho: number,
  alto: number,
  colores: Record<string, string>,
  _teletransportes: Record<string, Posicion>,
): void {
  buildBorderWalls(celdas, ancho, alto);

  const medioX = Math.floor(ancho / 2);
  const medioY = Math.floor(alto / 2);

  const casaIzquierda = medioX - 3;
  const casaDerecha = medioX + 2;
  const casaArriba = medioY - 2;
  const casaAbajo = medioY + 1;

  const filaTunel = casaArriba - 3;

  const tramos: Record<number, Tramo[]> = {};

  agregarSegmento(
    tramos,
    { x: 0, y: filaTunel },
    { x: 0, y: filaTunel },
    Celda.Tunel,
  );
  agregarSegmento(
    tramos,
    { x: ancho - 1, y: filaTunel },
    { x: ancho - 1, y: filaTunel },
    Celda.Tunel,
  );

  agregarSegmento(
    tramos,
    { x: casaIzquierda, y: casaAbajo },
    { x: casaDerecha, y: casaAbajo },
  );
  agregarSegmento(
    tramos,
    { x: casaIzquierda, y: casaArriba },
    { x: casaIzquierda, y: casaAbajo },
  );
  agregarSegmento(
    tramos,
    { x: casaDerecha, y: casaArriba },
    { x: casaDerecha, y: casaAbajo },
  );

  const segmentos: [Posicion, Posicion][] = [
    [
      { x: 2, y: 2 },
      { x: 6, y: 2 },
    ],
    [
      { x: 9, y: 2 },
      { x: 9, y: 5 },
    ],
    [
      { x: 2, y: 5 },
      { x: 2, y: 9 },
    ],
    [
      { x: 2, y: 9 },
      { x: 6, y: 9 },
    ],
    [
      { x: 9, y: 8 },
      { x: 9, y: 12 },
    ],
    [
      { x: 12, y: 2 },
      { x: 12, y: 6 },
    ],
    [
      { x: 2, y: 13 },
      { x: 6, y: 13 },
    ],
    [
      { x: 2, y: 16 },
      { x: 2, y: 20 },
    ],
    [
      { x: 6, y: 16 },
      { x: 6, y: 20 },
    ],
    [
      { x: 2, y: 20 },
      { x: 6, y: 20 },
    ],
    [
      { x: 9, y: 16 },
      { x: 9, y: 20 },
    ],
    [
      { x: 2, y: 23 },
      { x: 9, y: 23 },
    ],
    [
      { x: 2, y: 26 },
      { x: 6, y: 26 },
    ],
    [
      { x: 9, y: 24 },
      { x: 9, y: 27 },
    ],
    [
      { x: 12, y: 23 },
      { x: 12, y: 27 },
    ],
  ];

  for (const [desde, hasta] of segmentos) {
    agregarSegmento(tramos, desde, hasta);
  }

  buildFromTramos(celdas, colores, mirrorTramosPorFila(tramos, ancho));
}

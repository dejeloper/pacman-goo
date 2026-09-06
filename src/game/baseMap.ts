import { Celda } from "./mapa";
import type { Posicion } from "./mapa";
import { buildBorderWalls } from "./walls";
import {
  agregarSegmento,
  buildFromTramos,
  mirrorTramosPorFila,
  type Tramo,
} from "./tramos";

export function buildGeneralMap(
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

  const tramos: Record<number, Tramo[]> = {};

  agregarSegmento(
    tramos,
    { x: casaIzquierda, y: casaArriba },
    { x: casaDerecha, y: casaArriba },
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
      { x: 3, y: 3 },
      { x: 8, y: 3 },
    ],
    [
      { x: 8, y: 3 },
      { x: 8, y: 8 },
    ],
    [
      { x: 3, y: 8 },
      { x: 8, y: 8 },
    ],

    [
      { x: 12, y: 6 },
      { x: 12, y: 11 },
    ],

    [
      { x: 3, y: 12 },
      { x: 3, y: 17 },
    ],
    [
      { x: 3, y: 17 },
      { x: 8, y: 17 },
    ],

    [
      { x: 3, y: 22 },
      { x: 3, y: 26 },
    ],
    [
      { x: 3, y: 22 },
      { x: 9, y: 22 },
    ],

    [
      { x: 12, y: 20 },
      { x: 12, y: 25 },
    ],
    [
      { x: 12, y: 25 },
      { x: 16, y: 25 },
    ],
  ];

  for (const [desde, hasta] of segmentos) {
    agregarSegmento(tramos, desde, hasta);
  }

  buildFromTramos(celdas, colores, mirrorTramosPorFila(tramos, ancho));
}

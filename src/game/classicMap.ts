import { Celda } from "./mapa";
import type { Posicion } from "./mapa";
import { drawWall, buildBorderWalls } from "./walls";

export function buildClassicMap(
  celdas: Celda[][],
  ancho: number,
  alto: number,
): void {
  buildBorderWalls(celdas, ancho, alto);

  const medioX = Math.floor(ancho / 2);
  const medioY = Math.floor(alto / 2);

  // casa de fantasmas central, con entrada abierta hacia arriba
  const casaIzquierda = medioX - 3;
  const casaDerecha = medioX + 2;
  const casaArriba = medioY - 2;
  const casaAbajo = medioY + 1;

  // túnel lateral en una fila libre, arriba de la casa (a la misma altura la bloquearían sus paredes)
  const filaTunel = casaArriba - 3;
  celdas[filaTunel][0] = Celda.Tunel;
  celdas[filaTunel][ancho - 1] = Celda.Tunel;

  drawWall(
    celdas,
    { x: casaIzquierda, y: casaAbajo },
    { x: casaDerecha, y: casaAbajo },
  );
  drawWall(
    celdas,
    { x: casaIzquierda, y: casaArriba },
    { x: casaIzquierda, y: casaAbajo },
  );
  drawWall(
    celdas,
    { x: casaDerecha, y: casaArriba },
    { x: casaDerecha, y: casaAbajo },
  );

  // bloques tipo "peine" del lado izquierdo; cada uno se refleja al lado derecho
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
    drawWall(celdas, desde, hasta);
    drawWall(
      celdas,
      { x: ancho - 1 - desde.x, y: desde.y },
      { x: ancho - 1 - hasta.x, y: hasta.y },
    );
  }
}

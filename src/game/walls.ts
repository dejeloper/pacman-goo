import {Celda} from "./mapa";
import type {Posicion} from "./mapa";

export function drawWall(
  celdas: Celda[][],
  desde: Posicion,
  hasta: Posicion,
  tipo: Celda = Celda.Pared,
): void {
  const pasoX = Math.sign(hasta.x - desde.x);
  const pasoY = Math.sign(hasta.y - desde.y);

  let x = desde.x;
  let y = desde.y;

  while (true) {
    celdas[y][x] = tipo;
    if (x === hasta.x && y === hasta.y) break;
    x += pasoX;
    y += pasoY;
  }
}

export function buildBorderWalls(celdas: Celda[][], ancho: number, alto: number): void {
  drawWall(celdas, {x: 0, y: 0}, {x: ancho - 1, y: 0}, Celda.Border);
  drawWall(celdas, {x: 0, y: alto - 1}, {x: ancho - 1, y: alto - 1}, Celda.Border);
  drawWall(celdas, {x: 0, y: 0}, {x: 0, y: alto - 1}, Celda.Border);
  drawWall(celdas, {x: ancho - 1, y: 0}, {x: ancho - 1, y: alto - 1}, Celda.Border);
}
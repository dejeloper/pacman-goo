import { Celda } from "./mapa";
import type { Posicion } from "./mapa";
import { drawWall } from "./walls";

export interface Tramo {
  desde: number;
  hasta: number;
  tipo: Celda;
  color?: string;
}

export function pared(desde: number, hasta: number, color?: string): Tramo {
  return { desde, hasta, tipo: Celda.Pared, color };
}

export function vacia(desde: number, hasta: number): Tramo {
  return { desde, hasta, tipo: Celda.Vacia };
}

export function tunel(desde: number, hasta: number): Tramo {
  return { desde, hasta, tipo: Celda.Tunel };
}

export function agregarSegmento(
  tramosPorFila: Record<number, Tramo[]>,
  desde: Posicion,
  hasta: Posicion,
  tipo: Celda = Celda.Pared,
  color?: string,
): void {
  if (desde.y === hasta.y) {
    const fila = desde.y;
    const x1 = Math.min(desde.x, hasta.x);
    const x2 = Math.max(desde.x, hasta.x);
    (tramosPorFila[fila] ??= []).push({ desde: x1, hasta: x2, tipo, color });
    return;
  }

  const x = desde.x;
  const y1 = Math.min(desde.y, hasta.y);
  const y2 = Math.max(desde.y, hasta.y);
  for (let fila = y1; fila <= y2; fila++) {
    (tramosPorFila[fila] ??= []).push({ desde: x, hasta: x, tipo, color });
  }
}

export function mirrorTramosPorFila(
  tramosPorFila: Record<number, Tramo[]>,
  ancho: number,
): Record<number, Tramo[]> {
  const resultado: Record<number, Tramo[]> = {};

  for (const [fila, tramos] of Object.entries(tramosPorFila)) {
    const espejados = tramos.map(
      ({ desde, hasta, tipo, color }): Tramo => ({
        desde: ancho - 1 - hasta,
        hasta: ancho - 1 - desde,
        tipo,
        color,
      }),
    );
    resultado[Number(fila)] = [...tramos, ...espejados];
  }

  return resultado;
}

const COLOR_PARED_POR_DEFECTO = "#1919a6";

export function buildFromTramos(
  celdas: Celda[][],
  colores: Record<string, string>,
  tramosPorFila: Record<number, Tramo[]>,
  coloresPorNombre: Record<string, string> = {},
): void {
  for (const [fila, tramos] of Object.entries(tramosPorFila)) {
    for (const { desde, hasta, tipo, color } of tramos) {
      drawWall(
        celdas,
        { x: desde, y: Number(fila) },
        { x: hasta, y: Number(fila) },
        tipo,
      );

      if (tipo !== Celda.Pared) continue;

      for (let x = desde; x <= hasta; x++) {
        colores[`${x}-${fila}`] =
          (color && coloresPorNombre[color]) ?? COLOR_PARED_POR_DEFECTO;
      }
    }
  }
}

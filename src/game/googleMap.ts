import { Celda } from "./mapa";
import type { Posicion } from "./mapa";
import { drawWall, buildBorderWalls, buildTeleportPair } from "./walls";

const NOMBRES_COLORES: Record<string, string> = {
  azul: "#4285f4",
  rojo: "#ea4235",
  amarillo: "#fbbc05",
  verde: "#34a853",
  negro: "#000",
};

export function buildGoogleMap(
  celdas: Celda[][],
  ancho: number,
  alto: number,
  colores: Record<string, string>,
  teletransportes: Record<string, Posicion>,
): void {
  buildBorderWalls(celdas, ancho, alto);
  const tramosPorFila: Record<number, [number, number, string?][]> = {
    1: [],
    2: [
      [2, 4],
      [6, 14, "azul"],
      [16, 30],
      [32, 39],
      [41, 42, "verde"],
      [44, 48],
      [50, 55],
    ],
    3: [
      [2, 4],
      [6, 14, "azul"],
      [16, 30],
      [32, 39],
      [41, 42, "verde"],
      [44, 48],
      [50, 55],
    ],
    4: [
      [6, 7, "azul"],
      [41, 42, "verde"],
    ],
    5: [
      [1, 4],
      [6, 7, "azul"],
      [16, 22, "rojo"],
      [24, 30, "amarillo"],
      [32, 39, "azul"],
      [41, 42, "verde"],
      [44, 50, "rojo"],
      [52, 56],
    ],
    6: [
      [1, 4],
      [6, 7, "azul"],
      [10, 14, "azul"],
      [16, 22, "rojo"],
      [24, 30, "amarillo"],
      [32, 33, "azul"],
      [34, 37, "negro"],
      [38, 39, "azul"],
      [41, 42, "verde"],
      [44, 50, "rojo"],
      [52, 56],
    ],
    7: [
      [1, 4],
      [6, 7, "azul"],
      [10, 14, "azul"],
      [16, 22, "rojo"],
      [18, 20, "negro"],
      [21, 22, "rojo"],
      [24, 25, "amarillo"],
      [26, 28, "negro"],
      [29, 30, "amarillo"],
      [32, 33, "azul"],
      [34, 37, "negro"],
      [38, 39, "azul"],
      [41, 42, "verde"],
      [44, 45, "rojo"],
      [46, 48, "negro"],
      [49, 50, "rojo"],
      [52, 56],
    ],
    8: [
      [6, 7, "azul"],
      [13, 14, "azul"],
      [16, 22, "rojo"],
      [18, 20, "negro"],
      [21, 22, "rojo"],
      [24, 25, "amarillo"],
      [26, 28, "negro"],
      [29, 30, "amarillo"],
      [32, 33, "azul"],
      [34, 37, "negro"],
      [38, 39, "azul"],
      [41, 42, "verde"],
      [44, 45, "rojo"],
      [46, 48, "negro"],
      [49, 50, "rojo"],
    ],
    9: [
      [1, 4],
      [6, 7, "azul"],
      [13, 14, "azul"],
      [16, 22, "rojo"],
      [18, 20, "negro"],
      [21, 22, "rojo"],
      [24, 25, "amarillo"],
      [26, 28, "negro"],
      [29, 30, "amarillo"],
      [32, 39, "azul"],
      [41, 42, "verde"],
      [44, 50, "rojo"],
      [52, 56],
    ],
    10: [
      [1, 4],
      [6, 14, "azul"],
      [16, 22, "rojo"],
      [24, 30, "amarillo"],
      [38, 39, "azul"],
      [41, 42, "verde"],
      [44, 45, "rojo"],
      [52, 56],
    ],
    11: [
      [1, 4],
      [6, 14, "azul"],
      [16, 22, "rojo"],
      [24, 30, "amarillo"],
      [32, 39, "azul"],
      [41, 42, "verde"],
      [44, 50, "rojo"],
      [52, 56],
    ],
    12: [],
    13: [
      [2, 4],
      [6, 14],
      [16, 30],
      [32, 39],
      [41, 42],
      [44, 48],
      [50, 55],
    ],
    14: [
      [2, 4],
      [6, 14],
      [16, 30],
      [32, 39],
      [41, 42],
      [44, 48],
      [50, 55],
    ],
    15: [],
  };

  for (const [fila, tramos] of Object.entries(tramosPorFila)) {
    for (const [desde, hasta, color] of tramos) {
      drawWall(
        celdas,
        { x: desde, y: Number(fila) },
        { x: hasta, y: Number(fila) },
      );

      for (let x = desde; x <= hasta; x++) {
        colores[`${x}-${fila}`] =
          (color && NOMBRES_COLORES[color]) ?? "#1919a6";
      }
    }
  }

  const tramosPorFilaVacia: Record<number, [number, number][]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [
      [0, 3],
      [53, 57],
    ],
    7: [],
    8: [
      [0, 1],
      [56, 57],
    ],
    9: [],
    10: [
      [0, 3],
      [53, 57],
    ],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
  };
  for (const [fila, tramos] of Object.entries(tramosPorFilaVacia)) {
    for (const [desde, hasta] of tramos) {
      drawWall(
        celdas,
        { x: desde, y: Number(fila) },
        { x: hasta, y: Number(fila) },
        Celda.Vacia,
      );
    }
  }

  const tramosPorFilaTunel: Record<number, [number, number][]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [[34, 37]],
    6: [[34, 37]],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
    13: [],
    14: [],
    15: [],
  };
  for (const [fila, tramos] of Object.entries(tramosPorFilaTunel)) {
    for (const [desde, hasta] of tramos) {
      drawWall(
        celdas,
        { x: desde, y: Number(fila) },
        { x: hasta, y: Number(fila) },
        Celda.Tunel,
      );
    }
  }

  buildTeleportPair(
    celdas,
    teletransportes,
    { x: 0, y: 8 },
    { x: ancho - 1, y: 8 },
  );
}

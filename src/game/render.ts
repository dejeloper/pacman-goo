import type {Game} from "./game";
import {Celda, TAMANO_CELDA} from "./mapa";

function drawMap(ctx: CanvasRenderingContext2D, state: Game): void {
  const {celdas} = state.mapa;

  for (let fila = 0; fila < celdas.length; fila++) {
    for (let columna = 0; columna < celdas[fila].length; columna++) {
      const x = columna * TAMANO_CELDA;
      const y = fila * TAMANO_CELDA;

      const celda = celdas[fila][columna];

      ctx.fillStyle = "black";
      ctx.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA);

      switch (celda) {
        case Celda.Border:
          ctx.fillStyle = "#949494";
          ctx.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
          break;
        case Celda.Pared:
          ctx.fillStyle = "#1919a6";
          ctx.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
          break;
        case Celda.Punto:
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(x + TAMANO_CELDA / 2, y + TAMANO_CELDA / 2, 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case Celda.PuntoGrande:
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(x + TAMANO_CELDA / 2, y + TAMANO_CELDA / 2, 5, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
    }
  }
}

function drawPacman(ctx: CanvasRenderingContext2D, state: Game): void {
  const {x, y} = state.pacman.posicion;

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(
    x * TAMANO_CELDA + TAMANO_CELDA / 2,
    y * TAMANO_CELDA + TAMANO_CELDA / 2,
    TAMANO_CELDA / 2,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

export function render(ctx: CanvasRenderingContext2D, state: Game): void {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawMap(ctx, state);
  drawPacman(ctx, state);
}

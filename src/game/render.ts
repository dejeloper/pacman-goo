import type {Game} from "./game";
import {Celda} from "./mapa";
import {debbug} from "./debug";

function drawMap(ctx: CanvasRenderingContext2D, state: Game): void {
  const {celdas, tamanoCelda: TAMANO_CELDA, colores} = state.mapa;

  for (let fila = 0; fila < celdas.length; fila++) {
    for (let columna = 0; columna < celdas[fila].length; columna++) {
      const x = columna * TAMANO_CELDA;
      const y = fila * TAMANO_CELDA;

      const celda = celdas[fila][columna];

      ctx.fillStyle = "black";
      ctx.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA);

      switch (celda) {
        case Celda.Border:
          ctx.fillStyle = debbug ? "#949494" : "#1919a6";
          ctx.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
          if (debbug) {
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const ultimaColumna = celdas[fila].length - 1;
            const ultimaFila = celdas.length - 1;
            const mostrarColumna = columna !== 0 && columna !== ultimaColumna;
            const mostrarFila = fila !== 0 && fila !== ultimaFila;
            const texto = [mostrarColumna ? columna : null, mostrarFila ? fila : null]
              .filter((valor) => valor !== null)
              .join("-");
            ctx.fillText(texto, x + TAMANO_CELDA / 2, y + TAMANO_CELDA / 2);
          }
          break;
        case Celda.Pared:
          ctx.fillStyle = colores[`${columna}-${fila}`] ?? "#1919a6";
          ctx.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
          break;
        case Celda.Punto:
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(x + TAMANO_CELDA / 2, y + TAMANO_CELDA / 2, TAMANO_CELDA / 10, 0, Math.PI * 2);
          ctx.fill();
          break;
        case Celda.PuntoGrande:
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(x + TAMANO_CELDA / 2, y + TAMANO_CELDA / 2, TAMANO_CELDA / 4, 0, Math.PI * 2);
          ctx.fill();
          break;
        case Celda.Tunel:
          ctx.strokeStyle = "#00e5ff";
          ctx.lineWidth = TAMANO_CELDA / 8;
          ctx.strokeRect(
            x + TAMANO_CELDA / 8,
            y + TAMANO_CELDA / 8,
            TAMANO_CELDA - TAMANO_CELDA / 4,
            TAMANO_CELDA - TAMANO_CELDA / 4,
          );
          break;
      }
    }
  }
}

function drawPacman(ctx: CanvasRenderingContext2D, state: Game, progreso: number): void {
  const {posicion, posicionAnterior} = state.pacman;
  const {tamanoCelda} = state.mapa;

  const x = posicionAnterior.x + (posicion.x - posicionAnterior.x) * progreso;
  const y = posicionAnterior.y + (posicion.y - posicionAnterior.y) * progreso;

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(
    x * tamanoCelda + tamanoCelda / 2,
    y * tamanoCelda + tamanoCelda / 2,
    tamanoCelda / 2,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

export function render(ctx: CanvasRenderingContext2D, state: Game, progreso = 1): void {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawMap(ctx, state);
  drawPacman(ctx, state, progreso);
}

import type {Game} from "./game";
import {Celda} from "./mapa";
import {debbug} from "./debug";
import type {Direccion} from "./pacman";

const ANGULO_DIRECCION: Record<Direccion, number> = {
  derecha: 0,
  abajo: Math.PI / 2,
  izquierda: Math.PI,
  arriba: -Math.PI / 2,
};

const BOCA_MAXIMA = Math.PI / 4;
const BOCA_QUIETO = Math.PI / 6;

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
  const {posicion, posicionAnterior, direccion} = state.pacman;
  const {tamanoCelda} = state.mapa;

  const x = posicionAnterior.x + (posicion.x - posicionAnterior.x) * progreso;
  const y = posicionAnterior.y + (posicion.y - posicionAnterior.y) * progreso;

  const cx = x * tamanoCelda + tamanoCelda / 2;
  const cy = y * tamanoCelda + tamanoCelda / 2;
  const radio = tamanoCelda / 2;

  const seMovio = posicionAnterior.x !== posicion.x || posicionAnterior.y !== posicion.y;
  const boca = seMovio ? BOCA_MAXIMA * Math.abs(Math.sin(progreso * Math.PI)) : BOCA_QUIETO;
  const anguloBase = ANGULO_DIRECCION[direccion];

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radio, anguloBase + boca, anguloBase - boca + Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

export function render(ctx: CanvasRenderingContext2D, state: Game, progreso = 1): void {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawMap(ctx, state);
  drawPacman(ctx, state, progreso);
}

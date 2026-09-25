import type {Game} from "./game";
import {Celda} from "./mapa";
import type {Direccion} from "./pacman";
import {
  DEATH_ANIMATION_TICKS,
  DEATH_FREEZE_TICKS,
  DEATH_TOTAL_TICKS,
} from "./speed";

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
          ctx.fillStyle = "#1919a6";
          ctx.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
          break;
        case Celda.Pared:
          ctx.fillStyle = colores[`${columna}-${fila}`] ?? "#1919a6";
          ctx.fillRect(x, y, TAMANO_CELDA, TAMANO_CELDA);
          break;
        case Celda.Punto:
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(
            x + TAMANO_CELDA / 2,
            y + TAMANO_CELDA / 2,
            TAMANO_CELDA / 10,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          break;
        case Celda.PuntoGrande:
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(
            x + TAMANO_CELDA / 2,
            y + TAMANO_CELDA / 2,
            TAMANO_CELDA / 4,
            0,
            Math.PI * 2,
          );
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
        case Celda.Transportador:
          ctx.strokeStyle = "#ff00ff";
          ctx.lineWidth = TAMANO_CELDA / 10;
          ctx.beginPath();
          ctx.arc(
            x + TAMANO_CELDA / 2,
            y + TAMANO_CELDA / 2,
            TAMANO_CELDA / 3,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
          break;
      }
    }
  }
}

function drawPacman(
  ctx: CanvasRenderingContext2D,
  state: Game,
  progreso: number,
): void {
  const {posicion, posicionAnterior, direccion} = state.pacman;
  const {tamanoCelda} = state.mapa;

  const x = posicionAnterior.x + (posicion.x - posicionAnterior.x) * progreso;
  const y = posicionAnterior.y + (posicion.y - posicionAnterior.y) * progreso;

  const cx = x * tamanoCelda + tamanoCelda / 2;
  const cy = y * tamanoCelda + tamanoCelda / 2;
  const radio = tamanoCelda / 2;

  const seMovio =
    posicionAnterior.x !== posicion.x || posicionAnterior.y !== posicion.y;
  let boca = seMovio
    ? BOCA_MAXIMA * Math.abs(Math.sin(progreso * Math.PI))
    : BOCA_QUIETO;
  const anguloBase = ANGULO_DIRECCION[direccion];

  let deathScale = 1;
  if (state.estado === "muerte") {
    const elapsedTicks = DEATH_TOTAL_TICKS - state.deathTicks + progreso;
    const animationTicks = Math.max(0, elapsedTicks - DEATH_FREEZE_TICKS);
    const deathProgress = Math.min(animationTicks / DEATH_ANIMATION_TICKS, 1);
    boca = Math.PI * deathProgress;
    deathScale = 1 - Math.max(0, deathProgress - 0.7) / 0.3;
  }

  ctx.fillStyle = state.invulnerableTicks > 0 && state.tick % 2 ? "#fff59d" : "yellow";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radio * deathScale, anguloBase + boca, anguloBase - boca + Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawGhosts(ctx: CanvasRenderingContext2D, state: Game, progreso: number): void {
  const size = state.mapa.tamanoCelda;
  for (const ghost of state.fantasmas) {
    const x = ghost.previousPosition.x + (ghost.posicion.x - ghost.previousPosition.x) * progreso;
    const y = ghost.previousPosition.y + (ghost.posicion.y - ghost.previousPosition.y) * progreso;
    const cx = x * size + size / 2;
    const cy = y * size + size / 2;
    const radius = size * 0.43;

    ctx.fillStyle = ghost.modo === "asustado" ? "#3155ff" : ghost.modo === "comido" ? "transparent" : ghost.color;
    if (ghost.modo !== "comido") {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, Math.PI, 0);
      ctx.lineTo(cx + radius, cy + radius);
      ctx.lineTo(cx + radius / 2, cy + radius * 0.65);
      ctx.lineTo(cx, cy + radius);
      ctx.lineTo(cx - radius / 2, cy + radius * 0.65);
      ctx.lineTo(cx - radius, cy + radius);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = "white";
    for (const offset of [-radius * 0.38, radius * 0.38]) {
      ctx.beginPath();
      ctx.arc(cx + offset, cy - radius * 0.12, radius * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#172554";
      ctx.beginPath();
      ctx.arc(cx + offset, cy - radius * 0.08, radius * 0.11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
    }
  }
}

export function render(
  ctx: CanvasRenderingContext2D,
  state: Game,
  progreso = 1,
): void {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawMap(ctx, state);
  drawGhosts(ctx, state, progreso);
  drawPacman(ctx, state, progreso);
}

import type {Game} from "./game";
import {movePacman} from "./movement";
import {INTERVALO_MS} from "./speed";
import {updateDeath, updateRules} from "./rules";

export function startGameLoop(
  state: Game,
  onFrame: (progreso: number) => void,
): void {
  let ultimoTick = performance.now();

  function frame(ahora: number): void {
    if (ahora - ultimoTick >= INTERVALO_MS) {
      movePacman(state);
      if (state.estado === "jugando") updateRules(state);
      else if (state.estado === "muerte") updateDeath(state);
      ultimoTick = ahora;
    }

    const progreso = Math.min((ahora - ultimoTick) / INTERVALO_MS, 1);
    onFrame(progreso);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

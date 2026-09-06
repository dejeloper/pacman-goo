import type { Game } from "./game";
import type { Direccion } from "./pacman";
import { canMoveTowards } from "./movement";

const TECLAS: Record<string, Direccion> = {
  ArrowUp: "arriba",
  ArrowDown: "abajo",
  ArrowLeft: "izquierda",
  ArrowRight: "derecha",
  w: "arriba",
  s: "abajo",
  a: "izquierda",
  d: "derecha",
};

export function listenKeyboard(state: Game): void {
  document.addEventListener("keydown", (evento) => {
    const direccion = TECLAS[evento.key];
    if (!direccion) return;
    if (!canMoveTowards(state, direccion)) return;

    state.pacman.direccionSiguiente = direccion;
  });
}

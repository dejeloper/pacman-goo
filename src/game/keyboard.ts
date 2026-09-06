import type { Game } from "./game";
import type { Direccion } from "./pacman";
import { movePacman } from "./movement";

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

export function listenKeyboard(state: Game, onMove: () => void): void {
  document.addEventListener("keydown", (evento) => {
    const direccion = TECLAS[evento.key];
    if (!direccion) return;

    state.pacman.direccion = direccion;
    state.pacman.direccionSiguiente = direccion;
    movePacman(state);
    onMove();
  });
}

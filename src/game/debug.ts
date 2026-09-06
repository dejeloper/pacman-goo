import type {Game} from "./game";

export let debbug = false;

export function renderDebug(state: Game): void {
  const elemento = document.getElementById("debug");
  if (!elemento) return;

  elemento.textContent = JSON.stringify(
    {
      pacman: state.pacman,
      puntos: state.puntos,
      vidas: state.vidas,
      nivel: state.nivel,
      estado: state.estado,
      fantasmas: state.fantasmas,
    },
    null,
    2,
  );
  console.clear();
  const {posicion, direccion, direccionSiguiente, velocidad} = state.pacman;
  console.log(posicion, direccion, direccionSiguiente, velocidad);

}

export function toggleDebugPanel(): void {
  const elemento = document.getElementById("debug");
  if (!elemento) return;

  debbug = !debbug;
  elemento.hidden = !elemento.hidden;
}

import type {Game} from "./game";

// DEBUG: panel temporal de estado en vivo, eliminar junto con el <pre id="debug"> del index.astro
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

// DEBUG: muestra/oculta el <pre id="debug">, botón "Ver log"
export function toggleDebugPanel(): void {
  const elemento = document.getElementById("debug");
  if (!elemento) return;

  elemento.hidden = !elemento.hidden;
}

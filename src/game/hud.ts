import type {Game} from "./game";

export function renderHud(state: Game): void {
  const puntajeElemento = document.getElementById("puntaje-valor");
  if (puntajeElemento) puntajeElemento.textContent = String(state.puntos.total);

  const vidasElemento = document.getElementById("vidas-valor");
  if (vidasElemento) vidasElemento.textContent = String(state.vidas.actuales);
}

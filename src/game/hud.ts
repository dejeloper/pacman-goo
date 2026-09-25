import type {Game} from "./game";

export function renderHud(state: Game): void {
  const puntajeElemento = document.getElementById("puntaje-valor");
  if (puntajeElemento) puntajeElemento.textContent = String(state.puntos.total);

  const vidasElemento = document.getElementById("vidas-valor");
  if (vidasElemento) vidasElemento.textContent = String(state.vidas.actuales);

  const levelElement = document.getElementById("nivel-valor");
  if (levelElement) levelElement.textContent = String(state.nivel.actual);

  const messageElement = document.getElementById("game-message");
  if (messageElement) {
    const messages = {
      menu: "PACMAN GOO\nPress Play",
      pausa: "PAUSED",
      muerte: "",
      victoria: "YOU WIN!\nPress Restart",
      derrota: "GAME OVER\nPress Restart",
      jugando: "",
    };
    messageElement.textContent = messages[state.estado];
    messageElement.classList.toggle("whitespace-pre-line", state.estado !== "jugando");
  }
}

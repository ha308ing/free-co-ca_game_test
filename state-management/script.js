import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { drawStatusText } from "./utils.js";

window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  loading.style.display = "none";
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");

  const player = new Player(canvas.width, canvas.height);

  const input = new InputHandler();

  let lastTimestamp = 0;
  function animate(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStatusText(ctx, input, player);
    player.update(input.lastKey, deltaTime);
    player.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate(0);
});

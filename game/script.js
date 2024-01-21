import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";

window.addEventListener("load", () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler();
      this.speed = 3;
    }

    update(deltaTime) {
      this.background.update();
      this.player.update(this.input.keys, deltaTime);
    }

    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTimestamp = 0;
  function animate(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate(0);
});

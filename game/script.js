import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";

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
      this.enemies = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.input = new InputHandler();
      this.speed = 0;
      this.speedMax = 3;
    }

    update(deltaTime) {
      this.background.update();
      this.player.update(this.input.keys, deltaTime);

      // handleEnemies
      if (this.enemyTimer < this.enemyInterval) {
        this.enemyTimer += deltaTime;
      } else {
        this.addEnemy();
        this.enemyTimer = 0;
      }

      this.enemies.forEach((enemy, i) => {
        enemy.update(deltaTime);
        if (enemy.markedToDelete) this.enemies.splice(i, 1);
      });
    }

    draw(context) {
      this.background.draw(context);
      this.enemies.forEach(e => e.draw(context));
      this.player.draw(context);
    }

    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      } else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }

      this.enemies.push(new FlyingEnemy(this));
      console.log(this.enemies);
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

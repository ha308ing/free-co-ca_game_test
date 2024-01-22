import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import { UI } from "./ui.js";

window.addEventListener("load", () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 900;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 40;
      this.background = new Background(this);
      this.player = new Player(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.enemyTimer = 0;
      this.enemyInterval = 500;
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.speed = 0;
      this.speedMax = 3;
      this.debug = false;
      this.score = 0;
      this.fontColor = "black";
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
      this.particlesLimit = 50;
      this.winningScore = 40;
      this.time = 0;
      this.timeLimit = 30000;
      this.gameOver = false;
      this.lives = 10;
    }

    update(deltaTime) {
      this.time += deltaTime;
      if (this.time > this.timeLimit || this.lives === 0) {
        this.gameOver = true;
      }
      this.background.update();
      this.player.update(this.input.keys, deltaTime);

      // handleEnemies
      if (this.enemyTimer < this.enemyInterval) {
        this.enemyTimer += deltaTime;
      } else {
        this.addEnemy();
        this.enemyTimer = 0;
      }

      this.enemies.forEach(enemy => {
        enemy.update(deltaTime);
      });
      this.enemies = this.enemies.filter(e => !e.markedToDelete);

      // handle particles
      this.particles.forEach(particle => {
        particle.update(deltaTime);
      });
      this.particles = this.particles.filter(p => !p.markedToDelete);

      if (this.particles.length > this.particlesLimit) {
        // or unshift where pushing in playerState
        // this.particles = this.particles.slice(-this.particlesLimit);
        this.particles.length = this.particlesLimit;
      }

      // handle collision sprites
      this.collisions.forEach(collision => {
        collision.update(deltaTime);
      });
      this.collisions = this.collisions.filter(c => !c.markedToDelete);

      // handle floating messages
      this.floatingMessages.forEach(message => {
        message.update();
      });
      this.floatingMessages = this.floatingMessages.filter(
        m => !m.markedToDelete
      );
    }

    draw(context) {
      this.background.draw(context);
      this.ui.draw(context);
      this.enemies.forEach(e => e.draw(context));
      this.particles.forEach(p => p.draw(context));
      this.collisions.forEach(c => c.draw(context));
      this.floatingMessages.forEach(m => m.draw(context));
      this.player.draw(context);
    }

    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      } else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }

      this.enemies.push(new FlyingEnemy(this));
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
    if (!game.gameOver) requestAnimationFrame(animate);
  }

  animate(0);
});
